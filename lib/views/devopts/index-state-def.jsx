import UI from '@lib/components/ui'
import { Card, Button, Tooltip, Tree,Tabs  } from 'ant-design-vue'
import { PlusSquareOutlined, MinusSquareOutlined, FileTextOutlined } from '@ant-design/icons-vue'
const TabPane = Tabs.TabPane
const Contaner = UI.contaner.generate({
  columnCount: 2,
  justify: 'start'
})


const ModuleMenuTree = UI.component.generate({
  component: Tree,
  props: {
    checkable: true,
    size:'smaill'
  }
})
const MudoleMenuCard = UI.component.generate({
  component: Card,
  props: {
    title: '模块列表',
    size: 'small'
  },
  slots: {
    extra: () => {
      return (
        <>
         <Tooltip title="新增模块"><Button type="link" style="font-size: 18px;padding: 0 2px;"><PlusSquareOutlined /></Button></Tooltip>
         <Tooltip title="删除模块"><Button type="link" style="font-size: 18px;padding: 0 2px;"><MinusSquareOutlined /></Button></Tooltip>
         <Tooltip title="生产文件代码"><Button type="link" style="font-size: 18px;padding: 0 2px;"><FileTextOutlined /></Button></Tooltip>
        </>
      )
    },
    default: ({hostComp}) => {
      return (
        <ModuleMenuTree treeData={hostComp.treeData} />
      )
    }
  }
})

const DevTabs = UI.component.generate({
  component: Tabs,
  props: {
    type: 'card'
  },
  slots: {
    default: ()=>{
      return (
        <>
            <TabPane key="1" tab="定义状态"></TabPane>
            <TabPane key="2" tab="定义数据源"></TabPane>
            <TabPane key="3" tab="定义操作"></TabPane>
            <TabPane key="4" tab="定义主页"></TabPane>
            <TabPane key="5" tab="编辑用户"></TabPane>
            <TabPane key="6" tab="查看用户"></TabPane>
            <TabPane key="7" tab="新增用户(对话框)"></TabPane>
            <TabPane key="8" tab="插槽(slot)"></TabPane>
        </>
      )
    }
  }
})


export default {
  MudoleMenuCard,
  Contaner,
  DevTabs
}