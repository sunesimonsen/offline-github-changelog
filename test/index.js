const { markdownChangelogString } = require('../');

const { resolve } = require('path');
const sinon = require('sinon');
const expect = require('unexpected')
  .clone()
  .use(require('unexpected-snapshot'));

describe('offline-github-changelog', () => {
  const originalDir = process.cwd();
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers({
      now: new Date('2019-05-02T12:34:56.789Z'),
      toFake: ['Date'],
    });
    process.chdir(resolve(__dirname, '..', 'testdata', 'repo'));
  });

  afterEach(() => {
    clock.restore();
    process.chdir(originalDir);
  });

  it('should generate a changelog', async () => {
    const output = await markdownChangelogString({
      originName: 'origin',
      currentBranch: 'master',
    });

    expect(
      output,
      'to equal snapshot',
      expect.unindent`
        ### v1.0.1

        #### Pull requests

        - [#2](https://github.com/papandreou/offline-github-changelog-test1/pull/2) Feature for one oh one ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

        #### Commits to master

        - [Release 1.0.1](https://github.com/papandreou/offline-github-changelog-test1/commit/825179ea6b03098ebba60e433be57dfdcef2a3bd) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
        - [Another commit to master for 1.0.1](https://github.com/papandreou/offline-github-changelog-test1/commit/f9509628af0dc9753b4d7a69467e8f060fba85d0) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
        - [Commit to master for 1.0.1](https://github.com/papandreou/offline-github-changelog-test1/commit/e110b7590329843a20a26ffbb7b971ec3bfd9fd4) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

        ### v1.0.0

        #### Pull requests

        - [#1](https://github.com/papandreou/offline-github-changelog-test1/pull/1) Feature commit before first release ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

        #### Commits to master

        - [Release 1.0.0](https://github.com/papandreou/offline-github-changelog-test1/commit/e1fe60089ad08d31929707a1713d711e9a49b58c) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
        - [Commit to master before first release](https://github.com/papandreou/offline-github-changelog-test1/commit/36851b522fc40ada3bb85d52d77183db23285143) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))`,
    );
  });

  describe('with the next switch', () => {
    it('should attribute the latest commits on master to the given version', async () => {
      const output = await markdownChangelogString({
        originName: 'origin',
        nextVersion: '1.2.3',
        currentBranch: 'master',
      });

      expect(
        output,
        'to equal snapshot',
        expect.unindent`
          ### v1.2.3 (2019-05-02)

          #### Pull requests

          - [#123](https://github.com/papandreou/offline-github-changelog-test1/pull/123) The title of some PR ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
          - [#3](https://github.com/papandreou/offline-github-changelog-test1/pull/3) An unreleased feature ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          #### Commits to master

          - [HTML in commit message: &lt;html dir="rtl"&gt;](https://github.com/papandreou/offline-github-changelog-test1/commit/af22733adbc2fc4977862348f68d152b754b4516) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
          - [Unreleased commit on master](https://github.com/papandreou/offline-github-changelog-test1/commit/d3987d8212cb43ce39255877f75d45780c00b19a) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          ### v1.0.1

          #### Pull requests

          - [#2](https://github.com/papandreou/offline-github-changelog-test1/pull/2) Feature for one oh one ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          #### Commits to master

          - [Release 1.0.1](https://github.com/papandreou/offline-github-changelog-test1/commit/825179ea6b03098ebba60e433be57dfdcef2a3bd) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
          - [Another commit to master for 1.0.1](https://github.com/papandreou/offline-github-changelog-test1/commit/f9509628af0dc9753b4d7a69467e8f060fba85d0) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
          - [Commit to master for 1.0.1](https://github.com/papandreou/offline-github-changelog-test1/commit/e110b7590329843a20a26ffbb7b971ec3bfd9fd4) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          ### v1.0.0

          #### Pull requests

          - [#1](https://github.com/papandreou/offline-github-changelog-test1/pull/1) Feature commit before first release ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          #### Commits to master

          - [Release 1.0.0](https://github.com/papandreou/offline-github-changelog-test1/commit/e1fe60089ad08d31929707a1713d711e9a49b58c) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
          - [Commit to master before first release](https://github.com/papandreou/offline-github-changelog-test1/commit/36851b522fc40ada3bb85d52d77183db23285143) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))`,
      );
    });
  });

  describe('with the number of commits per release switch', () => {
    it('should truncate to the number of commits specified', async () => {
      const output = await markdownChangelogString({
        originName: 'origin',
        currentBranch: 'master',
        maxCommits: 1,
      });

      expect(
        output,
        'to equal snapshot',
        expect.unindent`
          ### v1.0.1

          #### Pull requests

          - [#2](https://github.com/papandreou/offline-github-changelog-test1/pull/2) Feature for one oh one ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          #### Commits to master

          - [Release 1.0.1](https://github.com/papandreou/offline-github-changelog-test1/commit/825179ea6b03098ebba60e433be57dfdcef2a3bd) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
          - [+2 more](https://github.com/papandreou/offline-github-changelog-test1/compare/v1.0.0...v1.0.1)

          ### v1.0.0

          #### Pull requests

          - [#1](https://github.com/papandreou/offline-github-changelog-test1/pull/1) Feature commit before first release ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          #### Commits to master

          - [Release 1.0.0](https://github.com/papandreou/offline-github-changelog-test1/commit/e1fe60089ad08d31929707a1713d711e9a49b58c) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
          - [+1 more](https://github.com/papandreou/offline-github-changelog-test1/compare/e1fe60089ad08d31929707a1713d711e9a49b58c...v1.0.0)`,
      );
    });

    it('should fallback to 0 if a negative number of commits is provided', async () => {
      const output = await markdownChangelogString({
        originName: 'origin',
        currentBranch: 'master',
        maxCommits: -1,
      });

      expect(
        output,
        'to equal snapshot',
        expect.unindent`
          ### v1.0.1

          #### Pull requests

          - [#2](https://github.com/papandreou/offline-github-changelog-test1/pull/2) Feature for one oh one ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          ### v1.0.0

          #### Pull requests

          - [#1](https://github.com/papandreou/offline-github-changelog-test1/pull/1) Feature commit before first release ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))`,
      );
    });

    it('should handle 0 as the number of regular commits to show', async () => {
      const output = await markdownChangelogString({
        originName: 'origin',
        currentBranch: 'master',
        maxCommits: 0,
      });

      expect(
        output,
        'to equal snapshot',
        expect.unindent`
          ### v1.0.1

          #### Pull requests

          - [#2](https://github.com/papandreou/offline-github-changelog-test1/pull/2) Feature for one oh one ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          ### v1.0.0

          #### Pull requests

          - [#1](https://github.com/papandreou/offline-github-changelog-test1/pull/1) Feature commit before first release ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))`,
      );
    });

    it('should work with `nextVersion`', async () => {
      const output = await markdownChangelogString({
        originName: 'origin',
        currentBranch: 'master',
        nextVersion: '1.2.3',
        maxCommits: 1,
      });

      expect(
        output,
        'to equal snapshot',
        expect.unindent`
          ### v1.2.3 (2019-05-02)

          #### Pull requests

          - [#123](https://github.com/papandreou/offline-github-changelog-test1/pull/123) The title of some PR ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
          - [#3](https://github.com/papandreou/offline-github-changelog-test1/pull/3) An unreleased feature ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          #### Commits to master

          - [HTML in commit message: &lt;html dir="rtl"&gt;](https://github.com/papandreou/offline-github-changelog-test1/commit/af22733adbc2fc4977862348f68d152b754b4516) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
          - [+1 more](https://github.com/papandreou/offline-github-changelog-test1/compare/v1.0.1...v1.2.3)

          ### v1.0.1

          #### Pull requests

          - [#2](https://github.com/papandreou/offline-github-changelog-test1/pull/2) Feature for one oh one ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          #### Commits to master

          - [Release 1.0.1](https://github.com/papandreou/offline-github-changelog-test1/commit/825179ea6b03098ebba60e433be57dfdcef2a3bd) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
          - [+2 more](https://github.com/papandreou/offline-github-changelog-test1/compare/v1.0.0...v1.0.1)

          ### v1.0.0

          #### Pull requests

          - [#1](https://github.com/papandreou/offline-github-changelog-test1/pull/1) Feature commit before first release ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          #### Commits to master

          - [Release 1.0.0](https://github.com/papandreou/offline-github-changelog-test1/commit/e1fe60089ad08d31929707a1713d711e9a49b58c) ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
          - [+1 more](https://github.com/papandreou/offline-github-changelog-test1/compare/e1fe60089ad08d31929707a1713d711e9a49b58c...v1.0.0)`,
      );
    });

    it('should work with `nextVersion` and 0 commits', async () => {
      const output = await markdownChangelogString({
        originName: 'origin',
        currentBranch: 'master',
        nextVersion: '1.2.3',
        maxCommits: 0,
      });

      expect(
        output,
        'to equal snapshot',
        expect.unindent`
          ### v1.2.3 (2019-05-02)

          #### Pull requests

          - [#123](https://github.com/papandreou/offline-github-changelog-test1/pull/123) The title of some PR ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
          - [#3](https://github.com/papandreou/offline-github-changelog-test1/pull/3) An unreleased feature ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          ### v1.0.1

          #### Pull requests

          - [#2](https://github.com/papandreou/offline-github-changelog-test1/pull/2) Feature for one oh one ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          ### v1.0.0

          #### Pull requests

          - [#1](https://github.com/papandreou/offline-github-changelog-test1/pull/1) Feature commit before first release ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))`,
      );
    });

    it('should work with `nextVersion` and negative number of commits', async () => {
      const output = await markdownChangelogString({
        originName: 'origin',
        currentBranch: 'master',
        nextVersion: '1.2.3',
        maxCommits: -2,
      });

      expect(
        output,
        'to equal snapshot',
        expect.unindent`
          ### v1.2.3 (2019-05-02)

          #### Pull requests

          - [#123](https://github.com/papandreou/offline-github-changelog-test1/pull/123) The title of some PR ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))
          - [#3](https://github.com/papandreou/offline-github-changelog-test1/pull/3) An unreleased feature ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          ### v1.0.1

          #### Pull requests

          - [#2](https://github.com/papandreou/offline-github-changelog-test1/pull/2) Feature for one oh one ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))

          ### v1.0.0

          #### Pull requests

          - [#1](https://github.com/papandreou/offline-github-changelog-test1/pull/1) Feature commit before first release ([Andreas Lind](mailto:andreaslindpetersen@gmail.com))`,
      );
    });
  });
});
