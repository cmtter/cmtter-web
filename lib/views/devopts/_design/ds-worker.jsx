/**
 * 生产代码的规则,
 * 1. 所有组件，包括div、span都会独立生产到-*component.js中
 * 2. 所有插槽的函数配置全部为 非箭头函数
 * 3. 参数包括this、slot(插槽)、item(循环)、event(事件), 为了便于设计模式下代码与代码生成的结果尽可能的保持一致，
 *    参数不会继承父作用域，如果遇到该场景可以手动更改代码（例如嵌套插槽、嵌套vFor）
 * 4. 设计模式下字符串特殊标记
 *    d-* 当前状态  this.*   => <div name={}>
      s- 插槽参数 slotScope.*
      e- 事件参数  event.*
      i- for参数  item.*
      m-* 方法参数 this.*
 * 
 * @author xiufu.wang ClearOutlined
 */
import { provide, defineComponent, reactive, ref, createVNode, toRaw, inject, computed, watch} from 'vue'
import { ClearOutlined, PlusCircleOutlined ,SaveOutlined } from '@ant-design/icons-vue'
import { confirm, success, error } from '@lib/api/tools/message'
import VueTypes from  'vue-types'
import omit from 'omit.js';
import { Drawer, Tabs, Input,Button, Table, InputNumber,Switch } from 'ant-design-vue'
import { DS_WORKER_SYMBOL, DS_CHILDREN_SYMBOL, DS_SLOT_SYMBOL, DS_CONFIG_STRATEGY, DS_CONFIG_STRATEGY_INNER, DS_CONFIG_STRATEGY_ALL } from './ds-constant'
import { vueComponents, allowDsComponents } from './ds-defineui'
import createConfigComp from './ds-configs'
import UI from '@lib/components/ui'
import { UIConfig } from '@lib/components/ui'
import { defalutProps } from '../../../components/ui/utils'
import Conifg from '../../../components/ui/generates/ui-config'
const TabPane = Tabs.TabPane
const TextArea = Input.TextArea

/**
 * @param {*} exstr 表达式
 * @param {*} ctx 上下文
 */
function mapValue(ctx, params, value){
  if (!isNaN(value) || typeof value === 'boolean' || (typeof value === 'string' && !(value = value.trim())) || value === null || value === undefined){
    return value
  }

  if (typeof value === 'string'){
    return formatterValueExpression(ctx, params, value)
  }

  // is array
  if (Array.isArray(value)){
    return value.map(r => {
      return mapValue(ctx, params, r)
    })
  }
  // is object
  value = value || {}
  return Object.keys(value).reduce((m, k)=>{
    m[k] = mapValue(ctx, params, value[k]) 
    return m
  }, {})
}


function formatterValueExpression(ctx, params, valueStr){
  const oldV = valueStr
  if (typeof valueStr === 'boolean' || (typeof valueStr === 'string' && !(valueStr = valueStr.trim())) || valueStr === null || valueStr === undefined){
    return valueStr
  }
  valueStr = valueStr || "''"
  
  // 作用域处理
  const _ctx = new Proxy({}, {
    get: function(obj, prop) {
      const _state = toRaw(ctx.statesObj)
      const _methods = toRaw(ctx.methodsObj)
      if (prop in _state){
        return ctx.statesObj[prop]
      }
      if (prop in _methods){
        return _methods[prop]
      }
      if (prop in ctx){
        return ctx[prop]
      }
      return undefined
    },
    set: function(obj, prop, value) {
      const _state = toRaw(ctx.statesObj)
      if (prop in _state){
        ctx.statesObj[prop] = value
      }
      if (prop in ctx){
        ctx[prop] = value
      }
      ctx.$forceUpdate()
    }
  })

  //:d-name => this.name
  valueStr = valueStr.replace(/:d-/g, 'this.')
  //:s-name=> slotScope.name
  valueStr = valueStr.replace(/:s-/g, 'slotScope.')
  //:e-name=> event.name
  valueStr = valueStr.replace(/:e-/g, 'event.')
  //:i-name=>item.name
  valueStr = valueStr.replace(/:i-/g, 'item.')
  //:m-getName => this.getName ; :m-getName(:e-name) => this.getName(event.name)
  const isMethod = valueStr.indexOf(':m-') > -1
  valueStr = valueStr.replace(/:m-/g, 'this.')
  
  const _v = isMethod ? ` return (event) => { return ${valueStr} } ` : ` return  (${valueStr}) `
  try {
    const run = new Function('item', 'slotScope' , `
      try{
        ${_v}
      }catch(e){
        return {
          isError: true
        } 
      }
    `)
    //格式化内容
    const res = run.call(_ctx, params.item, params.slotScope)
    if (res && res.isError === true){
      return oldV
    }
    return res
  } catch(e) {
    //如果发生异常则返回原始字符串
    return oldV
  }
}

