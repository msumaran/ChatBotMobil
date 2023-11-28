const { getDefaultConfig } = require('metro-config');
const { getDefaultConfig: getExpoDefaultConfig } = require('@expo/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();
  const expoConfig = await getExpoDefaultConfig(__dirname);

  return {
    ...expoConfig,
    transformer: {
      ...expoConfig.transformer,
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      ...expoConfig.resolver,
      assetExts: [...defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg'), 'cjs'],
      sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
    },
  };
})();
