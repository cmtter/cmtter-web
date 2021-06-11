import UI from '@lib/components/ui'
import { Menu } from 'ant-design-vue'
const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu

const wkContaner = UI.contaner.generate({
  columnCount: 2,
  justify: 'start'
})

const helpMenus = UI.component.generate({
  component: Menu,
  props: {
    mode:"inline",
    defaultSelectedKeys:['start']
  },
  slots: {
    default(){
      return (
        <>
          <MenuItem key="start">开始</MenuItem>
          <MenuItem key="guifan">规范</MenuItem>
          <SubMenu title="表单">
            <MenuItem key="form-input">输入</MenuItem>
            <MenuItem key="form-select">选择</MenuItem>
            <MenuItem key="form-group">分组</MenuItem>
          </SubMenu>
          <MenuItem key="layout">布局</MenuItem>
          <MenuItem key="table">表格</MenuItem>
          <MenuItem key="commom">通用</MenuItem>
        </>

      )
    }
  }
})

export default {
  helpMenus,
  wkContaner
}