/**
 * 获取组件（仅适用于antdv）
 * @param {*} tagStr 
 * @param {*} comps 
 * @returns 
 */
function getComponentType(tagStr, comps){
  comps = comps || vueComponents
  if (comps[tagStr]){
    return comps[tagStr].def || comps[tagStr]
  }
  const name = tagStr.replace(/-/g, '').toLocaleLowerCase()
  if(comps[name]){
    return comps[name].def || comps[name]
  }
  // 如果是个表达式
  if(tagStr.indexOf('.') > 1){
    const pname = tagStr.split('.')[0]
    const cname = tagStr.split('.')[1]
    const p = getComponentType(pname)
    if (p){
      let coptions = null
      Object.keys(p).forEach(k => {
        if (!coptions && k.toLocaleLowerCase() === cname.toLocaleLowerCase()){
          coptions = p[k]
        }
      })
      if (coptions){
        return coptions
      }
    }
  }
  return tagStr
    
}

/**
 * 如果当前options.cmtterDSProtocol存在children，则dsConfig则
 * @param {*} options 
 * @param {*} role 
 * @returns 
 */
function vueConfig(options, role){
  const Cmp = createConfigComp(options, role)
  // 创建子元素
  return createConfigVNode(options.cmtterDSProtocol, Cmp)
}

function renderDsConfigNode(componentOption, cache, ctx, params, role, position) {
  if (!componentOption){
   return
  }
  // 文本节点: 插槽、子节点
  if (typeof componentOption === 'string'){
    //子节点
   cache.push(vueConfig({cmtterDSProtocol: mapValue(ctx, params, componentOption), position: {...position, $:componentOption}}, (role || DS_CHILDREN_SYMBOL)))
   return
  }
  
  // 格式化 componentOption 为数组
  componentOption = Array.isArray(componentOption) ? componentOption : [componentOption]
  
  for (let i = 0; i < componentOption.length; i++) {
     const opt = componentOption[i];
     if (!opt){
       continue
     }

     // 渲染文本节点
     if (typeof opt === 'string'){
       renderDsConfigNode(opt, cache, ctx, params, (role || DS_CHILDREN_SYMBOL), {...position, num: i})
       continue
     }

     const vIf = mapValue(ctx, params, opt.vIf)
     const vFor = mapValue(ctx, params, opt.vFor)
     // 类似于v-if的处理方式
     if(!opt.tag || vIf === false){
       continue
     }

     // 循环渲染
     if (Array.isArray(vFor)){
       vFor.forEach(record => {
         renderDsConfigNode(omit(opt, ['vFor']), cache, ctx, {...params, item: record }, (role || DS_CHILDREN_SYMBOL), {dsKey: opt.dsKey, num: i})
       })
       continue
     }

     const slots = opt.slots || {}
     const children = opt.children || []

     //创建slots vnode
     const _slots = Object.keys(slots).reduce((m, name) => {
         if(!slots[name] || slots[name].length < 1){
           return m
         } 
         m[name] = (args) => {
           args = args || {}
           const slotConfig = slots[name]
           const vnodes = []
           renderDsConfigNode(slotConfig, vnodes, ctx, {...params, slotScope: args}, DS_SLOT_SYMBOL, {dsKey: opt.dsKey, slot: name})
           return vnodes
         }
         return m
     }, {})

     // 渲染子节点 default slot
     const _children = children.length > 0 ? {
       default: (...args) => {
           args = args || {}
           const vnodes = []
           renderDsConfigNode(children, vnodes, ctx, {...params, slotScope: args}, DS_CHILDREN_SYMBOL, {dsKey: opt.dsKey})
           return vnodes
       }
     } : {}

     //特殊属性处理：格式化onUpdate_
     let _fprops = toRaw(opt.props || {})
     _fprops = Object.keys(_fprops).reduce((mm, dd) => {
       if (dd.indexOf('onUpdate_') > -1){
        mm[dd.replace('onUpdate_', 'onUpdate:')] = _fprops[dd]
       } else {
        mm[dd] = _fprops[dd]
       }
       return mm
     }, {})

     cache.push(vueConfig({cmtterDSProtocol: {
       ...opt,
       props: mapValue(ctx, params, _fprops),
       slots: _slots,
       children: _children
     }, position: {dsKey: opt.dsKey, num: i, ...position, $: opt} }, (role || DS_CHILDREN_SYMBOL)))
  }
}


