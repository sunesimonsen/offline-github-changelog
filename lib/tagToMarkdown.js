const markdownEscape = require('markdown-escape');
const path = require('path');
const { filter, pipeline } = require('@transformation/core');
const { renderTemplate } = require('@transformation/ejs');

const templateDir = path.join(__dirname, 'templates');

const tagToMarkdown = ({ currentBranch }) =>
  pipeline(
    renderTemplate(path.join(templateDir, 'markdown.ejs'), {
      context: { markdownEscape, currentBranch },
      root: templateDir,
    }),
    (markdown) => markdown.trim(),
    filter(Boolean)
  );

module.exports = tagToMarkdown;
