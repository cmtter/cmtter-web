import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import VueTypes from 'vue-types'
import { Layout, Menu as Amenu} from 'ant-design-vue'
import { MailOutlined } from '@ant-design/icons-vue';
import useState from '../../../api/composition/use-state'
import useStore from '../../../api/composition/use-store'
const AlayoutSider = Layout.Sider
const AmenuItem = Amenu.Item
const AsubMenu = Amenu.SubMenu

/**   */
const siderProps = {
  logo: VueTypes.string,
  title: VueTypes.string,
  subMenus: Array
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
    },
    rendMenus(menus, isRoot){
      return menus.map(item => {
        if (!item.router.path){
          if (item.childrens.length === 0){
            return null
          }
          return (<AsubMenu
            key={item.id}
            v-slots={{
              title: () => (
                  <span>
                    {isRoot && <MailOutlined/>}
                    <sapn class="submenu-title-text">
                    {item.router.meta.title}
                    </sapn>
                  </span>
              )
            }}
          >
            {
              this.rendMenus(item.childrens, false)
            }
          </AsubMenu>)
        } else {
          return (
            <AmenuItem>
              {isRoot && <MailOutlined/>}
              <span><RouterLink to={{path: item.router.path}}>{item.router.meta.title}</RouterLink></span>
            </AmenuItem>
          )
        }
      })
    }
  },
  render() {
    const subMenus = this.subMenus || []
    const menusList = this.rendMenus(subMenus, true)
    
    const siderProps = {
      collapsed: this.layoutState.collapsed || subMenus.length === 0,
      collapsible: subMenus.length > 0,
      onCollapse: this.handlerCollapse,
      class: subMenus.length === 0 ? {'side-empty-sub-menus': true} : {}
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