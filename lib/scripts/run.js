
const generatorRender = require('./utils/generator-render')
import getDefaultConfig from './utils/get-default-config'
import getMock from './utils/get-mock'
import getRouter from './utils/get-router'
const Service = require('@vue/cli-service')
const Config = require('webpack-chain')
const jetpack = require('fs-jetpack');
const toPlugin = id => ({ id, apply: require(id) })
const babelPlugin = toPlugin('@vue/cli-plugin-babel')
const eslintPlugin = toPlugin('@vue/cli-plugin-eslint')
const globalConfigPlugin = require('@vue/cli-service-global/lib/globalConfigPlugin')
const path = require('path')

module.exports = async function (options, command) {
  const configData = {
    options: options,
    defaultConfig: getDefaultConfig(options)
  }

  const routes = await getRouter(configData.defaultConfig.root, options)
  const dyncImportPath = path.resolve(__dirname, '../api/tools/dyncImport.jsx')
  // copy 主题文件
  await generatorRender(['**/*'], {
    options: options,
    defaultConfig: {
      ...configData.defaultConfig,
      applayoutPath: configData.defaultConfig.applayoutPath.replace(/\\/g, '/'),
      routes: '[' + routes.join(',') + ']',
      dyncImportPath: dyncImportPath.replace(/\\/g, '/')
    }
  }, {
    cwd: path.resolve(configData.defaultConfig.root, './templates/spa'),
  }, configData.defaultConfig.tempPath, true)

  // 创建mock配置
  const mockApis = await getMock(configData.defaultConfig.root)

  //执行构建
  const buildService = new Service(options.root, {
    projectOptions: {
      compiler: true,
      lintOnSave: 'default'
    },
    plugins: [
      babelPlugin,
      eslintPlugin,
      require('./utils/cli-plugin-mock').default(mockApis),
      globalConfigPlugin(options.root, path.resolve(configData.defaultConfig.tempPath, 'app.js'), false)
    ]
  })

  buildService.loadUserOptions = function () {
    let publicPath = '/'
    let outputDir = configData.defaultConfig.outputDir
    let assetsDir
    let publicPathConfig = process.env.PUBLIC_PATH || '/'
    if (publicPathConfig[0] === '/' && publicPathConfig !== '/') {
      publicPathConfig = publicPathConfig[publicPathConfig.length - 1] !== '/' ? publicPathConfig + '/' : publicPathConfig
      assetsDir = publicPathConfig.slice(1)
    }

    // devServer https://webpack.js.org/configuration/dev-server/#devserver
    const devServer = options.devServer || {}

    return {
      publicPath,
      outputDir,
      assetsDir,
      devServer,
      //transpileDependencies: ['core-js', 'proxy-polyfill', 'regenerator-runtime', /vue/],
      chainWebpack(webpackConfig) {
        // 设置入口
        webpackConfig.entry('app').clear().add('@joyin/app.js')
        // webpackConfig.resolve.alias.clear
        webpackConfig.resolve.alias.delete('@')
        webpackConfig.resolve.alias.set('@joyin', configData.defaultConfig.tempPath)
        webpackConfig.resolve.alias.set('@work', configData.defaultConfig.codePath)
        webpackConfig.resolve.alias.set('@lib/assets', path.resolve(options.root, './assets'))
        webpackConfig.resolve.alias.set('@lib/api', path.resolve(options.root, './api'))
        webpackConfig.resolve.alias.set('@lib/applayout', path.resolve(options.root, './applayout'))
        webpackConfig.resolve.alias.set('@lib/components', path.resolve(options.root, './components'))
        webpackConfig.resolve.alias.set('@lib/layouts', path.resolve(options.root, './layouts'))


        // 支持eslint-vue3 详见详情@vue\cli-service-global\lib\globalConfigPlugin
        webpackConfig.module.rule('eslint').use('eslint-loader').tap(loaderOptions => {
          loaderOptions.baseConfig.extends = [
            'plugin:vue/vue3-essential',
            'eslint:recommended'
          ]
          loaderOptions.baseConfig.globals = {
            "console": true,
            "module": true,
            "require": true
          }
          return loaderOptions
        })

        // 支持vue3 jsx bug， 由于@vue/babel-preset-app@4.5.12 在vue3模式下不能检测到vue3的版本，所有需要手动优化
        webpackConfig.module.rule('js').use('babel-loader').tap(options => {
          options.presets = [require.resolve('./utils/preset')]
          return options
        })

        //忽略对require.context 校验
        // webpackConfig.module.rule('eslint').exclude.add(path.resolve(__dirname, '../api/store/index.js'))

        //修改Html-Plugin 配置 https://github.com/neutrinojs/webpack-chain/blob/master/src/Plugin.js #tab
        webpackConfig
          .plugin('html')
          .tap(htmlOptions => {
            htmlOptions[0].template = path.resolve(configData.defaultConfig.tempPath, './index.html')
            //还可以更改htmlOptions[0].templateParameters 模板参数，后期扩展，例如五矿加载layui、jq
            return htmlOptions
          })
      }
    }
  }

  //执行构建
  buildService.run(command)
}

