const { generateChangelog } = require('../');

const { inspect } = require('util');
const { resolve } = require('path');
const sinon = require('sinon');
const expect = require('unexpected')
  .clone()
  .use(require('unexpected-snapshot'));

describe('offline-github-changelog', () => {
  const originalDir = process.cwd();

  beforeEach(() => {
    sinon.stub(console, 'log');
    process.chdir(resolve(__dirname, '..', 'testdata', 'repo'));
  });

  afterEach(() => {
    console.log.restore();
    process.chdir(originalDir);
  });

  function getOutput() {
    return console.log.args
      .map(values => {
        return values
          .map(value => (typeof value === 'string' ? value : inspect(value)))
          .join(' ');
      })
      .join('\n');
  }

  it('should generate a changelog', () => {
    generateChangelog();
    expect(
      getOutput(),
      'to match snapshot',
      `
      ### v1.0.1
      #### Pull requests

      - [#2](/pull/2) Feature for one oh one ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

      #### Commits to master

      - [Release 1.0.1](/commit/825179ea6b03098ebba60e433be57dfdcef2a3bd) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
      - [Another commit to master for 1.0.1](/commit/f9509628af0dc9753b4d7a69467e8f060fba85d0) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
      - [Commit to master for 1.0.1](/commit/e110b7590329843a20a26ffbb7b971ec3bfd9fd4) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

      ### v1.0.0
      #### Pull requests

      - [#1](/pull/1) Feature commit before first release ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

      #### Commits to master

      - [Release 1.0.0](/commit/e1fe60089ad08d31929707a1713d711e9a49b58c) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
      - [Commit to master before first release](/commit/36851b522fc40ada3bb85d52d77183db23285143) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

    `
    );
  });

  describe('with the next switch', () => {
    it('should attribute the latest commits on master to the given version', () => {
      generateChangelog(undefined, '1.2.3');
      expect(
        getOutput(),
        'to match snapshot',
        `
        ### v1.2.3 (2019-05-02)

        #### Pull requests

        - [#3](/pull/3) An unreleased feature ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

        #### Commits to master

        - [Unreleased commit on master](/commit/d3987d8212cb43ce39255877f75d45780c00b19a) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

        ### v1.0.1
        #### Pull requests

        - [#2](/pull/2) Feature for one oh one ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

        #### Commits to master

        - [Release 1.0.1](/commit/825179ea6b03098ebba60e433be57dfdcef2a3bd) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
        - [Another commit to master for 1.0.1](/commit/f9509628af0dc9753b4d7a69467e8f060fba85d0) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
        - [Commit to master for 1.0.1](/commit/e110b7590329843a20a26ffbb7b971ec3bfd9fd4) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

        ### v1.0.0
        #### Pull requests

        - [#1](/pull/1) Feature commit before first release ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

        #### Commits to master

        - [Release 1.0.0](/commit/e1fe60089ad08d31929707a1713d711e9a49b58c) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
        - [Commit to master before first release](/commit/36851b522fc40ada3bb85d52d77183db23285143) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

      `
      );
    });
  });
});