function findDsDSProtocol(dsKey, datas){
  datas = datas || []
  datas = Array.isArray(datas) ? datas : [datas]

  for (let i = 0; i < datas.length; i++) {
    const e = datas[i];
    if (e.dsKey === dsKey){
      return e
    }
    if (e.slots){
      const slotKeys = Object.keys(e.slots)
      for (let j = 0; j < slotKeys.length; j++) {
        const res = findDsDSProtocol(dsKey, e.slots[slotKeys[j]] || [])
        if (res){
          return res
        }
      }
    }

    if (e.children){
      const res = findDsDSProtocol(dsKey, e.children)
      if (res){
        return res
      }
    }
  }
  return null
}

// 初始化dsKey
let autoUuid = 1
function createDsKey(datas, forceKey = false){
  datas = datas || []
  datas = Array.isArray(datas) ? datas : [datas]

  for (let i = 0; i < datas.length; i++) {
    const e = datas[i];
    if (forceKey === true && e && typeof e !== 'string'){
      e.dsKey = null
    }
    if (typeof e !== 'string' && !e.dsKey){
      e.dsKey = (new Date().getTime()) + '-' + (++autoUuid)
    }
    if (e.slots){
      const slotKeys = Object.keys(e.slots)
      for (let j = 0; j < slotKeys.length; j++) {
        createDsKey(e.slots[slotKeys[j]] || [])
      }
    }

    if (e.children){
      createDsKey(e.children)
    }
  }
  return null
}

/**
 * 这个方法是由ds-config驱动执行，并完成所有的可视节点的渲染
 * @param {*} dsProtocol 
 */
function createConfigVNode(dsProtocol, DsConfigComponent){
  // 字符串
  if (typeof dsProtocol === 'string' || !isNaN(dsProtocol) || typeof dsProtocol === 'boolean'){
    return (
      <>
       <DsConfigComponent display="inline" simpleText={true}><span>{dsProtocol}</span></DsConfigComponent> 
      </>
    )
  }
  const {slots, children, props, tag} = dsProtocol
  const type = getComponentType(tag)
  // 内嵌模式,例如标签页tabPanel组件
  if ((type.name && DS_CONFIG_STRATEGY[type.name] === DS_CONFIG_STRATEGY_INNER) || (tag && DS_CONFIG_STRATEGY[tag] === DS_CONFIG_STRATEGY_INNER) ){
    const targetVNode = createVNode(type, props, {
      //插槽配置节点
      ...slots,
      ...{
        default: (...args) => {
          if (children.default){
            return (<>
              <DsConfigComponent display="block"/>
              {children.default(...args)}
            </>)
          }
          return <DsConfigComponent display="block"/>
        }
      }
    })
    return (
      <>
        {targetVNode}
      </>
    )
  }

  // 内嵌及兄弟模式，例如对话框amodal
  if ((type.name && DS_CONFIG_STRATEGY[type.name] === DS_CONFIG_STRATEGY_ALL) || (tag && DS_CONFIG_STRATEGY[tag] === DS_CONFIG_STRATEGY_ALL)){
    const targetVNode = createVNode(type, props, {
      //插槽配置节点
      ...slots,
      ...{
        default: (...args) => {
          if (children.default){
            return (<>
              <DsConfigComponent display="block"/>
              {children.default(...args)}
            </>)
          }
          return <DsConfigComponent display="block"/>
        }
      }
    })
    return (
      <DsConfigComponent>
        {targetVNode}
      </DsConfigComponent>
    )
  }

  const targetVNode = createVNode(type, props, {
    //插槽配置节点
    ...slots,
    ...children
  })

  return (
    <>
      <DsConfigComponent display="block">
        {targetVNode}
      </DsConfigComponent>
    </>
  )
}

