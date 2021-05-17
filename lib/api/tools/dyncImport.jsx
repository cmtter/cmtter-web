/**
 * dyncImport实现以下特性
 * 1. 异步模块加载交互
 * 2. 模块页面刷新交互
 * 3. 页面全局loading交互
 * 
 */

import { defineComponent, shallowRef, createVNode, computed, getCurrentInstance, ref, toRaw, provide } from 'vue'
import { ROUTER_TABS_SYMBOL, ROUTER_PAGE_LOADING_SYMBOL } from '../global-symbol'
import VueTypes from 'vue-types'
import {Spin } from 'ant-design-vue'
const loadingComponent = defineComponent({
  name:'dync-import-loading',
  props: {
    loadMsg: VueTypes.string
  },
  render(){
    const loadMsg = this.loadMsg || '加载模块....'
    return (
      <div style="display: flex;flex-direction: column;height: 100%;align-items: center;justify-content: center;">
        <Spin tip={loadMsg}></Spin>
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
    const loader = shallowRef(null)
    const isRefresh = shallowRef(false)
    const pageLoading = ref(0)
    const pageLoadingMsg = ref(0)

    if (!loader.value){
      const waitLoader = prop.loader()
      isRefresh.value = waitLoader.isForRefresh
      prop.loader().catch(() =>{
        loader.value = errorComponent
      }).then((r) => {
        delay(10).then(() => {
          loader.value = r.default ? r.default : r
        })
      })
    }
    const resolveCpm = computed(() => loader.value || loadingComponent)

    const setLoading = (isLoading, msg='加载中....') => {
      let v = toRaw(pageLoading.value)
      pageLoading.value = Math.max(v + (isLoading === true ? 1 : (-1)), 0)
      pageLoadingMsg.value = pageLoading.value > 0 ? msg : null
    }

    provide(ROUTER_PAGE_LOADING_SYMBOL, setLoading)

    return {
      resolveCpm,
      isRefresh,
      pageLoading,
      pageLoadingMsg
    }
  },
  render(){
    const isRefresh = this.isRefresh
    const Comp = this.resolveCpm
    const prop = {...(isRefresh === true ? {loadMsg: '刷新中....'} : {})}
    const pageLoading = this.pageLoading
    const pageLoadingMsg = this.pageLoadingMsg
    if (Comp.name !== loadingComponent.name){
        return (
          <Spin style="height:100%;" spinning={pageLoading > 0 && pageLoadingMsg} tip={pageLoadingMsg}><Comp {...prop}></Comp></Spin>
        )
    }
    return  (<Comp {...prop}></Comp>)
  }
})

/**
 * 参考https://v3.cn.vuejs.org/api/global-api.html#defineasynccomponent
 * @param {*} dyncComp 
 * @returns 
 */

export default function(dyncComp){
  return defineComponent({
    data(){
      return {
        onRefresh: false
      }
    },
    inject:[ROUTER_TABS_SYMBOL],
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

    activated(){
      this.applyThisToRouterTab()
    },
    created(){
      this._loader = null
      this.applyThisToRouterTab()
    },
    
    render(){
      if (this.onRefresh === true){
        return null
      }
      return createVNode(resolveComponent,{loader: () => {
        if (this._loader && this[ROUTER_TABS_SYMBOL]){
          return this._loader
        }
        return (this._loader = dyncComp())

      }})
    },
    methods: {
      refresh(){
        if (this.onRefresh === true){
          return
        }
        if (this._loader && this[ROUTER_TABS_SYMBOL]){
          this._loader.isForRefresh = true
        }
        
        this.onRefresh = true
        setTimeout(() =>{
          this.onRefresh = null
          if (this._loader){
            this._loader.isForRefresh = true
          }
        }, 500)
      },
      applyThisToRouterTab(){
        if (this[ROUTER_TABS_SYMBOL]){
          this[ROUTER_TABS_SYMBOL].ctx.setRouterComp(this)
        }
      }
    }
  })
}


