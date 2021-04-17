
const babelPresets = require('@vue/cli-plugin-babel/preset')
module.exports = function (context, options = {}) {
  const res = babelPresets.call(this, context, options)
  if (options.jsx === false) {
    return res
  }
  const jsxOption = options.jsx || {}
  res.overrides = res.overrides.map(r => {
    if (r.presets && r.presets.length > 0) {
      r.presets = r.presets.filter(p => (!(p instanceof Array) || p[0] !== require('@vue/babel-preset-jsx')))
    }

    if (r.plugins && r.plugins.length > 0) {
      r.plugins = [
        ...(r.plugins.filter(p => (!(p instanceof Array) || p[0] !== require('@vue/babel-plugin-jsx')))),
        [require('@vue/babel-plugin-jsx'), jsxOption]
      ]
    }
    return r
  })
  return res
}