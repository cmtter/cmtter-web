import normalApiResponse from '../scripts/utils/mock-normal-api-response'
import workDirTree from '../scripts/utils/walk-dir-tree'
const path = require('path')

let uuid = 1
/**
 * 获取工作目录菜单
 * http://localhost:8088/mocks/base/getMenus
 * @param {*} req 
 * @param {*} res 
 */
export function getMenus(req, res) {
  const treeData = {}
  const p = path.resolve(__dirname, '../../views')

  workDirTree(p, treeData, function (item, parentPath) {
    const name = item.name.toLowerCase()
    //忽略非菜单
    if (parentPath.indexOf('components') > -1 || item.name[0] === '~' || name[0] === '-' || name[0] === '_') {
      return null
    }

    const isdir = item.type === 'dir'
    const isParamRoute = name[0] === '~'
    const hasIndex = name.indexOf('index') === 0

    // router
    const routerPath = path.relative(p, parentPath + (hasIndex ? '' : path.sep + name)).toLowerCase().replace(/\\/g, '/').replace(/\.(vue|jsx)/g, '')
    let routerName = routerPath.replace(/(\\|\/)/g, '-')
    const routerMeta = { title: routerName.replace(/-/g, '&') }
    //特殊处理
    routerMeta.title = routerMeta.title === '&' ? 'dashboard' : routerMeta.title
    routerName = routerName === '-' ? 'dashboard' : routerName
    item.router = {
      path: isdir ? null : '/' + routerPath,
      name: routerName,
      meta: routerMeta,
      key: ('top-' + (++uuid))
    }
    return item
  })
  setTimeout(function () {
    res.json(normalApiResponse(treeData))
  }, 2000)

}

/**
 * 获取用户信息
 * @param {*} req 
 * @param {*} res 
 */
export function getUserInfo(req, res) {
  res.json({
    name: 'wagnxiufu',
    age: '29'
  })
}

