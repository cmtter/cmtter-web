/**
 * 在线页面设计工具-代码生成器
 * @author xiufu.wang
 */
import { vueComponents as antvComps } from './ds-defineui'
const EMPTY_NULL = Symbol('EMPTY_NULL')

/**
 * 定义内置组件的创建方式
 */
function resolveBuldInComponentConst(vnode) {
  const ddtype = (vnode.props && vnode.props.ddtype ? vnode.props.ddtype : false)
  if (vnode.tag === 'input') {
    const isVaild = ddtype !== false && ['date', 'datetime', 'email', 'integer', 'number', 'percentage', 'phone'].indexOf(ddtype) > -1
    return isVaild ? ('UI.form.input' + ('.' + ddtype) + '.generate') : 'UI.form.input.generate'
  }

  if (vnode.tag === 'select') {
    const isVaild = ddtype !== false && ['multiple', 'multiple-autocomplete', 'autocomplete'].indexOf(ddtype) > -1
    return isVaild ? ('UI.form.select' + ('.' + ddtype) + '.generate') : 'UI.form.select.generate'
  }

  if (vnode.tag === 'treeselect') {
    const isVaild = ddtype !== false && ['multiple'].indexOf(ddtype) > -1
    return isVaild ? ('UI.form.tree.select' + ('.' + ddtype) + '.generate') : 'UI.form.tree.select.generate'
  }

  if (vnode.tag === 'atable') {
    return 'UI.datatable.generate'
  }

  if (vnode.tag === 'contaner') {
    return 'UI.contaner.generate'
  }

  if (vnode.tag === 'component') {
    return 'UI.component.generate'
  }

  if (vnode.tag === 'aupload') {
    return 'UI.form.upload.generate'
  }

  return false
}

/**
 * 变量创建，风格：
 * [vnode.ui|vnode.tag] + auto++
 */
const tags = {}
function createVar(vnode) {
  let tag = vnode.ui || vnode.tag
  tag = tag.replace('.', '')
  return tags[tag] ? (tag + (++tags[tag])) : (tag + (tags[tag] = 1))
}

/**
 * 判断是否动态参数
 * @param {*} v 
 * @returns 
 */
function isDyncVar(v) {
  if (v === null || v === undefined || typeof v === 'boolean' || !isNaN(v) || (typeof v === 'string' && !v)) {
    return false
  }
  v = JSON.stringify(v)
  if (typeof v === 'string') {
    const _dv = v.replace(/:d-/g, '')
    const _sv = _dv.replace(/:s-/g, '')
    const _iv = _sv.replace(/:i-/g, '')
    const _mv = _sv.replace(/:m-/g, '')
    return (v === _dv && v === _sv && v === _iv && v === _mv) ? false : true
  }
  return false
}

/**
 * 判断值是否为空
 * @param {*} v 
 * @returns 
 */
function isEmpty(v) {
  if (typeof v !== 'number' && typeof v !== 'boolean' && !v) {
    return true
  }

  if (Array.isArray(v)) {
    for (let i = 0; i < v.length; i++) {
      return isEmpty(v[i])
    }
  }

  if (typeof v === 'object' && Object.keys(v).length === 0) {
    return true
  }
  return false
}

/**
 * 判断是否是Antdv控件
 */
function isantdVComponentTag(tag) {
  return tag[0].toLocaleLowerCase() === 'a' && tag.length > 2
}

/**
 * 格式化值代码
 */
function toVuePropsString(v) {
  return JSON.stringify(v).replace(/"([^\\"]*)":/g, '$1:').replace(/''/g, "'").replace(/"'/g, "'").replace(/'"/g, "'")
}

/**
 * 映射处理属性
 * @param { } props 
 * @param {*} temp 
 * @param {*} fn 
 * @param {*} level 
 * @param {*} inSlot 
 * @returns 
 */
