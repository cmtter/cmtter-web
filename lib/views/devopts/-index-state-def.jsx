import UI, {UIConfig} from '@lib/components/ui'
import { Card, Button, Tooltip, Tree,Tabs, Modal, Form, Drawer  } from 'ant-design-vue'
import { PlusSquareOutlined, MinusSquareOutlined, CopyOutlined, CodeOutlined   } from '@ant-design/icons-vue'
const { DefineRules } = UIConfig
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
    size: 'small',
    bodyStyle: {
      maxHeight: 'calc(100vh - 180px)',
      overflow: 'auto'
    }
  },
  slots: {
    title: ({hostComp}) => {
      const isDelete = hostComp.checkedKeys && hostComp.checkedKeys.length > 0
      return (
        <>
         <Tooltip title="新增模块"><Button type="link" onClick={() => hostComp.onChageVisible(true)} style="font-size: 18px;padding: 0 2px;"><PlusSquareOutlined /></Button></Tooltip>
         <Tooltip title="删除模块"><Button onClick={() => hostComp.removeModule()}  disabled={(!isDelete)} type="link" style="font-size: 18px;padding: 0 2px;"><MinusSquareOutlined /></Button></Tooltip>
         <Tooltip title="复制代码至当前模块"><Button onClick={() => hostComp.copyModule()} type="link" disabled={(!isDelete)} style="font-size: 18px;padding: 0 2px;"><CopyOutlined /></Button></Tooltip>
        </>
      )
    },
    extra: ({hostComp}) => {
      const isDelete = hostComp.checkedKeys && hostComp.checkedKeys.length > 0
      return (
        <>
           <Tooltip title="批量生产工程代码"><Button onClick={() => hostComp.genCodes()} type="link" disabled={(!isDelete)}><CodeOutlined />批量生产工程代码</Button></Tooltip>
        </>
      )
    },
    default: ({hostComp}) => {
      const p = {
        selectedKeys: hostComp.selectedKeys,
        'onUpdate:selectedKeys': hostComp.updateselectedKeys,
        treeData: hostComp.treeData,
        checkedKeys: hostComp.checkedKeys,
        'onUpdate:checkedKeys': hostComp.updateCheckedKeys,
        onSelect: hostComp.onSelectTree
      }
      return (
        <ModuleMenuTree {...p}/>
      )
    }
  }
})

const wkModal = UI.component.generate({
  component: Modal,
  props: {
    okText: '保存新增',
    title: '新增模块、目录'
  }
})

const wkForm = UI.component.generate({component: Form })

const wkCodeInput = UI.form.input.generate({
  label: '模块名称(name)',
  rules: [DefineRules.isRequired()]
})

const wkCodeInputLabel = UI.form.input.generate({
  label: '模块标题(中文)',
  rules: [DefineRules.isRequired()]
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

export const stateDefs = {
   moduleState: {
    name: null,
    title: null,
   }
}

export default {
  Contaner,
  DevTabs,
  wkCodeInput,
  wkCodeInputLabel,
  wkModal,
  wkForm,
  Drawer,
  MudoleMenuCard

}