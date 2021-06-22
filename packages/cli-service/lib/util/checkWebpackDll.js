const crypto = require('crypto')
const fs = require('fs-extra')
const path = require('path')
const formatDllWebpackMessages = require('./formatDllWebpackMessages')
const { chalk, clearConsole } = require('@vue/cli-shared-utils')

const isInteractive = process.stdout.isTTY

function checkWebpackDll (api) {
  const appPackageJson = api.service.pkg
  const dependencies = appPackageJson.dllDependencies || {}
  const packages = Object.keys(dependencies).sort()
  if (packages.length <= 0) {
    return Promise.resolve()
  }

  const dependencyId = packages.map(pkg => `${pkg}@${dependencies[pkg]}`).join('')
  const dependencyHash = crypto
    .createHash('md5')
    .update(dependencyId)
    .digest('hex')
    .slice(0, 8)

  const context = api.service.context
  const mode = api.service.mode
  const cacheDirectory = path.resolve('.fea_cache', mode)

  const dllFileName = `dll.${dependencyHash}.js`
  const manifestFileName = `manifest.${dependencyHash}.json`
  const dllFilePath = path.join(cacheDirectory, dllFileName)
  const dllConfig = {
    scriptPath: dllFilePath,
    manifest: path.join(cacheDirectory, manifestFileName),
    mode,
    context
  }

  if (fs.existsSync(dllFilePath)) {
    return Promise.resolve(dllConfig)
  }

  fs.emptyDirSync(cacheDirectory)
  const createDllConfig = require('../config/dll')
  const config = createDllConfig({
    entryFiles: packages,
    outputDir: cacheDirectory,
    dllFileName: dllFileName,
    manifestFileName: manifestFileName,
    mode,
    context
  })
  return build(config, dllConfig).then(() => dllConfig)
}

function build (config, dllConfig) {
  if (isInteractive) {
    clearConsole()
  }
  console.log(chalk.cyan(`Creating a pre-bundled dll file to speed up ${dllConfig.mode}...\n`))

  const webpack = require('webpack')
  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages
      if (err) {
        if (!err.message) {
          return reject(err)
        }
        messages = formatDllWebpackMessages({
          errors: [err.message],
          warnings: []
        })
      } else {
        messages = formatDllWebpackMessages(stats.toJson({ all: false, warnings: true, errors: true }))
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1
        }
        return reject(new Error(messages.errors.join('\n\n')))
      }
      if (messages.warnings.length) {
        return reject(new Error(messages.warnings.join('\n\n')))
      }

      return resolve(dllConfig)
    })
  })
}

module.exports = checkWebpackDll
