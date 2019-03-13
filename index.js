const { spawnSync } = require('child_process');
const markdownEscape = require('markdown-escape');
const MAX_REGULAR_COMMITS_PER_RELEASE = 5;

const generateChangelog = (originName, next) => {
  const getOrigin = spawnSync('git', ['remote', 'get-url', originName]);

  const repositoryUrl = getOrigin.stdout
    .toString()
    .replace(/^git@github.com:/, 'https://github.com/')
    .replace(/\n/g, '')
    .replace(/.git$/, '');

  const getTags = spawnSync('git', [
    'for-each-ref',
    '--sort=taggerdate',
    '--format',
    '%(tag)|%(taggerdate:short)|%(objectname)',
    'refs/tags'
  ]);

  let lastCommittish = null;
  const tagInfos = getTags.stdout
    .toString()
    .split('\n')
    .filter(line => line && line.match(/^v?[0-9]+\.[0-9]+\.[0-9]+\|/))
    .map(line => {
      const [tag, date, committish] = line.split('|');
      return { tag, date, committish };
    });

  if (next) {
    tagInfos.push({
      tag: next.replace(/^v?/, 'v'), // Ensure leading v
      date: new Date().toJSON().replace(/T.*$/, ''), // Today in YYYY-MM-DD
      committish: 'master'
    });
  }

  const releaseInfos = tagInfos
    .map(({ tag, date, committish }) => {
      const commitRange = lastCommittish
        ? `${lastCommittish}..${committish}`
        : committish;

      const getMerges = spawnSync('git', [
        'log',
        '--merges',
        '--pretty=%s|||||%b|||||%H|||||[%an](mailto:%ae)|||||%P=====',
        commitRange
      ]);

      const merges = getMerges.stdout
        .toString()
        .split('=====\n')
        .filter(line => line && line.startsWith('Merge pull request'))
        .map(line => line.replace(/\n/g, ''))
        .map(line => line.split('|||||'))
        .map(([pullRequest, message, mergeHash, mergeAuthor, parents]) => {
          const pullRequestNumber = pullRequest.match(
            /Merge pull request #(\d+) from/
          )[1];
          const [from, to] = parents.split(' ');

          const getAuthors = spawnSync('git', [
            'log',
            '--pretty=[%an](mailto:%ae)',
            `${from}..${to}`
          ]);

          const authors = new Set(
            getAuthors.stdout
              .toString()
              .split('\n')
              .filter(line => line)
          );

          return {
            authors: Array.from(authors).sort(),
            mergeAuthor,
            message,
            pullRequestNumber
          };
        });

      const getRegularCommits = spawnSync('git', [
        'log',
        '--no-merges',
        '--first-parent',
        '--pretty=%s|||||%b|||||%H|||||[%an](mailto:%ae)|||||%P=====',
        commitRange
      ]);

      const regularCommits = getRegularCommits.stdout
        .toString()
        .split('=====\n')
        // Crudely skip version commits (with "x.y.z" message):
        .filter(line => line && !/^[\d+.-]+\|\|\|\|\|/.test(line))
        .map(line => line.replace(/\n/g, ''))
        .map(line => line.split('|||||'))
        .map(([message, body, commitHash, author]) => {
          return {
            author,
            message,
            commitHash
          };
        });

      lastCommittish = committish;

      return {
        tag,
        date,
        merges,
        regularCommits
      };
    })
    .reverse();

  for (const [
    i,
    { tag, date, merges, regularCommits }
  ] of releaseInfos.entries()) {
    if (merges.length > 0 || regularCommits.length > 0) {
      console.log(`### ${tag} (${date})\n`);
      if (merges.length > 0) {
        if (regularCommits.length > 0) {
          console.log(`#### Pull requests\n`);
        }

        for (const { authors, message, pullRequestNumber } of merges) {
          console.log(
            `- [#${pullRequestNumber}](${repositoryUrl}/pull/${pullRequestNumber}) ${markdownEscape(
              message
            )} (${authors.join(', ')})`
          );
        }
        console.log();
      }

      if (regularCommits.length > 0) {
        if (merges.length > 0) {
          console.log(`#### Commits to master\n`);
        }

        for (const { author, message, commitHash } of regularCommits.slice(
          0,
          MAX_REGULAR_COMMITS_PER_RELEASE
        )) {
          console.log(
            `- [${markdownEscape(
              message
            )}](${repositoryUrl}/commit/${commitHash}) (${author})`
          );
        }
        if (regularCommits.length > MAX_REGULAR_COMMITS_PER_RELEASE) {
          let compareFrom;
          if (i === releaseInfos.length - 1) {
            compareFrom = `${regularCommits[0].commitHash}^`;
          } else {
            compareFrom = releaseInfos[i + 1].tag;
          }
          const targetUrl = `${repositoryUrl}/compare/${encodeURIComponent(
            compareFrom
          )}...${encodeURIComponent(tag)}`;
          console.log(
            `- [+${regularCommits.length -
              MAX_REGULAR_COMMITS_PER_RELEASE} more](${targetUrl})`
          );
        }
        console.log();
      }
    }
  }
};

module.exports = { generateChangelog };
