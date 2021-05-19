/**
 * 在线vuedemo运行: 编辑单个vue文件
 * 基于vue-cli实现
 * @author xiufu.wang
 */

const generatorRender = require('./utils/generator-render')
const Service = require('@vue/cli-service')
const Config = require('webpack-chain')
const jetpack = require('fs-jetpack');
const toPlugin = id => ({ id, apply: require(id) })
const babelPlugin = toPlugin('@vue/cli-plugin-babel')
const eslintPlugin = toPlugin('@vue/cli-plugin-eslint')
const globalConfigPlugin = require('@vue/cli-service-global/lib/globalConfigPlugin')
const path = require('path')

function getConfig(mode) {
  const m = require('../app.config')
  return (m && m.default)(mode, {})
}

function installProcessEnv(config) {
  const envs = config.envs
  Object.keys(envs || {}).forEach(function (key) {
    if (envs[key]) {
      process.env[key] = process.env[key] || envs[key]
    }
  })
  process.env.VUE_CLI_CSS_SHADOW_MODE = true
}

module.exports = async function (options) {
  //输出目录
  const outputDir = options.outputDir
  // 入口文件
  const entry = options.entry
  // 根目录
  const root = options.root
  //模式: 用户获取配置文件
  const mode = options.mode

  // name
  const libName = options.libName

  //用户配置
  const config = getConfig(mode)

  //注册环境变量
  installProcessEnv(config)

  const buildService = new Service(options.root, {
    projectOptions: {
      compiler: true,
      lintOnSave: 'default'
    },
    plugins: [
      babelPlugin,
      eslintPlugin,
      globalConfigPlugin(options.root, entry, true)
    ]
  })
  path.resolve(root, '../build')
  let initWebPack = false
  buildService.loadUserOptions = function () {
    return {
      outputDir,
      chainWebpack(webpackConfig) {
        webpackConfig.resolve.alias.delete('@')
        webpackConfig.resolve.alias.set('@lib/assets', path.resolve(options.root, './assets'))
        webpackConfig.resolve.alias.set('@lib/api', path.resolve(options.root, './api'))
        webpackConfig.resolve.alias.set('@lib/applayout', path.resolve(options.root, './applayout'))
        webpackConfig.resolve.alias.set('@lib/components', path.resolve(options.root, './components'))
        webpackConfig.resolve.alias.set('@lib/layouts', path.resolve(options.root, './layouts'))

        webpackConfig.module.rule('eslint').use('eslint-loader').tap(loaderOptions => {
          loaderOptions.baseConfig.extends = [
            'plugin:vue/vue3-essential',
            'eslint:recommended'
          ]
          loaderOptions.baseConfig.globals = {
            "console": true,
            "module": true,
            "require": true,
            'process': true
          }
          return loaderOptions
        })

        webpackConfig.module.rule('js').use('babel-loader').tap(options => {
          options.presets = [require.resolve('./utils/preset')]
          options.plugins = [
            [
              "import",
              // libraryDirectory 不要用es，这样会导致编译less
              { libraryName: "ant-design-vue", libraryDirectory: "lib", style: false }
            ]
          ]
          return options
        })
        // 定义输出配置
      }
    }
  }

  try {
    await buildService.run('build', {
      target: 'lib',
      name: (libName || 'sfc-demo-runer'),
      entry: entry,
      formats: 'umd'
    })
    return true
  } catch (e) {
    return false
  }
}





