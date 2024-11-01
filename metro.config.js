const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'],
    assetExts: ['vrm', 'gltf', 'obj', 'png', 'jpg', 'fbx', 'glb', 'json', 'onnx', 'wav'], // TODO - remove `wav` file format as it is only needed for testing
  },
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config)