function mapValue(props, temp, fn, level, jsx) {
  if (isEmpty(props)) {
    return
  }
  temp = temp || {}
  Object.keys(props).forEach(key => {
    if (isEmpty(props[key])) {
      return
    }
    const v = props[key]
    //数组
    if (Array.isArray(v)) {
      const _arryTemp = ['[']
      for (let i = 0; i < v.length; i++) {
        const p = v[i];
        if (isEmpty(p)) {
          continue
        }
        if (typeof p !== 'object') {
          const cv = mapValue({ key: p }, null, fn, 1)
          _arryTemp.push(cv.key || cv[':key'])
        }

        if (typeof p === 'object') {
          _arryTemp.push(toVuePropsString(mapValue(p, null, fn, 1)))
        }
      }

      _arryTemp.push(']')
      if (level === 0) {
        const res = fn(key, null)
        if (jsx === true) {
          temp[res.key] = {
            isDyncVar: true,
            v: _arryTemp[0] + _arryTemp.slice(1, _arryTemp.length - 1).join(',') + _arryTemp[_arryTemp.length - 1]
          }
        } else {
          temp[res.key] = _arryTemp[0] + _arryTemp.slice(1, _arryTemp.length - 1).join(',') + _arryTemp[_arryTemp.length - 1]
        }
      } else {
        temp[key] = _arryTemp[0] + _arryTemp.slice(1, _arryTemp.length - 1).join(',') + _arryTemp[_arryTemp.length - 1]
      }
      return
    }
    // 对象
    if (typeof v === 'object') {
      if (level === 0) {
        const res = fn(key, null)
        if (jsx === true) {
          temp[res.key] = {
            isDyncVar: true,
            v: toVuePropsString(mapValue(v, null, fn, 1))
          }
        } else {
          temp[res.key] = toVuePropsString(mapValue(v, null, fn, 1))
        }

      } else {
        temp[key] = toVuePropsString(mapValue(v, null, fn, 1))
      }
      return
    }
    //基本类型
    const res = fn(key, v, props, level)
    if (res !== EMPTY_NULL) {
      temp[res.key] = res.value
      return
    }
  })
  return temp
}

/**
 * 生产SFC页面 template 场景下的属性代码
 * 
 * @param {*} props 
 * @param {*} inslot 
 * @returns 
 */
function mapPropsToSfcProps(props, inslot) {
  if (isEmpty(props)) {
    return ' '
  }
  const temp = mapValue(props, null, (key, v, all, level) => {
    if (v === null && key) {
      return { key: ':' + key }
    }
    const isMethod = key.slice(0, 2) === 'on'
    if (isEmpty(v) || key.indexOf('onUpdate_') > -1) {
      return EMPTY_NULL
    }
    // 基础类型常量
    if (typeof v === 'boolean' || typeof v === 'number' || (typeof v === 'string' && !isNaN(v))) {
      if (level === 0) {
        key = ':' + key
      }
      return {
        key, value: v
      }
    }

    if (typeof v === 'string' && !isDyncVar(v)) {
      return {
        key, value: level === 0 ? v : "'" + v + "'"
      }
    }

    if (isDyncVar(v)) {
      let _v = v.replace(/:d-/g, '').replace(/:s-/g, 'slotScope.').replace(/:i-/g, 'item.').replace(/:m-/g, '')
      if (inslot) {
        _v = v.replace(/:d-/g, '').replace(/:s-/g, 'slotScope.').replace(/:i-/g, 'item.').replace(/:m-/g, '')
      }
      if (level === 0) {
        if (isMethod) {
          key = '@' + key[2].toLocaleLowerCase() + '' + key.slice(3)
          let index = _v.indexOf('(event)')
          if (index > -1 || (index = _v.indexOf('()')) > -1) {
            _v = _v.slice(0, index)
          }
        } else if (all['onUpdate_' + key]) {
          key = 'v-model:' + key
        } else {
          key = ':' + key
        }
      }

      return {
        key, value: _v
      }
    } else {
      return {
        key, value: level === 0 ? v : "'" + v + "'"
      }
    }
  }, 0)

  return Object.keys(temp).map(r => {
    return `${r}="${(temp[r].replace ? temp[r].replace(/"/g, '').replace(/''/g, "'").replace(/"'/g, "'").replace(/'"/g, "'") : temp[r])}"`
  }).join(' ').replace(/\\/g, '')
}

