const path = require('path')
const prettier = require('prettier')
const sqlite3 = require('sqlite3').verbose();
const db_file = path.resolve(__dirname, '../online-sfc/db/data.db')
const jetpack = require('fs-jetpack');

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
      return res.json({
        ...result
      })
    } else {
      result = await sqlite3_all('SELECT * FROM CMTTER_DESIGN_LOG', [])
    }
    let datas = result.data || []
    const mapv = {}
    for (let i = 0; i < datas.length; i++) {
      const e = datas[i];
      const id = e['ID']
      const pid = e['PID']
      const obj = mapv[id] || (mapv[id] = { children: [] })
      mapv[id] = {
        ...e,
        title: e.TITLE,
        key: e.ID,
        ...obj,
      }
      if (pid) {
        const pobj = mapv[pid] || (mapv[pid] = { children: [] })
        pobj.children.push(mapv[id])
        mapv[pid] = {
          ...pobj
        }
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

export async function save(req, res) {
  const { name, code, title, pid } = req.body
  try {
    await sqlite3_excute('INSERT INTO CMTTER_DESIGN_LOG (NAME, CODE, TITLE, PID) VALUES(?, ?, ?, ?)', [name, code, title, pid])
    res.json({
      isOk: true
    })
  } catch (error) {
    res.json({
      isOk: false
    })
  }
}

export async function update(req, res) {
  const { id, cmtterDSProtocolStr, cmtterStates, cmtterMethods } = req.body
  try {
    if (!id) {
      return res.json({
        isOk: false
      })
    }
    await sqlite3_excute('UPDATE CMTTER_DESIGN_LOG SET cmtterDSProtocolStr=?, cmtterStates = ?, cmtterMethods = ? WHERE id=?', [cmtterDSProtocolStr, cmtterStates, cmtterMethods, id])
    res.json({
      isOk: true
    })
  } catch (error) {
    res.json({
      isOk: false
    })
  }
}

export async function remove(req, res) {
  const { id } = req.body
  if (!id || (Array.isArray(id) && id.length === 0)) {
    return res.json({
      isOk: false
    })
  }
  const ids = Array.isArray(id) ? id : [id]
  try {
    await sqlite3_excute('DELETE FROM CMTTER_DESIGN_LOG WHERE ID in (' + ids.join(',') + ') ', [])
    res.json({
      isOk: true
    })
  } catch (error) {
    res.json({
      isOk: false
    })
  }
}


/**
 * ??????JSX???vue??????,  ??????:
 * https://github.com/prettier/prettier/blob/main/tests/config/format-test.js
 */
function pretterFormat(code, parser) {

  const CURSOR_PLACEHOLDER = "<|>";
  const RANGE_START_PLACEHOLDER = "<<<PRETTIER_RANGE_START>>>";
  const RANGE_END_PLACEHOLDER = "<<<PRETTIER_RANGE_END>>>";

  const indexProperties = [
    {
      property: "cursorOffset",
      placeholder: CURSOR_PLACEHOLDER,
    },
    {
      property: "rangeStart",
      placeholder: RANGE_START_PLACEHOLDER,
    },
    {
      property: "rangeEnd",
      placeholder: RANGE_END_PLACEHOLDER,
    },
  ];

  function replacePlaceholders(originalText, originalOptions) {
    const indexes = indexProperties
      .map(({ property, placeholder }) => {
        const value = originalText.indexOf(placeholder);
        return value === -1 ? undefined : { property, value, placeholder };
      })
      .filter(Boolean)
      .sort((a, b) => a.value - b.value);

    const options = { ...originalOptions };
    let text = originalText;
    let offset = 0;
    for (const { property, value, placeholder } of indexes) {
      text = text.replace(placeholder, "");
      options[property] = value + offset;
      offset -= placeholder.length;
    }
    return { text, options };
  }

  const { text, options } = replacePlaceholders(
    code,
    {}
  );

  const res = prettier.formatWithCursor(text, {
    singleQuote: false,
    jsxSingleQuote: true,
    parser: parser
  })
  return res.formatted
}

export async function codeGen(req, res) {
  const { id, sfc, defs } = req.body
  try {
    const ids = id
    if (!ids || (Array.isArray(ids) && ids.length === 0)) {
      res.json({
        isOk: true,
      })
    }
    const all = await sqlite3_all('SELECT * FROM CMTTER_DESIGN_LOG', [])
    const mapObjs = all.data.reduce((memo, r) => {
      memo[r.ID] = r
      return memo
    }, {})

    const _ids = Array.isArray(ids) ? ids : [ids]
    for (let i = 0; i < _ids.length; i++) {
      const id = _ids[i];
      if (!id) {
        continue
      }
      const result = await sqlite3_all('SELECT * FROM CMTTER_DESIGN_LOG WHERE ID=?', [id])
      if (result.data && result.data.length > 0) {
        const { cmtterDSProtocolStr, cmtterMethods, cmtterStates, TITLE } = result.data[0]
        let desFileNames = []
        let m = mapObjs[id]
        while (m) {
          desFileNames.unshift(m.NAME)
          if (m.PID) {
            m = mapObjs[m.PID]
          } else {
            m = null
          }
        }

        if (cmtterDSProtocolStr && desFileNames.length > 0) {
          //??????????????????
          const defContext = []
          const vueContext = []
          // ??????
          Object.keys(defs.imports).forEach(md => {
            defs.imports[md].exportNames
            const defaultNames = defs.imports[md].defaultNames
            const exportNames = []
            if (defaultNames) {
              exportNames.push(defaultNames)
            }

            // ????????????????????????
            if (defs.imports[md].exportNames && defs.imports[md].exportNames.length > 0) {
              const t = {}
              const e = []
              const _exportNames = defs.imports[md].exportNames
              for (let j = 0; j < _exportNames.length; j++) {
                const _exportName = _exportNames[j];
                if (!t[_exportName]) {
                  e.push(_exportName)
                  t[_exportName] = true
                }
              }

              if (e.length > 0) {
                exportNames.push('{' + e.join(',') + '}')
              }
            }

            if (exportNames.length > 0) {
              defContext.push(
                `import ${exportNames.join(',')} from '${md}'
                  `
              )
            }

          })
          // ??????
          defContext.push(defs.importConsts.join('\n'))
          // ????????????
          defContext.push(defs.consts.join('\n'))

          // ??????????????????
          defContext.push(`
              export const defineStates = ${(cmtterStates || '{}')}
            `)
          // ????????????
          const exportN = Object.keys(defs.exports).join(',\n')
          defContext.push(`
export default {
  ${exportN}
}
            `)

          // ????????????
          vueContext.push(
            `
<template>
  ${sfc.templates.join('\n')}
</template>
<script>
  //@router: {title: '${TITLE}'}
  import components, {defineStates} from './_${desFileNames[desFileNames.length - 1]}-def'
  import composition from '@lib/api/composition'
  import { UIConfig } from '@lib/components/ui'
  import { confirm, warning, error, success } from '@lib/api/tools/message' 
  
  export default {
    mixins: [UIConfig.HOST_MIXIN],
    components: {
      ...components
    },
    data(){
      return {
        ...defineStates
      }
    },
    created(){
      if (this.initData){
        this.initData()
      }
    },
    methods: ${cmtterMethods || '{}'},
    setup(){
      const { http } = composition.useHttp()
      return {
        http,
        confirm,
        warning,
        error,
        success
      }
    }
  }

</script>
<style>
</style>
`
          )
          const r = desFileNames.slice(0)
          r[r.length - 1] = '_' + r[r.length - 1] + '-def'
          const file1 = path.resolve(__dirname, '../../views/' + (r.join('/')) + '.jsx')
          const file2 = path.resolve(__dirname, '../../views/' + (desFileNames.join('/')) + '.vue')
          jetpack.write(file1, pretterFormat(defContext.join('\n'), 'flow'))
          jetpack.write(file2, pretterFormat(vueContext.join(''), 'vue'))
        }
      }
    }

    res.json({
      isOk: true
    })
  } catch (error) {
    res.json({
      isOk: false
    })
  }
}
