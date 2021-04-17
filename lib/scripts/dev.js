
const generatorRender = require('./utils/generator-render')
module.exports = async function (options) {
  await require('./run')(options, 'serve')
}