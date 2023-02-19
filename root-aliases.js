const path = require('path');

const srcAliases = [
  "@",
  '@core',
  '@game',
  "@gui",
];

const assetsAlias = '@assets';

const srcGenerator = () => {
  const aliasesMap = {};
  for (const a of srcAliases) {
    aliasesMap[a] = path.resolve(`src/${a.replace('@', '')}`);
  }

  return aliasesMap;
};

const assetsGenerator = () => {
  return {
    [assetsAlias]: path.resolve('assets'),
  };
};

module.exports = {
  srcAliases: srcGenerator(),
  assetsAliases: assetsGenerator(),
};
