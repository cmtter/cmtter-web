import { defineComponent, shallowRef, createVNode, computed, getCurrentInstance } from 'vue'
import {Spin } from 'ant-design-vue'
const loadingComponent = defineComponent({
  render(){
    return (
      <div style="display: flex;flex-direction: column;height: 100%;align-items: center;justify-content: center;">
        <Spin tip="加载模块...."></Spin>
      </div>
    )
  }
})
const errorComponent = defineComponent({
  render(){
    return <div  style="text-align:center;">加载模块失败....</div>
  }
})

const delay = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const resolveComponent = defineComponent({
  props: {
    loader: Function
  },
  
  setup(prop){
    const loadingComp = shallowRef(loadingComponent)
    const loader = shallowRef(null)
    if (!loader.value){
      prop.loader().catch(() =>{
        loader.value = errorComponent
      }).then((r) => {
        delay(1000).then(() => {
          loader.value = r.default ? r.default : r
        })
      })
    }
    const resolveCpm = computed(() => loader.value || loadingComp.value)
    return {
      resolveCpm
    }
  },
  render(){
    return createVNode(this.resolveCpm)
  }
})

/**
 * 参考https://v3.cn.vuejs.org/api/global-api.html#defineasynccomponent
 * @param {*} dyncComp 
 * @returns 
 */

export default function(dyncComp){

  return defineComponent({
    created(){
      this.$.vnode.type.name = this.$.vnode.props.key
    },
    setup(){
      const ins = getCurrentInstance()
      /**
      * keepAlive err: parentComponent.ctx.deactivate is not Function
      * 参考 keep-alive.js源码
      */
      if (!ins.ctx.deactivate){
        ins.ctx.deactivate = ()=>{}
      }
       /**
      * keepAlive err: parentComponent.ctx.activate is not Function
      */
      if (!ins.ctx.activate){
        ins.ctx.activate = ()=>{}
      }
    },
    mounted(){
      this.$.vnode.type.name = this.$.vnode.props.key
    },
    render(){
      return createVNode(resolveComponent,{loader: dyncComp})
    }
  })
}


