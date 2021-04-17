/**
 * 
 * @param {*} mode 模式: --mode test
 * @param {*} args cli 参数
 */
export default function (mode, args) {
  let config = require(`../app-${mode}.config`)
  config = config.default || config
  if (config instanceof Function) {
    return {
      ...config(args, mode),
      _configfile_: `app-${mode}.config`
    }
  }
  return config instanceof Function ? config(args, mode) : config
}