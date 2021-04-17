const { chalk } = require('@vue/cli-shared-utils')
const { Command } = require('commander');
const path = require('path')
const fs = require('fs')
const program = new Command();
const root = path.resolve(__dirname, '../')
process.chdir(root)
require('./utils/babel-node-register')()

const NODE_ENV_S = {
  test: 'test',
  production: 'production',
  dev: 'development',
  development: 'development'
}


program.command('serve')
  .description('启动开发模式.....')
  .option('-m --mode <mode>', '设置启动环境')
  .action(function (cmd) {
    runCommand('./dev', cmd)
  })

program.command('build')
  .description('启动产品模式.....')
  .option('-m --mode <mode>', '测试参数')
  .action((cmd) => {
    runCommand('./build', cmd)
  })

function runCommand(binPath, cmd) {
  let args = {}
  if (cmd) {
    args = cleanArgs(cmd)
  }
  const mode = !args.mode ? 'dev' : args.mode
  const config = getConfig(args, mode)

  config.envs['NODE_ENV'] = NODE_ENV_S[mode]
  installProcessEnv(config)
  try {
    require(binPath)({ root, ...config })
  } catch (error) {
    console.log(chalk.red(
      '构建失败: ' + error.toString()
    ))
    process.exit(1)
  }
}

function getConfig(args, mode) {
  return require(path.resolve(__dirname, '../app.config.js')).default(mode, args)
}

function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

function installProcessEnv(config) {
  const envs = config.envs
  Object.keys(envs || {}).forEach(function (key) {
    if (envs[key]) {
      process.env[key] = process.env[key] || envs[key]
    }
  })
}

function cleanArgs(cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}

program.parse(process.argv)