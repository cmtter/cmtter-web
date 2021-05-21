const jetpack = require('fs-jetpack');
const moment = require('moment')
const path = require('path')
const vueCompiler = require('@vue/compiler-sfc');
const onLinesfc = require('../scripts/http-sfc')
let globalTag = 0
const dataUuid = () => (moment(new Date()).format('YYYYMMDDhhmmss') + (++globalTag))

export async function compiler(req, res) {
  const code = req.body && req.body.code
  const result = {
    isOk: true
  }

  try {
    if (!code) {
      throw new Error('代码参数为空')
    }
    const compiler = vueCompiler.parse(code)
  } catch (error) {
    result.isOk = false
  }

  if (!result.isOk) {
    res.json(result)
    return
  }

  // 开始编译输出
  const options = {
    mode: 'dev',
    root: path.resolve(__dirname, '../'),
    entry: path.resolve(__dirname, '../../.joyin/sfc/demo' + dataUuid() + '.vue'),
    outputDir: path.resolve(__dirname, '../../.joyin/sfc/build'),
    libName: 'sfc-demo-runer' + globalTag
  }

  try {
    jetpack.write(options.entry, code)
    const isOk = await onLinesfc(options)
    result.isOk = isOk
  } catch (error) {
    result.isOk = false
  }
  if (result.isOk) {
    result.message = '成功'
    result.file = `${options.libName}.umd.js`
  }
  res.json(result)
}

export async function preview(req, res) {
  if (!req.query || !req.query.file) {
    res.json({
      isOk: false
    })
    return
  }
  const targetDir = path.resolve(__dirname, '../../.joyin/sfc/build')
  const targetFile = path.resolve(targetDir, './' + req.query.file)
  if (jetpack.exists(targetFile)) {
    res.set({
      "Content-Type": "application/javascript; charset=UTF-8"
    });
    jetpack.createReadStream(targetFile).pipe(res);
    return
  }

  res.json({
    isOk: false
  })
}