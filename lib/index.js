const { extend, interleave, program, tap } = require('@transformation/core');
const merges = require('./merges');
const regularCommits = require('./regularCommits');
const tags = require('./tags');
const repositoryUrl = require('./repositoryUrl');
const tagToMarkdown = require('./tagToMarkdown');
const addCommitSummary = require('./addCommitSummary');

const generateChangelog = async (originName, nextVersion) => {
  await program(
    tags({ nextVersion }),
    extend({
      originName,
      repositoryUrl: repositoryUrl({ originName }),
      merges: merges(),
      regularCommits: regularCommits(),
    }),
    addCommitSummary(),
    tagToMarkdown(),
    interleave(''),
    tap()
  );
};

module.exports = { generateChangelog };
