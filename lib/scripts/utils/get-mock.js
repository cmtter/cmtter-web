const globby = require('globby')
const { sep, resolve } = require('path')

async function _getMockApis(cwd) {
  const _files = await globby(['**/*.js'], { cwd })
  const mocks = _files.map(r => ({
    [r]: require(resolve(cwd, r))
  }))

  return mocks.reduce((apis, defs) => {
    const r = Object.keys(defs)[0]
    const reqUrl = ('/' + ['mock', ...(r.split(sep))].join('/')).replace(/\.(js|ts)/g, '')
    Object.keys(defs[r]).forEach(function (prop) {
      if (defs[r][prop]) {
        const _hurl = reqUrl + (prop === 'default' ? '' : '/' + prop)
        apis[_hurl.toLowerCase()] = defs[r][prop]
      }
    })
    return apis
  }, {})
}

export default async function (cwd) {
  //自定义mock
  const cusMocks = await _getMockApis(resolve(cwd, '../mock'))
  //内置 mock
  const inMocks = await _getMockApis(resolve(cwd, './mock'))

  /**
   * 用户自定义mock优先级高
   */
  return {
    ...inMocks,
    ...cusMocks
  }
}