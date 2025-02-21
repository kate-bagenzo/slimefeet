const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'favicon',
    unpack: "*.{node,dll,so}",
    unpackDir: "node_modules/steamworks.js/dist/**/"
  },
  extraResource: [
    "./node_modules/steamworks.js/dist/win64/steam_api64.dll",
    "./node_modules/steamworks.js/dist/win64/steam_api64.lib",
    "./node_modules/steamworks.js/dist/linux64/libsteam_api.so",
    "./node_modules/steamworks.js/dist/linux64/steamworksjs.linux-x64-gnu.node",
    "./node_modules/steamworks.js/dist/osx/libsteam_api.dylib",
    "./node_modules/steamworks.js/dist/osx/steamworksjs.darwin-arm64.node",
    "./node_modules/steamworks.js/dist/osx/steamworksjs.darwin-x64.node",
  ],
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-zip',
      config: {
        options: {
          icon: 'src/slimefeet.png'
        }
      }
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
