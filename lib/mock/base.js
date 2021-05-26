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
  const menus = {}
  const menusMap = {}
  let uuid = 1
  workDirTree(p, treeData, function (item, parentPath, parentItem) {
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
    let routerName = routerPath.replace(/(\\|\/)/g, '-').replace(/\.(vue|jsx)/g, '')
    const routerMeta = { title: routerName.replace(/-/g, '&') }
    //特殊处理
    routerMeta.title = routerMeta.title === '&' ? 'dashboard' : routerMeta.title
    routerName = (routerName === '-' || !routerName) ? 'dashboard' : routerName
    item.router = {
      path: isdir ? null : '/' + routerPath,
      name: routerName,
      meta: routerMeta,
      key: ('top-' + (++uuid))
    }
    if (item.router.path) {
      menus[routerName] = item.router.path
    }
    item.type = undefined
    item.name = undefined


    item.id = uuid++
    item.pid = parentItem && parentItem.id
    menusMap[item.id] = item
    return item
  })
  treeData.menus = menus
  treeData.menusMap = menusMap
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
  let name = 'name'
  let filter = '';
  if (req.body && req.body.filter) {
    name = req.body.name
  }
  if (req.body && req.body.filter) {
    filter = req.body.filter
  }
  let data = Array.from({ length: 10 }).map((r, index) => ({ name: name + index, age: 20 + index, id: 'id-' + index }))
  if (filter) {
    data = data.filter(r => r.age > filter)
  }

  // 模拟延迟
  setTimeout(function () {
    res.json({
      data: {
        res: data
      }
    })
  }, 2000)

}

