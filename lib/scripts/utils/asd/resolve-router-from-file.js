import fileLineParser from './file-line-parser'

/**
 * 页面上路由的配置元数据
 */
export default async function (file) {
  let res = {}
  return new Promise((resolve) => {
    fileLineParser(file, (lineContent, isOver) => {

      if (isOver) {
        resolve(
          {
            file: file,
            meta: res
          }
        )
        return
      }
      if (!lineContent) {
        return
      }
      const startIndex = lineContent.indexOf('@router:')
      if (startIndex > -1) {
        try {
          const obj = (new Function(` return ${lineContent.slice(startIndex + 8)} `))()
          res = Object.assign(res, obj)
        } catch (error) {
          console.log('页面路由配置语法错误', lineContent.slice(startIndex));
        }
      }
    })
  })
}