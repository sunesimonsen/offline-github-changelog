const {
  extend,
  filter,
  pipeline,
  sort,
  transform,
  map,
  uniq,
  skipLast,
  toArray,
} = require('@transformation/core');

const { spawn } = require('@transformation/process');
const { lines } = require('@transformation/stream');

const merges = () =>
  pipeline(
    ({ commitRange }) =>
      spawn('git', [
        'log',
        '--merges',
        '--pretty=%s|||||%b|||||%H|||||[%an](mailto:%ae)|||||%P=====',
        commitRange,
      ]),
    lines('=====\n'),
    filter(
      (line) =>
        (line && line.startsWith('Merge pull request')) ||
        / \(#\d+\)/.test(line)
    ),
    (line) =>
      line
        .trim()
        .replace(/(\r?\n)+/g, ' ')
        .split('|||||'),
    ([pullRequest, message, mergeHash, mergeAuthor, parents]) => ({
      pullRequest,
      message: message.trim(),
      mergeHash,
      mergeAuthor,
      parents,
    }),
    transform({
      parents: map((parents) => parents.split(' ')),
    }),
    map((item) => {
      const { pullRequest, message, parents } = item;
      const [from, to] = parents;

      if (pullRequest.startsWith('Merge pull request')) {
        return {
          pullRequestNumber: pullRequest.match(
            /Merge pull request #(\d+) from/
          )[1],
          from,
          to,
          ...item,
        };
      } else {
        const matchPullRequest = pullRequest.match(/^(.*) \(#(\d+)\)/);

        return {
          ...item,
          message: matchPullRequest[1] || message,
          pullRequestNumber: matchPullRequest[2],
          from,
          to,
        };
      }
    }),
    extend({
      authors: pipeline(
        ({ from, to }) =>
          spawn('git', ['log', '--pretty=[%an](mailto:%ae)', `${from}..${to}`]),
        lines(),
        skipLast(),
        sort(),
        uniq({ scope: 'pipeline' }),
        toArray()
      ),
    }),
    toArray()
  );

module.exports = merges;
