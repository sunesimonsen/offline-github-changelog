const semver = require('semver');

const {
  accumulate,
  appendItems,
  filter,
  pipeline,
  reverse,
  sort,
} = require('@transformation/core');

const { spawn } = require('@transformation/process');
const { lines } = require('@transformation/stream');

const tagRegex = /^refs\/tags\/v?[0-9]+\.[0-9]+\.[0-9]+\|/;

const tags = ({ nextVersion, currentBranch }) =>
  pipeline(
    spawn('git', [
      'for-each-ref',
      '--format',
      '%(refname)|%(taggerdate:short)|%(objectname)',
      'refs/tags',
    ]),
    lines(),
    filter((line) => tagRegex.test(line)),
    (line) => {
      const [ref, date, committish] = line.split('|');
      const tag = ref.replace(/^refs\/tags\/v?/, 'v');
      return { tag, date, committish };
    },
    nextVersion &&
      appendItems({
        tag: nextVersion.replace(/^v?/, 'v'),
        date: new Date().toJSON().replace(/T.*$/, ''),
        committish: currentBranch,
      }),
    sort(({ tag: a }, { tag: b }) =>
      semver.lt(a, b) ? -1 : semver.gt(a, b) ? 1 : 0
    ),
    accumulate(
      (current, previous) => ({
        previousTag: previous.tag,
        commitRange: previous.tag
          ? `${previous.committish}..${current.committish}`
          : current.committish,
        ...current,
      }),
      {}
    ),
    reverse()
  );

module.exports = tags;
