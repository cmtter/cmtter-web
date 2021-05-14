import { defineComponent, computed } from 'vue'
// import omit from 'omit.js';
// import VueTypes from 'vue-types'
import { Spin } from 'ant-design-vue'
// import { getOptionProps } from 'ant-design-vue/es/_util/props-util'
import RouerTab from '@lib/components/router/router-tabs'
import LayoutContent  from './content'
import hook  from '../../../api/composition'


export default defineComponent({
  name: 'main-layout-content',
  inheritAttrs: false,
  props: {},
  
  setup() {
    const menusS = hook.useState('menus')
    const store = hook.useStore()

    const topMenus = computed(() => menusS.topMenus)
    const subMenus = computed(() => menusS.subMenus)
    return {
      topMenus,
      subMenus,
      store
    };
  },
  
  created(){
    // 请求菜单
    this.store.dispatch('menus/loadMenus')
    this.$appconfig.getMenus()
  },

  methods: {
   
  },
  render() {
    const topMenus = this.topMenus
    const loading = (
      <div style="display: flex;flex-direction: column;height: 100%;align-items: center;justify-content: center;">
        <Spin tip="加载数据...."></Spin>
      </div>
    )
    return (
      topMenus === null ? loading : (
        <LayoutContent>
          <RouerTab></RouerTab>
        </LayoutContent>
      )
    )
  }
})