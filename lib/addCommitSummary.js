const { extend } = require('@transformation/core');

const resolveNumberCommits = (numberCommits) =>
  numberCommits < 0 ? 0 : numberCommits;

const addCommitSummary = ({ numberCommits }) =>
  extend({
    commitSummary: ({ regularCommits }) =>
      regularCommits.slice(0, resolveNumberCommits(numberCommits)),
    moreCommits: ({ regularCommits }) =>
      Math.max(regularCommits.length - resolveNumberCommits(numberCommits), 0),
  });

module.exports = addCommitSummary;
