const globby = require('globby')
const path = require('path')
const jetpack = require('fs-jetpack');
const template = require('art-template');

module.exports = async function (glob, metaData, globOptions, dest, cleaable = false) {
  const { defaultConfig: { tempPath, root } } = metaData

  if (cleaable === true && jetpack.exists(tempPath)) {
    jetpack.remove(tempPath)
  }
  jetpack.dir(tempPath)

  const templatePath = path.resolve(__dirname, '../../templates/spa')
  const _files = await globby(['**/*'], { cwd: templatePath })
  _files.forEach((file) => {
    const content = jetpack.read(path.resolve(templatePath, file))
    jetpack.write(path.resolve(tempPath, file), template.render(content, metaData, { escape: false }))
  })
}