
import { defineComponent, provide, inject, cloneVNode} from 'vue'
import VueTypes from  'vue-types'
import { Dropdown, Menu,Button } from 'ant-design-vue'
import { defalutProps } from '../../../components/ui/utils'
import { DS_WORKER_SYMBOL } from './ds-constant'
import { confirm } from '../../../api/tools/message'
import omit from 'omit.js';
import { getSlot, getOptionProps } from 'ant-design-vue/es/_util/props-util'
import { SwapLeftOutlined, PicRightOutlined, PlusOutlined, PicLeftOutlined, FormOutlined, SwapRightOutlined, SortAscendingOutlined, SortDescendingOutlined, DeleteOutlined, SettingOutlined, SwapOutlined  } from '@ant-design/icons-vue'
const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu
/**
 * @param {*} options 组件默认配置 
 * @param {*} role 角色 详见ds-constant.jsx
 */
function _create(options, role){

  const props = {
    //节点位置
    position: VueTypes.object.def({}),

    //是否是简单文本
    simpleText: VueTypes.bool.def(false),
    display: VueTypes.oneOf(['block', 'inline']),

    //类型
    role: VueTypes.symbol.def(role),
    //负责渲染协议配置
    cmtterDSProtocol: VueTypes.oneOfType([VueTypes.object, VueTypes.string, VueTypes.number])
  }
  
  const _Cmp = {
    props: {
      ...(defalutProps(props, options))
    },
    setup(){
      const dsWorker = inject(DS_WORKER_SYMBOL)
      return {
        dsWorker
      }
    },
    created(){
      provide(role, this)
    },
    methods: {
      //渲染用户配置操作
      renderConfig(){
        if (this.dsWorker.showDesinState !== false || this.cmtterDSProtocol.dsConfig === false){
          return null
        }
        const dd = (
          <Dropdown overlay={
            () => {
              return <Menu style="width: 150px;" onClick={this.handlerClick}>
                <MenuItem key="title">当前:{(this.cmtterDSProtocol.tagText || this.cmtterDSProtocol.tag)}</MenuItem>
                <SubMenu title={
                  () => {
                    return <><PlusOutlined />添加组件</>
                  }
                }> 
                    <MenuItem key="addchildren-left"><PicRightOutlined />添加子节点(左)</MenuItem>
                    <MenuItem key="addchildren-right"><PicRightOutlined />添加子节点(右)</MenuItem>
                    <MenuItem key="addbrother-left"><PicLeftOutlined />添加兄弟节点(左)</MenuItem>
                    <MenuItem key="addbrother-right"><PicLeftOutlined />添加兄弟节点(右)</MenuItem>
                </SubMenu>
                <SubMenu title={
                  () => {
                    return <><SettingOutlined/>配置</>
                  }
                }>
                    <MenuItem key="config-left"><SwapLeftOutlined/>左边打开</MenuItem>
                    <MenuItem key="config-right"><SwapRightOutlined />右边打开</MenuItem>
                </SubMenu>
                
                <MenuItem  key="delete" disabled={this.position.$.dsKey === 99999999}><DeleteOutlined/>删除</MenuItem>
                <SubMenu title={
                  () => {
                    return (
                      <>
                        <SwapOutlined/>
                        排序
                      </>
                    )
                  }
                }>  
                <MenuItem  key="sort-up"><SortAscendingOutlined />往前</MenuItem>
                <MenuItem  key="sort-down"><SortDescendingOutlined />往后</MenuItem>
                </SubMenu>
              </Menu>
            }
          }>
            <Button size="small" type="link"><FormOutlined/></Button>
          </Dropdown>
        )
        //return <span class="ds-config-action" style={{display: this.display}}>{dd}</span>
        /**
         * 由于影响布局的问题将设计元素的display 设置为inline-block
         */
        return <span class="ds-config-action" style={{display: 'inline'}}>{dd}</span>
      },
      async handlerClick({key}){
       if (key.indexOf && key.indexOf('config') > -1){
        this.dsWorker.updateVisible(true, key.split('-')[1],{
          position: this.position,
          role: this.role,
          cmtterDSProtocol: this.cmtterDSProtocol
        })
        return
       }

       // 添加组件
       if (key.indexOf('addchildren') > -1){
        this.dsWorker.updateDsuivisible(true, key.split('-')[1],{
          position: this.position,
          role: this.role,
          cmtterDSProtocol: this.cmtterDSProtocol,
          action: 'addchildren'
        })
        return
       }
       
       if (key.indexOf('addbrother') > -1){
        this.dsWorker.updateDsuivisible(true, key.split('-')[1],{
          position: this.position,
          role: this.role,
          cmtterDSProtocol: this.cmtterDSProtocol,
          action: 'addbrother'
        })
        return
       }

       // 添加布局
       if (key.indexOf('addlayoutchildren') > -1){
        this.dsWorker.updateDsuivisible(true, key.split('-')[1],{
          position: this.position,
          role: this.role,
          cmtterDSProtocol: this.cmtterDSProtocol,
          action: 'addlayoutchildren'
        })
        return
      }
      if (key.indexOf('addlayoutbrother') > -1){
        this.dsWorker.updateDsuivisible(true, key.split('-')[1],{
          position: this.position,
          role: this.role,
          cmtterDSProtocol: this.cmtterDSProtocol,
          action: 'addlayoutbrother'
        })
        return
      }
      if (key === 'delete'){
        const r = await confirm()
        if (r){
         this.dsWorker.removeComp(this.position, this.role)
        }
      }

      //排序 
      if (key === 'sort-down' || key === 'sort-up'){
          this.dsWorker.sortComp(this.position, this.role, key.split('-')[1])
      }
      }
    },
    render(){
      const allProps =  { ...getOptionProps(this), ...this.$attrs};
      const userConfig = this.simpleText ? null : this.renderConfig()
      let children = getSlot(this);
      const eprop = omit(allProps, ['role'])
      if (children){
        children = Array.isArray(children) ? children.map(r => cloneVNode(r, eprop, false)) : cloneVNode(children, eprop, false)
      }
      
      return (
          <>
             {children}
            {userConfig}
          </>
      )

    }
  }
  return defineComponent(_Cmp)
}

export default _create

