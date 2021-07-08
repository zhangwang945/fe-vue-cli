/**
 * @description  自定义解析入口
 * @param {String} context
 * @param {String} entry
 * @returns {String}
 */
module.exports = function customizeResolveEntry (context = '', entry = '') {
  const hasExtensionName = /\.[a-z]+$/.test(entry)
  const fs = require('fs')
  if (entry && !hasExtensionName) {
    const possibleEntrys = [
      '.js',
      '.ts',
      '/index.js',
      '/index.ts',
      `/src/pages/${entry}`
    ]
    for (const possibleEntry of possibleEntrys) {
      const file = context + possibleEntry
      if (fs.existsSync(file)) {
        entry = file
        break
      }
    }
  }
  if (!entry) {
    const file = context + '/src/index.js'
    if (fs.existsSync(file)) {
      entry = file
    }
  }
  return entry
}
