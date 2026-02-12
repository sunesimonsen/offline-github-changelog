const { pipeline } = require('@transformation/core');
const { spawn } = require('@transformation/process');
const { concat } = require('@transformation/stream');

const repositoryUrl = ({ originName }) =>
  pipeline(
    () => spawn('git', ['remote', 'get-url', originName]),
    concat(),
    (url) => url.trim(),
    (url) => url.replace(/^git@github.com:/, 'https://github.com/'),
    (url) => url.replace(/^ssh:\/\/git@github.com\//, 'https://github.com/'),
    (url) => url.replace(/.git$/, ''),
  );

module.exports = repositoryUrl;
