const {
  extend,
  interleave,
  join,
  parallel,
  pipeline,
  program,
  takeAll,
  tap,
} = require('@transformation/core');

const merges = require('./merges');
const regularCommits = require('./regularCommits');
const tags = require('./tags');
const repositoryUrl = require('./repositoryUrl');
const tagToMarkdown = require('./tagToMarkdown');
const addCommitSummary = require('./addCommitSummary');

const createChangelogPipeline = ({
  originName,
  nextVersion,
  currentBranch,
  numberCommits,
}) =>
  pipeline(
    tags({ nextVersion, currentBranch }),
    parallel(
      extend({
        originName,
        repositoryUrl: repositoryUrl({ originName }),
        merges: merges(),
        regularCommits: regularCommits(),
      }),
    ),
    addCommitSummary({ numberCommits }),
  );

const markdownChangelogString = async ({
  originName = 'origin',
  currentBranch = 'master',
  numberCommits = 5,
  nextVersion,
}) => {
  const [markdown] = await takeAll(
    createChangelogPipeline({
      originName,
      nextVersion,
      currentBranch,
      numberCommits,
    }),
    tagToMarkdown({ currentBranch }),
    join('\n\n'),
  );

  return markdown;
};

const printMarkdownChangelog = async ({
  originName = 'origin',
  currentBranch = 'master',
  numberCommits = 5,
  nextVersion,
}) => {
  await program(
    createChangelogPipeline({
      originName,
      nextVersion,
      currentBranch,
      numberCommits,
    }),
    tagToMarkdown({ currentBranch }),
    interleave(''),
    tap(),
  );
};

module.exports = { printMarkdownChangelog, markdownChangelogString };