/**
 * 静态属性代码
 * @param {*} props 
 * @returns 
 */
function mapPropsToStaticProps(props) {
  if (isEmpty(props)) {
    return '{}'
  }
  const temp = {}
  Object.keys(props).forEach(key => {
    const v = props[key]
    if (!isEmpty(v) && key.slice(0, 2) !== 'on' && (typeof v === 'boolean' || typeof v === 'number' || (typeof v === 'string' && !isNaN(v)) || (typeof v === 'string' && !isDyncVar(v)))) {
      temp[key] = v
      return
    }
  })
  return JSON.stringify(temp).replace(/"([^\\"]*)":/g, '$1:')
}

/**
 * 动态属性代码
 * @param {*} props 
 * @returns 
 */
function mapPropsToSfcDyncProps(props) {
  props = props || {}
  const temp = {}
  Object.keys(props).forEach(key => {
    const v = props[key]
    if (isEmpty(v) || typeof v === 'boolean' || typeof v === 'number' || (typeof v === 'string' && !isNaN(v)) || (typeof v === 'string' && !isDyncVar(v))) {
      return
    }
    if (typeof v === 'object' || Array.isArray(v) || (typeof v === 'string' && isDyncVar(v))) {
      temp[key] = v
      return
    }
  })
  return mapPropsToSfcProps(temp)
}

/**
 * 生产Jsx属性
 * @param {*} props 
 * @returns 
 */
function mapPropsToJsxProps(props) {
  if (isEmpty(props)) {
    return ''
  }
  const temp = mapValue(props, null, (key, v, all, level) => {
    if (v === null && key) {
      return { key }
    }
    const isMethod = key.slice(0, 2) === 'on'
    if (isEmpty(v)) {
      return EMPTY_NULL
    }
    // 基础类型常量
    if (typeof v === 'boolean' || typeof v === 'number' || !isNaN(v)) {
      return {
        key, value: (level === 0 ? {
          v: v,
          isDyncVar: true,
          level: level
        } : v)
      }
    }

    if (isDyncVar(v)) {
      let _v = v.replace(/:d-/g, 'hostComp.').replace(/:s-/g, 'slotScope.').replace(/:i-/g, 'item.').replace(/:m-/g, 'hostComp.')
      if (isMethod) {
        if (_v.indexOf('(event)') > -1 || _v.indexOf('()') > -1) {
          if (_v.indexOf('(event)') > -1) {
            _v = _v.slice(0, _v.indexOf('(event)'))
          } else {
            _v = _v.slice(0, _v.indexOf('()'))
          }
        } else {
          _v = `(${_v.indexOf('event') > -1 ? 'event' : ''}) => { ${_v} }`
        }
      }

      return {
        key, value: (level === 0 ? {
          v: _v,
          isDyncVar: true,
          level: level
        } : _v)
      }
    } else {
      return {
        key, value: (level === 0 ? {
          v: v,
          isDyncVar: false,
          level: level
        } : "'" + v + "'")
      }
    }
  }, 0, true)

  const res = Object.keys(temp).reduce((_memo, r) => {
    let k = r
    const memo = {}
    if (temp[r].isDyncVar === true) {
      memo[r] = `${(temp[r].v.replace ? temp[r].v.replace(/"/g, '').replace(/''/g, "'").replace(/"'/g, "'").replace(/'"/g, "'") : temp[r].v)}`
    } else if (temp[r].isDyncVar === false) {
      memo[r] = `'${(temp[r].v.replace ? temp[r].v.replace(/"/g, '').replace(/''/g, "'").replace(/"'/g, "'").replace(/'"/g, "'") : temp[r].v)}'`
    } else {
      memo[r] = `${(temp[r].replace ? temp[r].replace(/"/g, '').replace(/''/g, "'").replace(/"'/g, "'").replace(/'"/g, "'") : temp[r])}`
    }
    if (r.indexOf('onUpdate_') > -1) {
      const v = memo[r]
      k = '[\'' + r.replace('_', ':') + '\']'
      memo[k] = v
      memo[r] = undefined
      delete memo[r]
    }

    _memo.push(`${k}:${memo[k]}`)
    return _memo
  }, [])

  //return `{{...({${res.join(',')}})}}`
  return `{${res.join(',')}}`
}

