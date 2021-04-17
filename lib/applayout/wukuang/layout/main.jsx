import { defineComponent, computed } from 'vue'
import omit from 'omit.js';
import VueTypes from 'vue-types'
import { Layout } from 'ant-design-vue'
import { getOptionProps } from 'ant-design-vue/es/_util/props-util'
import LayoutHeader  from './header'
import LayoutSider  from './sider'
import LayoutContent  from './content'
import RouerTab from '@lib/components/router/router-tabs'
import hook  from '../../../api/composition'
import './_style.scss'

const ALayout = Layout

const _mainProps = {
  logo: VueTypes.string,
  title: VueTypes.string
};
const _classes = ['main-layout']


export default defineComponent({
  name: 'main-layout-content',
  inheritAttrs: false,
  props: {
    ..._mainProps
  },
  
  setup() {
    console.log('---------------',hook);
    const menusS = hook.useState('menus')
    //const headerS = useState('header')
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
  },

  methods: {
   
  },
  render() {
    let props = { ...getOptionProps(this), ...this.$attrs };
    props = omit(props, ['class'])
    const topMenus = this.topMenus
    const loading = (<div> 加载中... </div>)

    return (
      topMenus === null ? loading : (
      <ALayout {...props} class={_classes}>
        <LayoutHeader topMenus={topMenus}></LayoutHeader>
        <ALayout style={{marginTop: '64px'}}>
          <LayoutSider  {...props}></LayoutSider>
          <LayoutContent  {...props}>
              <RouerTab></RouerTab>
          </LayoutContent>
        </ALayout>
      </ALayout>
      )
    )
  }
})