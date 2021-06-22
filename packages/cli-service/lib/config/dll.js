'use strict'

const webpack = require('webpack')
const path = require('path')
// const ModuleNotFoundPlugin = require('@fea/dev-utils/ModuleNotFoundPlugin')
// const paths = require('../../paths')

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = function (entryConfig) {
  const context = entryConfig.context
  return {
    // resolve entry from appPath
    context,
    mode: entryConfig.mode,
    // Don't attempt to continue if there are any errors.
    bail: true,
    // do not generate source-map for none-app src
    devtool: false,
    // In production, we only want to load the app code.
    entry: entryConfig.entryFiles,
    output: {
      // The cache folder.
      path: entryConfig.outputDir,
      filename: entryConfig.dllFileName,
      library: 'feaWebpackDll'
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs)$/,
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            configFile: false,
            compact: false,
            presets: [
              [
                require.resolve('vue-cli-plugin-babel-lanyi/preset'),
                { helpers: true }
              ]
            ],
            cacheDirectory: true,
            // If an error happens in a package, it's possible to be
            // because it was compiled. Thus, we don't want the browser
            // debugger to show the original code. Instead, the code
            // being evaluated would be much more helpful.
            sourceMaps: false
          }
        }
      ]
    },
    plugins: [
      // new ModuleNotFoundPlugin(paths.appPath),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      }),
      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how Webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DllPlugin({
        context: context,
        path: path.join(entryConfig.outputDir, entryConfig.manifestFileName),
        name: 'feaWebpackDll'
      })
    ],

    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    },
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false
  }
}
