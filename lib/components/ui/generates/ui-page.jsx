/**
 * 全局页面组件，用户控制通用交互操作
 */
 import { defineComponent, computed, watch} from 'vue'
 import VueTypes from  'vue-types'
 import { getSlot } from 'ant-design-vue/es/_util/props-util'
 import { defalutProps } from '../utils'

 function generate(options){
   const props = {
      //页面标题
      title: VueTypes.string
   
   }
   const _formControl = {
     props: {
      ...(defalutProps(props, options))
     },
     setup(props){
      //更新标题 待扩展
      const updateTitle = () =>{}
      const titleChange = computed(() => props.title)
      watch(titleChange, updateTitle)
      return {}
     },
     render(){
       const children = getSlot(this);
       return children
     }
   }
 
   return defineComponent(_formControl)
 }

export default {name: 'page', generate: generate}