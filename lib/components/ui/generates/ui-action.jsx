/**
 * 操作控件，用户配置业务
 */

/**
 * 数据源控件
 */
 import { defineComponent, ref} from 'vue'
 import VueTypes from  'vue-types'
 import { getOptionProps, getSlot } from 'ant-design-vue/es/_util/props-util'
 import { Spin } from 'ant-design-vue'
 import { defalutProps } from '../utils'
 const emptyFn = () => undefined
 
 function generate(options){
   const props = {
     handler: VueTypes.func.def(emptyFn),
     //是否显示 loadding
     showLoadding: VueTypes.bool.def(true),
     //loading内容
     showLoaddingText: VueTypes.string
   
   }
   const _formControl = {
     props: {
       ...(defalutProps(props, options))
     },
     setup(props){
      const loadding = ref(false)       
      const setLoadding = (v) => {
        loadding.value = v
      }
      const run = async () => {
        const handler = props.handler
          if (!handler) {
            return
          } 
         try {
          loadding.value = true
          await handler()
          loadding.value = false
         } catch (error) {
          loadding.value = false
         }
      }
      return {
         loadding,
         setLoadding,
         run
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
 
 export default {name: 'action', generate: generate}