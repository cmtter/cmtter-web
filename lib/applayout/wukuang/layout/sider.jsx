import { defineComponent } from 'vue'
import VueTypes from 'vue-types'
import { Layout, Menu as Amenu} from 'ant-design-vue'
import { MailOutlined, AppstoreOutlined } from '@ant-design/icons-vue';
import useState from '../../../api/composition/use-state'
import useStore from '../../../api/composition/use-store'
const AlayoutSider = Layout.Sider
const AmenuItem = Amenu.Item
const AsubMenu = Amenu.SubMenu

/**   */
const siderProps = {
  logo: VueTypes.string.isRequired,
  title: VueTypes.string.isRequired
};

export default defineComponent({
  name: 'main-layout-sider',
  inheritAttrs: false,
  props: {
    ...siderProps
  },

  setup() {
    const layoutState = useState('layout')
    const store = useStore()
    return {
      layoutState,
      store
    };
  },
  methods: {
    handlerCollapse(){
      this.store.commit('layout/collapsed')
    }
  },
  render() {

    const menusList = Array.from({length: 5}).map((r, index) => (
     index === 0 ?  (<AmenuItem key={index}><MailOutlined/><span>{(`菜单${index}`)}</span></AmenuItem>) : (
      <AsubMenu 
        key={index}
        v-slots={{
          title: () => (
            <span>
              <AppstoreOutlined />
              <span>Navigation Three</span>
            </span>
          )
        }}
        >
        <AmenuItem key={index + 100}>
          <router-link to={{name: 'user-prod'}}>
          {(`子菜单${index}`)}
          </router-link>
          </AmenuItem>
        <AmenuItem key={index + 101}>
        <router-link to={{name: 'user-prod-goto'}}>
          {(`子菜单${index}`)}
          </router-link>
         </AmenuItem>
      </AsubMenu>
     )
    ))
    
    const siderProps = {
      defaultCollapsed: this.layoutState.collapsed,
      collapsible: true,
      onCollapse: this.handlerCollapse
    }

    return (
      <AlayoutSider style={{background: '#fff'}} {...siderProps}>
          <div class="sider-container">
              <div class="joyin-scrollbar-default menu-list">
                <Amenu mode="inline">
                  {menusList}  
                </Amenu>
              </div>
          </div>
      </AlayoutSider>
    )
  }
})