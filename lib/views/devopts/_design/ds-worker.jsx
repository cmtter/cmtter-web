// import { provide, defineComponent, reactive, createVNode, ref, toRaw } from 'vue'
// import VueTypes from  'vue-types'
// import omit from 'omit.js';
// import { DS_WORKER_SYMBOL } from './ds-constant'
// import { vueComponents } from './ds-defineui'
// import createConfigComp from './ds-configs'
// import { defalutProps } from '../../../components/ui/utils'

// /**
//  * @param {*} exstr 表达式
//  * @param {*} ctx 上下文
//  */
// function mapValue(ctx, vforCtx, scopes, value){
//     if (typeof value === 'boolean' || (typeof value === 'string' && !(value = value.trim())) || value === null || value === undefined){
//       return value
//     }
//     if (typeof value === 'string'){
//       return formatterValueExpression(ctx, vforCtx, scopes, value)
//     }

//     // is array
//     if (Array.isArray(value)){
//       return value.map(r => {
//         return mapValue(ctx, vforCtx, scopes, value[r])
//       })
//     }
//     // is object
//     value = value || {}
//     return Object.keys(value).reduce((m, k)=>{
//       m[k] = mapValue(ctx, vforCtx, scopes, value[k]) 
//       return m
//     }, {})
// }

// function formatterValueExpression(ctx, vforCtx, scopes, valueStr){
//   if (typeof valueStr === 'boolean' || (typeof valueStr === 'string' && !(valueStr = valueStr.trim())) || valueStr === null || valueStr === undefined){
//     return valueStr
//   }
//   valueStr = valueStr || "''"
//   const _v = valueStr.indexOf('//function').length > -1 ? valueStr : `return (${valueStr})`
//   try {
//     const run = new Function('item', 'scopes' , `
//       try{
//         ${_v.replace(/(_\$s)/g, 'this._$s').replace(/(_\$m)/g, 'this._$m')}
//       }catch(e){
//         return {
//           isError: true
//         } 
//       }
//     `)
//     //格式化内容
//     const res = run.call(ctx, vforCtx, scopes)
//     if (res && res.isError === true){
//       return valueStr
//     }
//     return res
//   } catch(e) {
//     //如果发生异常则返回原始字符串
//     return valueStr
//   }
// }

// /**
//  * 获取组件（仅适用于antdv）
//  * @param {*} tagStr 
//  * @param {*} comps 
//  * @returns 
//  */
// function getComponentType(tagStr, comps){
//   comps = comps || vueComponents
//   if (comps[tagStr]){
//     return comps[tagStr].def || comps[tagStr]
//   }
//   const name = tagStr.replace(/-/g, '').toLocaleLowerCase()
//   if(comps[name]){
//     return comps[name].def || comps[name]
//   }
//   // 如果是个表达式
//   if(tagStr.indexOf('.') > 1){
//     const pname = tagStr.split('.')[0]
//     const cname = tagStr.split('.')[1]
//     const p = getComponentType(pname, comps[pname])
//     if (p){
//       let coptions = null
//       Object.keys(p).forEach(k => {
//         if (!coptions && k.toLocaleLowerCase() === cname.toLocaleLowerCase()){
//           coptions = p[k]
//         }
//       })
//       if (coptions){
//         return coptions
//       }
//     }
//   }
//   return tagStr
    
// }

// /**
//  * 
//  * @param {*} arrs 子元素列表
//  * @param {*} cache vnodes
//  * @param {*} ctx worker上下文
//  * @param {*} vforCtx vFor扩展作用域
//  * @param {*} slotScopes 插槽作用域
//  * @returns 
//  */
// function workTree(arrs, cache, ctx, vforCtx = {}, scopes=[]){
//   // 节点是一个普通文本
//   if (typeof arrs ==='string'){
//     cache.push(mapValue(ctx, vforCtx, scopes, arrs))
//     return
//   }
//   for (let index = 0; index < arrs.length; index++) {
//     const ele = arrs[index];
//     //empty node
//     if (!ele){
//       continue
//     }

//     const vIf = mapValue(ctx, vforCtx, scopes, ele.vIf)
//     const vFor = mapValue(ctx, vforCtx, scopes, ele.vFor)
//     if(vIf === false){
//       continue
//     }
//     if (Array.isArray(vFor)){
//       vFor.forEach(record => {
//         workTree([omit(ele, ['vFor'])], cache, ctx, record, scopes)
//       })
//       continue
//     }
  
//     // 节点是一个普通文本
//     if (typeof ele ==='string'){
//       cache.push(mapValue(ctx, vforCtx, scopes, ele))
//       continue
//     }

//     const type = getComponentType(ele.tag)
   
