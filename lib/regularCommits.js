const { filter, pipeline, toArray } = require('@transformation/core');
const { spawn } = require('@transformation/process');
const { lines } = require('@transformation/stream');

const regularCommits = () =>
  pipeline(
    ({ commitRange }) =>
      spawn('git', [
        'log',
        '--no-merges',
        '--first-parent',
        '--pretty=%s|||||%b|||||%H|||||[%an](mailto:%ae)|||||%P=====',
        commitRange,
      ]),
    lines('=====\n'),
    filter((line) => line && !/^[\d+.-]+\|\|\|\|\|/.test(line)),
    (line) => line.trim().replace(/\n/g, '').split('|||||'),
    ([message, body, commitHash, author]) => ({
      author,
      message,
      commitHash,
    }),
    toArray()
  );

module.exports = regularCommits;
