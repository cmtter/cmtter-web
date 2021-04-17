const path = require('path')
const fs = require('fs')
import getExistFile from './get-exist-file'
const root = process.cwd()
export default function (options) {
  return {
    ...createAppLayout(options),
    ...getTempPath(options),
    root
  }
}

/**
 * 获取默认的主题App组件
 * @param {*} options 
 * @returns 
 */
function createAppLayout(options) {
  const applayout = options.applayout
  if (!applayout) {
    throw new Error(`${options._configfile_}:未指定applayout配置`)
  }
  const cwd = path.join(root, 'applayout', applayout)
  const files = ['app.js', 'app.vue', 'index.js', 'index.vue', 'app.jsx']
  const applayoutPath = getExistFile({ cwd, files })
  if (!applayoutPath) {
    throw new Error(`${options._configfile_}: applayout配置的目录下未找到['app.js', 'app.vue', 'index.js', 'app.jsx', 'index.vue']文件`)
  }
  return { applayoutPath }
}

function getTempPath(options) {
  return { tempPath: path.resolve(root, '../.joyin'), outputDir: path.resolve(root, '../build'), codePath: path.resolve(root, '../') }
}