//     //创建slots
//     const slots = ele.slots || {}
//     const _slots = Object.keys(ele.slots || slots).reduce((m, slotName) => {
//        // 构建scopeSlot
//       m[slotName] = (...args) => {
//         args = args || []
//         const slotConfig = slots[slotName]
//         const _scopes = (scopes && scopes.length > 0) ? args.concat(scopes) : []
//         const vnodes = []
//         workTree(slotConfig, vnodes, ctx, vforCtx, _scopes)
//         return <>{vnodes}</>
//       }
//       return m
//     }, {})
    
//     if (ele.children && Array.isArray(ele.children) &&  ele.children.length > 0){
//       cache.push(createVNode(type, mapValue(ctx, vforCtx, scopes, ele.props), {
//         //子节点
//         default: (...args) => {
//           args = args || []
//           const _scopes = (scopes && scopes.length > 0) ? args.concat(scopes) : []
//           const defaultSlots = []
//           workTree(ele.children, defaultSlots,  ctx, vforCtx, _scopes)
//           return (<>{defaultSlots}</>)
//         },
//         //插槽配置节点
//         ..._slots
//       }))
//     } else {
//       cache.push(createVNode(type, mapValue(ctx, vforCtx, scopes, ele.props), {
//         //插槽配置节点
//         ..._slots
//       }))
//     }
//   }
// }

// /**
//  * @param {*} dsContext 
//  */
// function renderByCmtterDSProtocol(dsContext, dsProtocol){
//   const children = []
//   workTree(toRaw(dsProtocol || dsContext.cmtterDSProtocol), children, dsContext)
//   return <>{children}</>
// }

// function _create(options){

//   const props = {
//     /**
//      * 协议保存接口url
//      */
//     saveUrl: VueTypes.string,

//     /**
//      * 获取协议接口
//      */
//     fetchUrl: VueTypes.string,

//     /**
//      * 页面元素表达协议
//      */
//     cmtterDSProtocol: VueTypes.array.def([]),

//     /**
//      * 状态
//      */
//     cmtterStates: VueTypes.object.def({}),

//      /**
//      * 方法
//      */
//     cmtterMethods: VueTypes.object.def({})
//   }

//   return {
//     props: {
//       ...(defalutProps(props, options))
//     },

//     setup(props){
//       // 协议--动态
//       const cmtterDSProtocol = ref([...props.cmtterDSProtocol])
//       // 状态--自定义
//       const _$s = reactive({...props.cmtterStates})
//       // 方法-- 自定义
//       const _$m = reactive({...props.cmtterMethods})
      
//       // 更新状态
//       const updateS = (prop, value) => {
//         if (typeof _$s[prop] !== 'undefined'){
//           _$s[prop] = value
//         }
//       }

//       // 更新方法
//       const updateM = (prop, value) => {
//         if (typeof _$m[prop] !== 'undefined'){
//           _$m[prop] = value
//         }
//       }

//       return {
//         cmtterDSProtocol,
//         _$s,
//         _$m,
//         updateS,
//         updateM
//       }
//     },

//     created(){
//       provide(DS_WORKER_SYMBOL, this)
//     },
//     methods: {
//       renderByCmtterDSProtocol(dsProtocol){
//         renderByCmtterDSProtocol(this, dsProtocol)
//       }
//     },
//     render(){
//       return <div class="cmtter-ds-worker"></div>
//     }
//   }
// }

// export default defineComponent(_create({
//   cmtterStates:{
//     showTitle: true,
//     title: '我是按钮',
//     buts: [{title: 'button1', key:1}, {title: 'button2', key:2}, {title: 'button3', key: 3}]
//   },
//   /**
//    * 属性可以通过new Function的方式 注入host的环境: hostCmp
//    */
//   cmtterDSProtocol: [
//     {
//       //组件key,全局唯一
//       dsKey: 1,
//       // html or vue component tag
//       tag: 'ACard',
//       // 属性
//       props: {
//         size:'small'
//       },
//       // 插槽 非default slot
//       slots: {
//         title: [
//           // {
//           //   //当配置vfor则当前的slot为模板,回自动开发ctx.item属性
//           //   vFor: '_$s.buts',
//           //   //控制显示
//           //   vIf: true,

//           //   dsKey: 2,
//           //   tag: 'AButton',
//           //   props: {
//           //     type: 'primary'
//           //   },
//           //   slots:{},
//           //   children: ['item.title']
//           // }
//           {
//             dsKey: 3,
//             tag: 'ATabs',
//             props: {
//               size:'small'
//             },
//             children: [{
//               vFor: '_$s.buts',
//               tag: 'ATabs.TabPane',
//               props: {
//                 tab: 'item.title',
//                 key:'item.key'
//               },
//                 children: ['这是tab内容: ', 'item.title', 'item.key']
//             }]
//           }
//         ],
//         extra: [
//           {
//             tag: 'abutton',
//             children: ['删除']

//           }
//         ]
//       },
//       // default slot
//       children: []
//     }    
//   ]
// }))