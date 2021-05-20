/**
 * 负责初始化表结构
 * sqllite客户端 http://www.sqlitebrowser.org/dl/
 */
const path = require('path')
const db_file = path.resolve(__dirname, './data.db')
const jetpack = require('fs-jetpack');
const fs = require('fs')

jetpack.remove(db_file)
fs.openSync(db_file, 'w')

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(db_file)

// INSERT INTO SFCDEMO_CODES_LOG(TYPE, CODE, TITLE) VALUES('1', '2', '3')
// SELECT TYPE, CODE, TITLE FROM SFCDEMO_CODES_LOG

const CREATE_SQL = 'CREATE TABLE SFCDEMO_CODES_LOG (ID INTEGER PRIMARY KEY AUTOINCREMENT,TITLE NVARCHAR(200) NOT NULL,TYPE NVARCHAR(200) NOT NULL, CODE text NOT NULL)'
try {
  let stmt = db.prepare(CREATE_SQL)
  stmt.run([], function (err, result) {
    if (err) {
      console.error('初始化失败', err);
      return
    }
    console.log('初始化成功');
  });
  stmt.finalize()

} catch (error) {
  console.error('初始化失败', error);
} finally {
  db.close()
}

