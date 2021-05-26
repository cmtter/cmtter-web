/**
 * 数据源控件
 */
 import { defineComponent, ref, watch, computed, toRaw } from 'vue'
 import VueTypes from  'vue-types'
 import { getOptionProps, getSlot } from 'ant-design-vue/es/_util/props-util'
 import { Spin } from 'ant-design-vue'
 import composition from '@lib/api/composition'
 import { defalutProps } from '../utils'
 import objectProperty from '@lib/api/tools/object-property'
 
 const { useHttp } = composition
 const emptyFn = () => undefined
 function generate(options){
   const props = {
     // api url
     url: VueTypes.string.isRequired,
     //参数
     params: VueTypes.object,
     // 数据字段路径
     dataFieldPath: VueTypes.string,
     // 方法
     method: VueTypes.oneOf(['GET', 'POST', 'get', 'post']).isRequired,
     //绑定的值
     value: VueTypes.oneOfType([VueTypes.object, VueTypes.array]).def(null),
     //是否显示 loadding
     showLoadding: VueTypes.bool.def(false),
     //loading内容
     showLoaddingText: VueTypes.string,
     // 过滤参数
     filterParams:  VueTypes.oneOfType([VueTypes.string, VueTypes.object]).def(null),
     // 过滤处理函数，如果指定则前端过滤，否则是服务端顾虑
     filterHandler: VueTypes.func.def(emptyFn),
     // 是否自动加载
     autoLoad: VueTypes.bool.def(false)
   }
   const _formControl = {
     props: {
       ...(defalutProps(props, options))
     },
     setup(props, {emit}){
       const loadding = ref(false)
       const state = ref(props.value)
       const data = ref([])
       const { http } = useHttp()
       
       const setLoadding = (v) => {
         loadding.value = v
       }
 
       const httpRequest = async () => {
         if(loadding.value === true){
          return
         }
         let params = props.params || {}
         const filterHandler = props.filterHandler
         const filterParams = props.filterParams || {}
         const dataFieldPath = props.dataFieldPath
         // 服务端过滤
         if (filterHandler === emptyFn){
           params = {...params, ...filterParams}
         }
         //
         emit('update:value', null)
         loadding.value = true
         try {
           const { response } = await http(props.url, params)[props.method.toLocaleLowerCase()]()
           data.value = !dataFieldPath ? response : objectProperty(response, dataFieldPath, null)
           loadding.value = false
         } catch(e) {
           loadding.value = false
         }
       }
 
       // 处理过滤
       const doFilter = () => {
         const _data = toRaw(data.value)
         if (_data && Array.isArray(_data) && _data.length === 0 && typeof props.filterHandler === 'function'){
           state.value = props.filterHandler(_data)
         } else {
           state.value = _data
         }
         emit('update:value', toRaw(state.value))
       }
 
       // 数据 和 过滤参数变化的时候 执行过滤处理
       const dataChange = computed(() => data.value)
       const filterParamsChange = computed(() => props.filterParams)
       watch(dataChange, doFilter)
       watch(filterParamsChange, () => {
         if (typeof props.filterHandler === 'function'){
           doFilter()
         }
       })

       // 参数发生变化的时候，重新请求
       const paramsChange = computed(() => props.params)
       watch(paramsChange, httpRequest)
       // 过滤参数发生变化的时候 重新执行请求 
       watch(filterParamsChange, () => {
         if (!props.filterHandler){
           httpRequest()
         }
       })
       
      /**
       * 当存在 params或者 autoLoad为true会自动执行
       */
      if (props.autoLoad === true || props.params){
         httpRequest()
      }
 
     return {
         loadding,
         setLoadding,
         state,
         http,
         //httpRequest
       }
     },
     render(){
       const props = { ...getOptionProps(this), ...this.$attrs};
       const children = getSlot(this);
       const showLoaddingText = props.showLoaddingText || ''
       if (props.showLoadding === true){
         return <Spin spinning={this.loadding} tip={showLoaddingText}>{children}</Spin>
       }
       return children
     }
   }
 
   return defineComponent(_formControl)
 }
 
 export default {name: 'datasource', generate: generate}