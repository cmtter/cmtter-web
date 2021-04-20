const fs = require('fs')
const jetpack = require('fs-jetpack')
const { join } = require('path')
/**
 * 参考实现 fs-jetpack/lib/utils/tree_walker
 * @param {}} path 
 * @param {}} result 
 * @param {*} callback 
 */
function workDirTree(path, result, callback) {
  fs.readdirSync(path, { withFileTypes: true }).forEach((direntItem) => {
    const withFileTypesNotSupported = typeof direntItem === "string";
    let fileItemPath;
    if (withFileTypesNotSupported) {
      fileItemPath = join(path, direntItem);
    } else {
      fileItemPath = join(path, direntItem.name);
    }
    // 获取文件或文件目录信息,参考 https://www.npmjs.com/package/fs-jetpack#inspectpath-options
    const obj = jetpack.inspect(fileItemPath)
    const childrens = result.childrens || (result.childrens = [])
    let item = { type: obj.type, name: obj.name }
    if (typeof callback === 'function') {
      item = callback(item, path, result)
      if (item) {
        childrens.push(item)
      }
    } else {
      childrens.push(item)
    }

    if (obj.type === 'dir') {
      workDirTree(fileItemPath, item, callback)
    }
  })
}

export default workDirTree
//module.exports = workDirTree