function resolveVnodeJsxTagAndProps(vnode, defs) {
  resolveDef(vnode, defs)

  if (typeof vnode === 'boolean' || typeof vnode === 'number' || !isNaN(vnode) || (typeof vnode === 'string' && !isDyncVar(vnode))) {
    return {
      tag: 'span',
      children: vnode,
      ropStr: ''
    }
  }
  // 动态文本节点
  if (typeof vnode === 'string' && isDyncVar(vnode)) {
    const v = vnode.replace(/:d-/g, 'hostComp.').replace(/:s-/g, 'slotScope.').replace(/:i-/g, 'item.').replace(/:m-/g, 'hostComp.')
    return {
      tag: 'span',
      children: `{${v}}`,
      propStr: ''
    }
  }
  const props = mapPropsToJsxProps(vnode.props)
  const tag = vnode.tag
  //表单 
  if (tag === 'input' || tag === 'select' || tag === 'treeselect' || tag === 'contaner' || tag === 'aupload') {
    const _ = createVar(vnode)
    defs.consts.push(` const ${_} = ${resolveBuldInComponentConst(vnode)}({})`)
    return {
      tag: _,
      children: '',
      propStr: props
    }
  }

  // 表格
  if (tag === 'atable') {
    const _ = createVar(vnode)
    defs.consts.push(` const ${_} = ${resolveBuldInComponentConst(vnode)}({})`)
    return {
      tag: _,
      children: '',
      propStr: props
    }
  }

  // 复选框特殊处理
  if (tag === 'acheckboxGroup') {
    const _ = 'CheckboxGroup'
    defs.consts.push(` const ${_} = ${resolveBuldInComponentConst({ tag: 'component' })}(
      {
        component: CheckboxGroup
      }
    )`)
    return {
      tag: _,
      children: '',
      propStr: props
    }
  }

  if (tag.indexOf('.') > -1) {
    const _ = tag.replace('.', '')
    return {
      tag: _,
      children: '',
      propStr: props
    }
  }

  // antd节点
  const ddConfig = antvComps[tag]
  if (isantdVComponentTag(tag) && ddConfig && ddConfig.exportName) {
    const _ = ddConfig.exportName
    return {
      tag: _,
      children: '',
      propStr: props
    }
  }

  return {
    tag: tag,
    children: '',
    propStr: props
  }
}

function mapVnodeSlotsToJsx(vnodes, tpls, defs, defProps) {
  if (isEmpty(vnodes)) {
    return
  }
  vnodes = Array.isArray(vnodes) ? vnodes : [vnodes]
  for (let i = 0; i < vnodes.length; i++) {
    const vnode = vnodes[i];
    const vSlotsProps = []
    if (typeof vnode === 'boolean' || typeof vnode === 'number' || !isNaN(vnode) || (typeof vnode === 'string' && !isDyncVar(vnode))) {
      tpls.push('<span>' + vnode + '</span>')
      continue
    }
    const { tag, propStr, children } = resolveVnodeJsxTagAndProps(vnode, defs)
    let propVarName = ''
    if (propStr) {
      propVarName = createVar({ tag: 'jsxProp' })
      defProps.propConsts.push(`
      const ${propVarName} = ${(propStr)}
      `)

      propVarName = '{...' + propVarName + '}'
    }

    if (!isEmpty(vnode.slots)) {
      vSlotsProps.push(`
      v-slots={
        ${resolveSlotsProps(vnode.slots, null, true, defs)}
      }  
      `)
    }
    const vSlotsPropsStr = vSlotsProps.join('\n')
    tpls.push(`
        <${tag} ${propVarName}  ${vSlotsPropsStr}> ${children}`)
    if (!children && vnode.children && vnode.children.length > 0) {
      mapVnodeSlotsToJsx(vnode.children, tpls, defs, defProps)
    }
    tpls.push('</' + tag + '>')
  }
}

