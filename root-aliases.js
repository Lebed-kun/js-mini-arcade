const path = require('path');

const aliases = [
  "@",
  '@core',
  '@game',
];

const generator = () => {
  const aliasesMap = {};
  for (const a of aliases) {
    aliasesMap[a] = path.resolve(`src/${a.replace('@', '')}`);
  }

  return aliasesMap;
};

module.exports = {
  aliases: generator(),
};
