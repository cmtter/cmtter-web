const path = require('path')
const sqlite3 = require('sqlite3').verbose();
const db_file = path.resolve(__dirname, '../online-sfc/db/data.db')

async function sqlite3_excute(sql, ...values) {
  const db = new sqlite3.Database(db_file)
  return new Promise((resolve, reject) => {
    try {
      let stmt = db.prepare(sql)
      stmt.run(...values, function (err, result) {
        if (err) {
          reject({
            isOk: false
          })
          return
        }
        resolve({
          isOk: true
        })
      });
      stmt.finalize()

    } catch (error) {
      reject({
        isOk: false
      })
    } finally {
      db.close()
    }
  })
}

async function sqlite3_all(sql, params) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(db_file)
    try {
      db.all(sql, params, function (err, result) {
        if (err) {
          reject({
            isOk: false
          })
        } else {
          resolve({
            isOk: true,
            data: result
          })
        }
        db.close()
      });
    } catch (error) {
      reject({
        isOk: tfalserue
      })
    }
  })
}


/**
 * 获取sfc vue 实例 代码
 * get http://localhost:port/mock/sqlite/getSfcDemoInfos
 * 参考 https://wxf407399291.coding.net/public/cmt-http/cmt-http/git/files/master/develop/actions/action.js
 * @param {*} req 
 * @param {*} res 
 */
export async function getSfcDemoInfos(req, res) {
  try {
    const result = await sqlite3_all('SELECT * FROM SFCDEMO_CODES_LOG', [])
    res.json(result)
  } catch (e) {
    res.json({
      isOk: false,
      e: e
    })
  }
}

/**
 * 保存及修改
 * post http://localhost:port/mock/sqlite/saveSfcDemo
 *  {
 *    id: ''
 *    code: '代码',
 *    type: '名称',
 *    title: '标题'
 * }
 * @param {*} req 
 * @param {*} res 
 */
export async function saveSfcDemo(req, res) {
  const { id, code, title, type } = (req.body || {})
  if (!code || !title || !type) {
    res.json({
      isOk: false,
      message: '保存失败: 代码、标题、类型不能为空'
    })
  }
  try {
    if (id) { //修改
      await sqlite3_excute('UPDATE SFCDEMO_CODES_LOG SET TYPE=?, CODE=?, TITLE=?) WHERE ID=?', [type, code, title, id])
    } else { //新增
      await sqlite3_excute('INSERT INTO SFCDEMO_CODES_LOG (TYPE, CODE, TITLE) VALUES(?, ?, ?)', [type, code, title])
    }
    res.json({
      isOk: true
    })
  } catch (e) {
    res.json({
      isOk: false
    })
  }
}