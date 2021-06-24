import { defineComponent, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import composition from '../../../api/composition'
import VueTypes from 'vue-types'
import { Layout, Menu as Amenu, Badge as Abadge, Avatar, Dropdown as Adropdown } from 'ant-design-vue'
import {MessageOutlined, UserOutlined} from '@ant-design/icons-vue';
import { getOptionProps } from 'ant-design-vue/es/_util/props-util'
import logoPng from '../../../assets/img/logo.png'
const ALayoutHeader = Layout.Header
const AmenuItem = Amenu.Item
const AmenuDivider = Amenu.Divider

/**   */
const headerProps = {
  logo: VueTypes.string,
  title: VueTypes.string,
  topMenus: VueTypes.array
};

export default defineComponent({
  name: 'main-layout-header',
  inheritAttrs: false,
  props: {
    ...headerProps
  },

  setup() {

    /**
     * 初始化当前路由=菜单交互
     * 1. 根据路由name和menu.name匹配，如果找到对应的菜单，则处理菜单的交互逻辑
     * 2. 还有一种情况是 动态路由, 动态路由一般不属于菜单的一份，所以需要在菜单数据中标注他属于哪一个菜单
     */

    //const curRoute = useRoute()
    const store = composition.useStore()

    const menuSelectKeys = ref([])
    //监控选中变化
   watch(menuSelectKeys, () => {
    store.commit('menus/changeSubMenus', menuSelectKeys.value[0])
   })
    //(keys)
    const onMenuSelectChange = (key) => {
      menuSelectKeys.value = key
    }
    return {
      menuSelectKeys,
      onMenuSelectChange
    };
  },
  methods: {


  },
  render() {
    let props = { ...getOptionProps(this), ...this.$attrs };
    const menuItems = (this.topMenus || []).map(item => (
      <AmenuItem key={item.id} style={{verticalAlign: 'middle'}}>
         {
           (item.router.path) ? (<RouterLink to={{path: item.router.path}}> {(item.router.meta.title || '首页')}</RouterLink>) : (item.router.meta.title || '首页')
         }
       
      </AmenuItem>
    ))
    const menuSelectKeys = this.menuSelectKeys
    const MessageIcon = (<MessageOutlined/>) 
    const useIcon = (<UserOutlined/>)
    const useDropDownList = (
      <Amenu>
        <AmenuItem key="0"><a href="#" target="_blank">个人信息</a></AmenuItem>
        <AmenuItem key="1"><a href="#" target="_blank">退出</a></AmenuItem>
        <AmenuItem key="2"><a href="#" target="_blank">帮助</a></AmenuItem>
        <AmenuDivider></AmenuDivider>
        <AmenuItem key="3" disabled><a href="#" target="_blank">客服咨询</a></AmenuItem>
      </Amenu>
    )
    
    return (
      <ALayoutHeader {...props} class="fixed-header">
        <div class="header-container">
          <div class="logo">
            <img src={logoPng}/>
            <span class="title">VUE3-前端开发脚手架</span>
          </div>
          <div class="menus-container">
            <Amenu 
              theme="dark"
              mode="horizontal"
              selectedKeys={menuSelectKeys}
              onSelectChange={this.onMenuSelectChange}
              style={{lineHeight: '64px'}}
              >
                {menuItems}
            </Amenu>
          </div>
          <div class="right-container">
            <a class="message" href="#">
              <Abadge count={1}>
                  <Avatar style={{background: 'none'}} shape="square" v-slots={{
                    icon: () => MessageIcon 
                  }}>
                  
                  </Avatar>
              </Abadge>
            </a>
            <Adropdown v-slots={
              {overlay: ()=> useDropDownList}
            }>
              <a class="user">
                <Avatar style={{background: 'none'}} shape="square" v-slots={{
                    icon: () => useIcon 
                  }}>
                  </Avatar>
                  <span>
                  管理员
                  </span>
              </a>
            </Adropdown>
          </div>
        </div>
      </ALayoutHeader>
    )
  }
})