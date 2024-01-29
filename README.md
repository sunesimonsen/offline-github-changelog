## offline-github-changelog

[![Actions Status: test](https://github.com/sunesimonsen/offline-github-changelog/workflows/test/badge.svg)](https://github.com/sunesimonsen/offline-github-changelog/actions?query=workflow%3A"test")

This is a changelog generator for Github projects. It generates markdown based on your version tags and pull request merges.

Example [unexpected.js.org changelog](https://github.com/unexpectedjs/unexpected/blob/master/CHANGELOG.md).

### Installation

```sh
npm install offline-github-changelog
```

### Usage

```sh
offline-github-changelog > CHANGELOG.md

# with a different remote
offline-github-changelog --remote=myremote > CHANGELOG.md

# with the max number of commits per release, omitting it defaults to 5
offline-github-changelog --max-commits 3 > CHANGELOG.md

# with 0 to not show the commits section, a negative value fallback to 0
offline-github-changelog --max-commits 0 > CHANGELOG.md
```

### Releases

[Changelog](./CHANGELOG.md)

### License (MIT)

Copyright (c) 2017 Sune Simonsen <sune@we-knowhow.dk>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the 'Software'), to deal in the Software without
restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
