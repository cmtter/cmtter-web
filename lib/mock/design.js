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

export async function getDesigns(req, res) {
  try {
    let result
    if (req.query.id) {
      result = await sqlite3_all('SELECT * FROM CMTTER_DESIGN_LOG WHERE ID=?', [req.query.id])
    } else {
      result = await sqlite3_all('SELECT * FROM CMTTER_DESIGN_LOG', [])
    }
    let datas = result.data || []
    const mapv = {}
    for (let i = 0; i < datas.length; i++) {
      const e = datas[i];
      const id = e['ID']
      const pid = e['PID']
      if (pid) {
        const pobj = mapv[pid] || (mapv[pid] = { children: [] })
        pobj.children.push(e)
        mapv[pid] = {
          ...pobj
        }
      }
      const obj = mapv[id] || (mapv[id] = { children: [] })
      mapv[id] = {
        ...e,
        title: e.TITLE,
        key: e.ID,
        ...obj,
      }
    }

    datas = Object.keys(mapv).reduce((m, k) => {
      if (!mapv[k]['PID']) {
        m.push(mapv[k])
      }
      return m
    }, [])

    res.json({
      ...result,
      data: datas
    })
  } catch (e) {
    res.json({
      isOk: false,
      e: e
    })
  }
}