function _clone(data){
  if (!data){
    return null
  }
  return JSON.parse(JSON.stringify(data))
}

function _create(options){

  const _props = {
   
    /**
     * 页面元素表达协议
     */
    cmtterDSProtocolStr: VueTypes.string.def(JSON.stringify([{tag: 'div', tagText: '页面', dsKey: 99999999, children: []}], null, ' ').replace(/"([^\\"]*)":/g, '$1:')),

    /**
     * 状态
     */
    cmtterStates: VueTypes.string.def('{}'),

     /**
     * 方法
     */
    cmtterMethods: VueTypes.string.def('{}'),

    selectModule: VueTypes.object.def({}),

    //复制模块
    copyMod: null
  }

  return {
    mixins: [UIConfig.HOST_MIXIN],
    data(){
      return {
        showDesinState: false
      }
    },
    props: {
      ...(defalutProps(_props, options))
    },
    setup(props){
      const cmtterDSProtocol = ref([])
      const cmtterDSProtocolStr = ref(props.cmtterDSProtocolStr)
      const statesObj = reactive({})
      const statesObjStr =  ref(props.cmtterStates || '{}')
      const methodsObj = reactive({})
      const methodsObjStr = ref(props.cmtterMethods || '{}')
      
      const allowDsComponentsList = ref([...allowDsComponents])
      const allowDsComponentsTableCols = [
        {key: 'label', dataIndex: 'label', title: '组件名称'},
        {key: 'value', dataIndex: 'value', title: '个数', slots: { customRender: 'countForm' }},
      ]
      const rowSelectionConfig = reactive({selectedRowKeys: []})
      const onChangeSelectedRowKeys = (_selectedRowKeys) => {
        rowSelectionConfig.selectedRowKeys = _selectedRowKeys || []
      }

      const visible = ref(false)
      const placement = ref('left')
      const position = ref(null)
      const selectCmtterDSProtocol = ref({})
      const selectRole = ref(null)

      const selectPropJson = ref('{}')
      const userAction = ref(null)
      
      const isEmptyDesign = computed(() => {
        return (!(cmtterDSProtocol.value)|| cmtterDSProtocol.value.length === 0 || !(cmtterDSProtocol.value[0].children) || cmtterDSProtocol.value[0].children.length === 0)
      })
      
      // 添加控件---窗口
      const dsuivisible = ref(false)
      const updateDsuivisible = (v,  _placement ,  dsconfig) => {
        dsuivisible.value = v
        if (!dsconfig){
          
          return
        }
        // 
        if (position.value && position.value.$ && dsconfig.position.$.dsKey !== position.value.$.dsKey){
          //清空选择
          rowSelectionConfig.selectedRowKeys = []
          allowDsComponentsList.value = allowDsComponentsList.value.map(r => {
            r.count = null
            return r;
          })

        }
        placement.value = _placement || 'left'
        position.value = dsconfig.position
        selectCmtterDSProtocol.value = dsconfig.cmtterDSProtocol || {}
        selectRole.value = dsconfig.role
        userAction.value = dsconfig.action
      }

      // 配置---窗口
      const updateVisible = (v, _placement ,  dsconfig) => {
        visible.value = v
        if (!dsconfig){
          return
        }
        placement.value = _placement || 'left'
        position.value = dsconfig.position
        selectCmtterDSProtocol.value = dsconfig.cmtterDSProtocol || {}
        selectRole.value = dsconfig.role

        // 更新属性配置
        const type = dsconfig.position.$
        selectPropJson.value = JSON.stringify({
          props: type.props || {},
          children: type.children,
          slots: type.slots
        }, null, ' ').replace(/"([^\\"]*)":/g, '$1:') //转换成js对象的格式
      }

      // 更新状态
      const updateS = (prop, value) => {
        statesObj[prop] = value
      }

      const updateSStre = (arg) => {
        statesObjStr.value = arg.data ? arg.data : arg
      }

      // 更新方法
      const updateM = (prop, value) => {
        methodsObj[prop] = value
      }

      const updateMStre = (arg) => {
        methodsObjStr.value = arg.data ? arg.data : arg
      }

      const updateSelectPropJson = (arg) => {
        selectPropJson.value = arg.data ? arg.data : arg
      }

      //同步 状态配置
      const syncDsStates = () => {
        try {
          const code = `
            try {
              return ${toRaw(statesObjStr.value)}
            }catch(e){
              return {
                isOk: false
              }
            }
          `
          const res = new Function(code)()
          if (res.isOk === false){
            throw new Error('error')
          }

          Object.keys(res).forEach(r => {
            updateS(r, res[r])
          })

        } catch (e) {
            alert(e && '请检测是否语法错误(页面状态)')
        }
      }

      // 同步方法配置
      const syscDsMethods = () => {
        try {
          const code = `
            try {
              return ${toRaw(methodsObjStr.value)}
            }catch(e){
              return {
                isOk: false
              }
            }
          `
          const res = new Function(code)()
          if (res.isOk === false){
            throw new Error('error')
          }

          Object.keys(res).forEach(r => {
            updateM(r, res[r])
          })

        } catch (e) {
            alert(e && '请检测是否语法错误(页面方法)')
        }
      }

      // 同步页面协议
      const syscCmtterDSProtocol = () => {
        try {
          const code = `
            try {
              return ${toRaw(cmtterDSProtocolStr.value)}
            }catch(e){
              return {
                isOk: false
              }
            }
          `
          const res = new Function(code)()
          if (res.isOk === false){
            throw new Error('error')
          }

          cmtterDSProtocol.value = res

        } catch (e) {
            alert(e && '请检测是否语法错误(页面设计配置)')
        }
      }

      const syncDsProps = () => {
        try {
          const code = `
            try {
              return ${toRaw(selectPropJson.value)}
            }catch(e){
              return {
                isOk: false
              }
            }
          `
          const res = new Function(code)()
          if (res.isOk === false){
            throw new Error('error')
          }

          const _cmtterDSProtocol = toRaw(cmtterDSProtocol.value)
          const a = findDsDSProtocol(selectCmtterDSProtocol.value.dsKey, toRaw(cmtterDSProtocol.value))
          if(a && res){
            a.children = res.children
            a.props = res.props
            a.slots = res.slots
            if ('vFor' in res){
              a.vFor = res.vFor
            }
            if ('vIf' in res){
              a.vIf = res.vIf
            }
          }
          // 初始化dsKey
          createDsKey(_cmtterDSProtocol)
          cmtterDSProtocol.value = Array.isArray(_cmtterDSProtocol) ? [..._cmtterDSProtocol] : {..._cmtterDSProtocol}
        } catch (e) {
            alert(e && '请检测是否语法错误(配置)')
        }
      }

      // 删除
      const removeComp = (opt, role) => {
        // children
        if (role === DS_CHILDREN_SYMBOL){
          const rows = toRaw(cmtterDSProtocol.value)
          const pp = findDsDSProtocol(opt.dsKey, rows)
          pp.children.splice(opt.num, 1)
          //更新
          cmtterDSProtocol.value = [...rows]

        }
        // slots
        if (role === DS_SLOT_SYMBOL){
          const rows = toRaw(cmtterDSProtocol.value)
          const pp = findDsDSProtocol(opt.dsKey, rows)
          pp.slots[opt.slot].splice(opt.num, 1)
          //更新
          cmtterDSProtocol.value = [...rows]
        }
      }

      // 排序
      const sortComp = (opt, role, type) => {
        const num = opt.num
        const rows = toRaw(cmtterDSProtocol.value)
        const pp = findDsDSProtocol(opt.dsKey, rows)
        if (role === DS_CHILDREN_SYMBOL){
          if (type === 'up' && num > 0){
            pp.children.splice(opt.num-1, 0, pp.children.splice(num, 1)[0])
            cmtterDSProtocol.value = [...rows]
            return
          }
          if (pp.children.length - 1 > num){
            pp.children.splice(opt.num+1, 0, pp.children.splice(num, 1)[0])
            cmtterDSProtocol.value = [...rows]
            return
          }
        }
        // slots
        if (role === DS_SLOT_SYMBOL){
          if (type === 'up' && num > 0){
            pp.slots[opt.slot].splice(opt.num-1, 0, pp.slots[opt.slot].splice(num, 1)[0])
            cmtterDSProtocol.value = [...rows]
            return
          }
          if (pp.children.length - 1 > num){
            pp.slots[opt.slot].splice(opt.num+1, 0, pp.slots[opt.slot].splice(num, 1)[0])
            cmtterDSProtocol.value = [...rows]
            return
          }
       }
      }

      const setCmtterDSProtocolStr = (v) => {
        cmtterDSProtocolStr.value = v
        syscCmtterDSProtocol()
      }

      const changecmtterDSProtocol = () => {
        cmtterDSProtocol.value = [...(toRaw(cmtterDSProtocol.value))]
      }
      const selectModuleChange = computed(() => props.selectModule)
      watch(selectModuleChange, () => {
        statesObjStr.value = props.selectModule.cmtterStates || '{}'
        methodsObjStr.value = props.selectModule.cmtterMethods || '{}'
        cmtterDSProtocolStr.value = props.selectModule.cmtterDSProtocolStr || (JSON.stringify([{tag: 'div', tagText: '页面', dsKey: 99999999, children: []}], null, ' ').replace(/"([^\\"]*)":/g, '$1:'))
        syncDsStates()
        syscDsMethods()
        syscCmtterDSProtocol()

      })

      const copyModChange = computed(() => props.copyMod)
      watch(copyModChange, () => {
        if (!copyModChange.value){
          return
        }
        statesObjStr.value = copyModChange.value.cmtterStates || '{}'
        methodsObjStr.value = copyModChange.value.cmtterMethods || '{}'
        cmtterDSProtocolStr.value = copyModChange.value.cmtterDSProtocolStr || (JSON.stringify([{tag: 'div', tagText: '页面', dsKey: 99999999, children: []}], null, ' ').replace(/"([^\\"]*)":/g, '$1:'))

        syncDsStates()
        syscDsMethods()
        syscCmtterDSProtocol()

      })
      syncDsStates()
      syscDsMethods()
      syscCmtterDSProtocol()

      return {
        changecmtterDSProtocol,
        removeComp,
        sortComp,
        cmtterDSProtocol,
        statesObj,
        statesObjStr,
        methodsObj,
        methodsObjStr,
        updateSStre,
        updateMStre,
        updateS,
        updateM,
        updateVisible,
        visible,
        placement,
        position,
        selectCmtterDSProtocol,
        selectRole,
        syncDsStates,
        syscDsMethods,
        selectPropJson,
        updateSelectPropJson,
        syncDsProps,
        dsuivisible,
        updateDsuivisible,
        allowDsComponentsList,
        allowDsComponentsTableCols,
        rowSelectionConfig,
        onChangeSelectedRowKeys,
        userAction,
        setCmtterDSProtocolStr,
        isEmptyDesign
      }
    },
    methods: {
      //清楚
      async clearAll(){
        const res = await confirm({content: '不可恢复, 确定该操作吗?'})
        if (!res){
          return
        }
        this.setCmtterDSProtocolStr(JSON.stringify([{tag: 'div', tagText: '页面', dsKey: 99999999, children: []}], null, ' ').replace(/"([^\\"]*)":/g, '$1:'))
      },
      renderDsConfigNode(){
        const children = []
        if (this.isEmptyDesign){
          return null
        }
        renderDsConfigNode(toRaw(this.cmtterDSProtocol), children, this)
        return <>{children}</>
      },
      createConfigVNode(dsProtocol){
        return createConfigVNode(dsProtocol)
      },
      applyConfig(){
        this.syncDsStates()
        this.syscDsMethods()
        this.syncDsProps()
      },
      //添加组件
      applyAddComponent(){
        const selKeys = this.rowSelectionConfig.selectedRowKeys
        const allowDsComponentsList = this.allowDsComponentsList
        let selectComps = _clone(allowDsComponentsList).filter(r => selKeys.indexOf(r.value) > -1).reduce(
          (m, r) => {
            if (r.count && !isNaN(r.count)){
              return m.concat(Array.from({length: r.count}).map(() => JSON.parse(JSON.stringify(vueComponents[r.value].design))))
            }
            return m
          }, []
        )
        //获取所有的初始化配置
        //初始化dsKey
        if (selectComps){
          createDsKey(selectComps, true)
        }
        //添加当前子节点
        if (this.userAction === 'addchildren'){
          const node = findDsDSProtocol(this.position.$.dsKey,toRaw(this.cmtterDSProtocol))
          const _vs = node.children || []
          node.children = _vs.concat(selectComps)
        }

        //添加兄弟节点
        if (this.userAction === 'addbrother'){
          const node = findDsDSProtocol(this.position.dsKey,toRaw(this.cmtterDSProtocol))
          if (this.selectRole === DS_SLOT_SYMBOL){
            const _vs = node.slots[this.position.slot]
            const _vindex = this.position.num
            const splice = [].splice
            splice.apply(_vs, [_vindex+1, 0].concat(selectComps))
          }
          if ( this.selectRole === DS_CHILDREN_SYMBOL){
            const _vs = node.children
            const _vindex = this.position.num
            const splice = [].splice
            splice.apply(_vs, [_vindex+1, 0].concat(selectComps))
          }
        } 
        this.dsuivisible = false
        this.changecmtterDSProtocol()
      },
      renderAddFirst(){
        if (!this.isEmptyDesign || this.showDesinState){
          return null
        }
        return (
          <div style="height: 400px;text-align: center;line-height: 400px;">
            <Button size="large"  onClick={this.addFirstElement} style="font-size: 40px;height: 80px;"><PlusCircleOutlined /> 添加第一个元素 </Button>
          </div>
        )
      },
      addFirstElement(){
        this.updateDsuivisible(true, null, {
          action: "addchildren",
          cmtterDSProtocol: {tag: "div", tagText: "页面", dsKey: 99999999, children: [], props: {}},
          position: {
            $: { 
              dsKey: 99999999,
              tag: "div",
              tagText: "页面",
              children: []
            },
            dsKey: 99999999,
            num: 0
          },
          role: DS_CHILDREN_SYMBOL
        })
      },

      async saveCode(){
        const cmtterDSProtocolStr = JSON.stringify(this.cmtterDSProtocol).replace(/"([^\\"]*)":/g, '$1:')
        const cmtterStates = JSON.stringify(this.statesObj).replace(/"([^\\"]*)":/g, '$1:')
        const cmtterMethods = JSON.stringify(this.methodsObj).replace(/"([^\\"]*)":/g, '$1:')

        const { response } = await this.hostComp.http('/mock/design/update', {
          id: this.selectModule.ID,
          cmtterDSProtocolStr: cmtterDSProtocolStr,
          cmtterStates: cmtterStates,
          cmtterMethods: cmtterMethods
        }).post()
        console.log(response, ':', (response.isOK === true));
        if (response.isOk === true){
          success({content: '保存成功'})  
        } else {
          error({content: '保存失败'})  
        }
      }
    },
    created(){
      provide(DS_WORKER_SYMBOL, this)
      this.hostComp = inject(Conifg.UI_HOST_PARENT_CONTEXT_SYMBOL)
    },
    render(){

      const drawerProps = {
        'onUpdate:visible': this.updateVisible,
        placement: this.placement,
        width: 700,
        wrapClassName: 'ds-worker-drawer',
        maskClosable: false,
        title: (vueComponents[this.selectCmtterDSProtocol.tag] ? vueComponents[this.selectCmtterDSProtocol.tag].title : this.selectCmtterDSProtocol.tag)
      }

      const addDsUdrawerProps = {
        'onUpdate:visible': this.updateDsuivisible,
        placement: this.placement,
        width: 700,
        wrapClassName: 'ds-worker-drawer',
        title: (vueComponents[this.selectCmtterDSProtocol.tag] ? vueComponents[this.selectCmtterDSProtocol.tag].title : this.selectCmtterDSProtocol.tag) + '-添加组件('+ (this.userAction === 'addchildren' ? '子节点' : '兄弟节点') +')'
      }

      const textAearProps = {
        autoSize: false,
        style: {
          height: '70vh',
          maxHeight: '70vh'
        }
      }
      
      const stateTab = {
        'onUpdate:value': this.updateSStre
      } 
      const methodTab = {
        'onUpdate:value': this.updateMStre
      } 

      const propsTab = {
        'onUpdate:value': this.updateSelectPropJson
      } 

      // 单元格格式化
      const countForm = ({ record }) => {
        const p = {
          size: 'small',
          value: record.count || 0,
          'onUpdate:value': function(v){
            record.count = v
          }
        }
        return <InputNumber {...p}></InputNumber>
      }

      const switchProps = {
        'onUpdate:checked': (v) => {
          this.showDesinState = v
        }
      }
      return (
       <>
       <div style="text-align: center;position: absolute;top: -38px;width: 100%;" >
         <Button type="primary" onClick={() => {this.hostComp.drawerVisible = true}} style="float: right;">资源库管理</Button>
         <Button disabled={this.isEmptyDesign}  onClick={this.clearAll} style="float: right;margin-right: 5px;"><ClearOutlined />擦除</Button>
         <Button disabled={(this.isEmptyDesign || !this.selectModule || !this.selectModule.ID || !this.selectModule.PID)}  onClick={this.saveCode} style="float: right;margin-right: 5px;"><SaveOutlined />保存</Button>
         <span> <span style="vertical-align: middle;">
           {(this.selectModule ? ('【当前模块:' + this.selectModule.TITLE + '】') : '')} 
           </span>
          <Switch checkedChildren="预览" unCheckedChildren="设计" checked={this.showDesinState} {...switchProps}/> </span>
       </div>
       <div class="cmtter-ds-worker">
        {this.renderDsConfigNode()}
        {this.renderAddFirst()}
       </div>
       
        <Drawer visible={this.visible} {...drawerProps}>
          <Tabs size="small">
            <TabPane tab="属性" key="1" forceRender={true}>
              <TextArea {...textAearProps} value={this.selectPropJson} {...propsTab}></TextArea>
            </TabPane>
            <TabPane tab="页面方法" key="2" forceRender={true}> 
            <TextArea {...textAearProps} value={this.methodsObjStr} {...methodTab}></TextArea>
            </TabPane>
            <TabPane tab="页面状态"  key="3" forceRender={true}>
            <TextArea {...textAearProps} value={this.statesObjStr} {...stateTab}></TextArea>
            </TabPane>
            <TabPane tab="数据源快捷处理"  key="4" forceRender={true}>
            <TextArea {...textAearProps}></TextArea>
            </TabPane>
          </Tabs>
          <div style={
                {
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e8e8e8',
                padding: '10px 16px',
                textAlign: 'right',
                left: 0,
                background: '#fff',
                borderRadius: '0 0 4px 4px'
              }
              }
            >
            <Button type="primary" onClick={this.applyConfig}>应用</Button>
          </div>
        </Drawer>
        
        <Drawer visible={this.dsuivisible} {...addDsUdrawerProps}>
          <Tabs>
            <TabPane tab="基础控件" key="1">
            <Table rowSelection={{
            onChange: this.onChangeSelectedRowKeys,
            selectedRowKeys: this.rowSelectionConfig.selectedRowKeys

          }} style="margin:0;" scroll={{ y: 400 }} pagination={{pageSize: 50}} size="small" dataSource={this.allowDsComponentsList} v-slots={{countForm}} columns={this.allowDsComponentsTableCols}></Table>
         </TabPane>
          </Tabs>
          <div style={
                {
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e8e8e8',
                padding: '10px 16px',
                textAlign: 'right',
                left: 0,
                background: '#fff',
                borderRadius: '0 0 4px 4px'
              }
              }
            >
            <Button type="primary" onClick={this.applyAddComponent}>添加组件</Button>
          </div>
        </Drawer>
        </>
        )
    }
  }
}

export default UI.component.generate({component: defineComponent(_create({}))})
