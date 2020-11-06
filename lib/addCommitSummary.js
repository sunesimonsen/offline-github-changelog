const { extend } = require('@transformation/core');

const MAX_REGULAR_COMMITS_PER_RELEASE = 5;

const addCommitSummary = () =>
  extend({
    commitSummary: ({ regularCommits }) =>
      regularCommits.slice(0, MAX_REGULAR_COMMITS_PER_RELEASE),
    moreCommits: ({ regularCommits }) =>
      Math.max(regularCommits.length - MAX_REGULAR_COMMITS_PER_RELEASE, 0),
  });

module.exports = addCommitSummary;
