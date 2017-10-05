const { spawnSync } = require("child_process");

const generateChangelog = () => {
  const getTags = spawnSync("git", [
    "for-each-ref",
    "--sort=taggerdate",
    "--format",
    "%(tag)|%(taggerdate:short)|%(objectname)",
    "refs/tags"
  ]);

  let lastHash = null;
  const tags = getTags.stdout
        .toString()
        .split("\n")
        .filter(line => line && line.match(/^v?[0-9]+\.[0-9]+\.[0-9]+\|/))
        .map(line => {
          const [tag, date, hash] = line.split("|");

          const getMerges = spawnSync("git", [
            "log",
            "--merges",
            "--pretty=%s|%b ([%an](mailto://%ae))",
            lastHash ? `${lastHash}..${hash}` : hash
          ]);
          lastHash = hash;

          const merges = getMerges.stdout
                .toString()
                .split("\n")
                .filter(line => line && line.startsWith('Merge pull request'))
                .map(line => line.replace(/Merge pull request (\S+ )from [^|]+\|/, "$1"));

          return {
            tag,
            date,
            merges
          };
        });

  tags.reverse().forEach(({ tag, date, merges }) => {
    if (merges.length > 0) {
      console.log(`### ${tag} (${date})\n`);
      merges.forEach(merge => {
        console.log(`- ${merge}`);
      });

      console.log();
    }
  });
}

module.exports = generateChangelog
