/**
 * @description  自定义解析入口
 * @param {String} context
 * @param {String} entry
 * @returns {String}
 */
module.exports = function customizeResolveEntry (context = '', entry = '') {
  const hasExtensionName = /\.[a-z]+$/.test(entry)
  if (entry && !hasExtensionName) {
    const possibleEntrys = [
      '.js',
      '.ts',
      '/index.js',
      '/index.ts',
      `/src/pages/${entry}`
    ]
    const fs = require('fs')
    for (const possibleEntry of possibleEntrys) {
      const file = context + possibleEntry
      if (fs.existsSync(file)) {
        entry = file
        break
      }
    }
  }
  return entry
}
