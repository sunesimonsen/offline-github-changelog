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

const createChangelogPipeline = ({ originName, nextVersion, currentBranch }) =>
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
    addCommitSummary(),
  );

const markdownChangelogString = async ({
  originName = 'origin',
  currentBranch = 'master',
  nextVersion,
}) => {
  const [markdown] = await takeAll(
    createChangelogPipeline({ originName, nextVersion, currentBranch }),
    tagToMarkdown({ currentBranch }),
    join('\n\n'),
  );

  return markdown;
};

const printMarkdownChangelog = async ({
  originName = 'origin',
  currentBranch = 'master',
  nextVersion,
}) => {
  await program(
    createChangelogPipeline({ originName, nextVersion, currentBranch }),
    tagToMarkdown({ currentBranch }),
    interleave(''),
    tap(),
  );
};

module.exports = { printMarkdownChangelog, markdownChangelogString };
