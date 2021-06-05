
let uuid = 1
//模拟创建tree数据
function createTreeData(level, childrenCount, total, rootCount) {
  if (level === 0 || level < total) {
    return Array.from({ length: level === 0 ? rootCount : childrenCount }).map((r, index) => ({
      value: 'id-' + (uuid++),
      label: '选择' + uuid,
      ...(total === 0 ? {} : { children: createTreeData(level + 1, childrenCount, total, rootCount) })
    }))
  } else {
    return Array.from({ length: childrenCount }).map((r, index) => ({
      value: 'id-' + (uuid++),
      label: '选择' + uuid
    }))
  }
}

/**
 * Select
 * @param {*} req 
 * @param {*} res 
 */
export function getSelectList(req, res) {
  res.json(
    {
      datas: Array.from({ length: 20 }).map((r, index) => ({ value: 'id' + (uuid++), label: '选项(' + (uuid) + ')' }))
    }
  )

}

/**
 * Select Tree
 * @param {*} req 
 * @param {*} res 
 */
export function getSelectTree(req, res) {
  res.json(
    {
      datas: createTreeData(0, 2, 1, 4)
    }
  )
}

/**
 * Select Tree
 * @param {*} req 
 * @param {*} res 
 */
export function getSelectTreeAsync(req, res) {
  res.json(
    {
      datas: createTreeData(0, 1, 0, 3).map((r, index, arr) => ({ ...r, isLeaf: (index === arr.length - 1) }))
    }
  )
}

/**
 * Table
 * @param {*} req 
 * @param {*} res 
 */
export function getTable(req, res) {
  res.json(
    {
      datas: Array.from({ length: 20 }).map((r, index) => ({

        id: (uuid++),
        c1: 1,
        c1Text: '是',
        ...(Array.from({ length: 20 }).reduce((memo, r, index) => {
          memo['c' + (index + 2)] = 'content-' + (index + 2)
          return memo
        }, {}))
      }))
    }
  )
}

/**
 * Table page
 * @param {*} req 
 * @param {*} res 
 */
export function getTablePage(req, res) {
  const total = 100
  const page = req.body.page
  res.json(
    {
      total: total,
      page: (page + 1),
      datas: Array.from({ length: 20 }).map((r, index) => ({

        id: (uuid++),
        c1: 1,
        c1Text: '是',
        ...(Array.from({ length: 20 }).reduce((memo, r, index) => {
          memo['c' + (index + 2)] = 'content-' + (index + 2)
          return memo
        }, {}))
      }))
    }
  )
}

/**
 * Select
 * @param {*} req 
 * @param {*} res 
 */
export function getTableDetail(req, res) {
  res.json(
    {

      datas: {
        ...(Array.from({ length: 20 }).reduce((memo, r, index) => {
          memo['c' + (index + 2)] = 'content-' + (index + 2)
          return memo
        }, {}))
      }
    }
  )
}

/**
 * Select
 * @param {*} req 
 * @param {*} res 
 */
export function tableAction(req, res) {
  res.json(
    {
      isOk: true
    }
  )
}