/**
 * 生产Jsx V-slots代码
 */
function resolveSlotsProps(slots, temp, hasP, defs) {
  if (isEmpty(slots)) {
    return null
  }
  temp = temp || []
  Object.keys(slots).forEach(name => {
    if (isEmpty(slots[name])) {
      return
    }
    const isMult = slots[name].length > 1
    const tpls = []
    const defProps = { propConsts: [] }
    mapVnodeSlotsToJsx(slots[name], tpls, defs, defProps)
    temp.push(`
    ${name}: (args)=>{
       const {${(hasP ? '' : 'hostComp,')} ...others} = (args || {})
       const slotScope = others
       if (slotScope ${(hasP ? '' : ' || hostComp')}){
        console.log('slot scope params')
       }
       ${defProps.propConsts.join(';')}
       
       return (${isMult ? '<>' : ''}
          ${tpls.join('\n')}
          ${isMult ? '</>' : ''})
    }`)
  })
  return '{' + temp.join(',') + '}'
}

function resolveDef(vnode, defs) {
  if (!vnode || !vnode.tag || typeof vnode === 'boolean' || typeof vnode === 'number' || !isNaN(vnode) || typeof vnode === 'string') {
    return
  }

  const tag = vnode.tag === 'acheckboxGroup' ? 'Checkbox.Group' : vnode.tag
  const tagSeps = tag.split('.')
  const tabName = tagSeps[0]
  defs.exports['UI'] = true
  const { exportDefault, exportName, importForm } = vnode.tag === 'acheckboxGroup' ? antvComps['acheckboxGroup'] : (antvComps[tabName] || {})
  if (typeof exportDefault === 'boolean' && exportName && importForm) {
    defs.exports[exportName] = true
    defs.imports[importForm] = defs.imports[importForm] || (defs.imports[importForm] = { defaultNames: null, exportNames: [] })
    if (exportDefault === true) {
      defs.imports[importForm].defaultNames = exportName
    } else {
      defs.imports[importForm].exportNames.push(exportName)
    }
    if (tagSeps.length > 1) {
      // 去重处理
      if (!defs.importConsts[tag.replace('.', '')]) {
        defs.importConsts.push(`const ${tag.replace('.', '')} = ${exportName}.${tagSeps[1]}`)
        defs.importConsts[tag.replace('.', '')] = true
        defs.exports[tag.replace('.', '')] = true
      }

    }
  }
}

/**
 * 解析依赖引入 
 */
