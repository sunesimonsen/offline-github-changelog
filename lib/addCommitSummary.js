const { extend } = require('@transformation/core');

const addCommitSummary = ({ maxCommits }) =>
  extend({
    commitSummary: ({ regularCommits }) =>
      regularCommits.slice(0, Math.max(maxCommits, 0)),
    moreCommits: ({ regularCommits }) =>
      Math.max(regularCommits.length - Math.max(maxCommits, 0), 0),
  });

module.exports = addCommitSummary;
