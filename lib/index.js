const {
  extend,
  interleave,
  parallel,
  program,
  tap,
} = require('@transformation/core');

const merges = require('./merges');
const regularCommits = require('./regularCommits');
const tags = require('./tags');
const repositoryUrl = require('./repositoryUrl');
const tagToMarkdown = require('./tagToMarkdown');
const addCommitSummary = require('./addCommitSummary');

const generateChangelog = async ({
  originName,
  nextVersion,
  currentBranch,
}) => {
  await program(
    tags({ nextVersion, currentBranch }),
    parallel(
      extend({
        originName,
        repositoryUrl: repositoryUrl({ originName }),
        merges: merges(),
        regularCommits: regularCommits(),
      })
    ),
    addCommitSummary(),
    tagToMarkdown({ currentBranch }),
    interleave(''),
    tap()
  );
};

module.exports = { generateChangelog };