function createCodeByVnode(vnode, defs) {
  //静态文本节点
  if (typeof vnode === 'boolean' || typeof vnode === 'number' || !isNaN(vnode) || (typeof vnode === 'string' && !isDyncVar(vnode))) {
    return {
      tag: 'span',
      children: vnode,
      propStr: ''
    }
  }
  // 动态文本节点
  if (typeof vnode === 'string' && isDyncVar(vnode)) {
    const v = vnode.replace(/:d-/g, '').replace(/:s-/g, 'slotScope.').replace(/:i-/g, 'item.').replace(/:m-/g, '')
    return {
      tag: 'span',
      children: `{{${v}}}`,
      propStr: ''
    }
  }

  // 解析依赖
  resolveDef(vnode, defs)
  const tag = vnode.tag
  // 表单节点
  if (tag === 'input' || tag === 'select' || tag === 'treeselect' || tag === 'contaner' || tag === 'aupload') {
    const _ = createVar(vnode)
    defs.consts.push(` const ${_} = ${resolveBuldInComponentConst(vnode)}(${mapPropsToStaticProps(vnode.props)})`)
    defs.exports[_] = true
    let children = ''
    if (!isEmpty(vnode.slots)) {
      children = []
      Object.keys(vnode.slots).forEach(slotName => {
        if (isEmpty(vnode.slots[slotName])) {
          return
        }
        const sfc = {
          // 模板
          templates: []
        }
        codeGen(vnode.slots[slotName], sfc, defs)
        if (sfc.templates.length > 0) {
          children.push('<template #' + slotName + '>')
          children.push(sfc.templates.join(''))
          children.push('</template>')
        }
      })

      if (children.length === 0) {
        children = ''
      } else {
        children = children.join('')
      }
    }
    return {
      tag: _,
      children: children,
      propStr: mapPropsToSfcDyncProps(vnode.props)
    }
  }
  // 表格节点
  if (tag === 'atable') {
    const _ = createVar(vnode)
    let staticProps = mapPropsToStaticProps(vnode.props)
    if (!isEmpty(vnode.slots)) {
      staticProps = `
         ${staticProps.slice(0, staticProps.lastIndexOf('}'))},
         slots: ${resolveSlotsProps(vnode.slots, null, null, defs)},
         }`
    }
    defs.consts.push(` const ${_} = ${resolveBuldInComponentConst(vnode)}(${staticProps})`)
    defs.exports[_] = true
    return {
      tag: _,
      children: '',
      propStr: mapPropsToSfcDyncProps(vnode.props)
    }
  }

  // 复选框特殊处理
  if (tag === 'acheckboxGroup') {
    const _ = 'CheckboxGroup'
    let staticProps = mapPropsToStaticProps(vnode.props)
    defs.consts.push(` const ${_} = ${resolveBuldInComponentConst({ tag: 'component' })}(
      {
      component: CheckboxGroup,
      props: ${staticProps}
      }
    )`)
    defs.exports[_] = true

    return {
      tag: _,
      children: '',
      propStr: mapPropsToSfcDyncProps(vnode.props)
    }
  }

  // Steps
  if (tag === 'asteps') {
    const _ = createVar(vnode)
    let staticProps = mapPropsToStaticProps(vnode.props)
    defs.consts.push(` const ${_} = ${resolveBuldInComponentConst({ tag: 'component' })}(
      {
      component: Steps,
      props: ${staticProps}
      }
    )`)
    defs.exports[_] = true

    return {
      tag: _,
      children: '',
      propStr: mapPropsToSfcDyncProps(vnode.props)
    }
  }

  if (tag.indexOf('.') > -1) {
    const _ = tag.replace('.', '')
    return {
      tag: _,
      children: '',
      propStr: mapPropsToSfcProps(vnode.props)
    }
  }


  // antd节点
  const ddConfig = antvComps[vnode.tag]
  if (isantdVComponentTag(vnode.tag) && ddConfig && ddConfig.exportName) {
    let _ = createVar(vnode)
    let staticProps = mapPropsToStaticProps(vnode.props)
    let slots = '{}'
    let propStr = mapPropsToSfcDyncProps(vnode.props)
    if (!isEmpty(vnode.slots)) {
      slots = resolveSlotsProps(vnode.slots, null, null, defs)
      defs.consts.push(`const ${_} = ${resolveBuldInComponentConst({ tag: 'component' })}(
        {
        component: ${ddConfig.exportName},
        props: ${staticProps},
        slots: ${slots}
        }
      )`)
      defs.exports[_] = true
    } else {
      _ = ddConfig.exportName
      propStr = mapPropsToSfcProps(vnode.props)
    }

    return {
      tag: _,
      children: '',
      propStr: propStr
    }
  }

  return {
    tag: (ddConfig && ddConfig.exportName) || vnode.tag,
    propStr: mapPropsToSfcProps(vnode.props),
    children: ''
  }
}

/** 
 *  生产SFC Template 代码 (迭代)
 *
 */
export default function codeGen(procols, sfc, defs) {
  if (isEmpty(procols)) {
    return
  }
  procols = Array.isArray(procols) ? procols : [procols]
  for (let i = 0; i < procols.length; i++) {
    const vnode = procols[i];
    const { tag, propStr, children } = createCodeByVnode(vnode, defs)
    if (!tag) {
      continue
    }
    sfc.templates.push(`<${tag} ${propStr}> ${children}`)
    if (!children && vnode.children && vnode.children.length > 0) {
      codeGen(vnode.children, sfc, defs)
    }
    sfc.templates.push(`</${tag}>`)
  }
}

