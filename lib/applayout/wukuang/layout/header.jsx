import { defineComponent, ref, watch } from 'vue'
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
    const menuSelectKeys = ref([])
    //监控选中变化
    watch(menuSelectKeys, () => {
     //更新sub
    })
    const onMenuSelectChange = (keys) => {
      menuSelectKeys.value = keys
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
      <AmenuItem key={item.router.key} style={{verticalAlign: 'middle'}}>{(item.router.meta.title || '首页')}</AmenuItem>
    ))
    const menuSelectKeys = this.menuSelectKeys
    const MessageIcon = (<MessageOutlined/>) 
    const useIcon = (<UserOutlined/>)
    const useDropDownList = (
      <Amenu>
        <AmenuItem key="0"><a href="#" target="_blank">1st menu item</a></AmenuItem>
        <AmenuItem key="1"><a href="#" target="_blank">2st menu item</a></AmenuItem>
        <AmenuItem key="2"><a href="#" target="_blank">3st menu item</a></AmenuItem>
        <AmenuDivider></AmenuDivider>
        <AmenuItem key="3" disabled><a href="#" target="_blank">4st menu item</a></AmenuItem>
      </Amenu>
    )
    
    return (
      <ALayoutHeader {...props} class="fixed-header">
        <div class="header-container">
          <div class="logo">
            <img src={logoPng}/>
            <span class="title">信托业务管理平台</span>
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