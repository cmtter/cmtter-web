// 依赖进入
import UI from '@lib/components/ui'
import http from '@lib/api/tools/http'

//创建Page组件 
const WkPage = UI.page.generate({})

// 创建布局容器
const WkContaner = UI.contaner.generate({
  justify: 'start'
})

// 页面状态(单独导出) --- 查询
export const searchFormState = {
  value1: null,
  value2: null,
  value3: null,
  value4: null,
  value5: null,
  value6: null,
  value7: null,
  value8: null,
  value: null,
  value9: null,
  value10: null,
  value11: null,
  value12: null,
  value13: null,
  value14: null,
  value15: null,
} 

//创建查询区域表单-----------------------

//用户角色
const WkSeachUserRoleFormContrl =  UI.form.select.autocomplete.generate({
  flex: '0 0 350px',
  label: '用户角色',
  loadDatas: async function(){
    let data = []
    const { response } = await http('/mock/ui/getSelectList', {}).post()
    if (response){
      data = response.datas
    }
    return data
  }
})
//用户名称
const WkSeachUserNameFormContrl =  UI.form.select.autocomplete.generate({
  flex: '0 0 350px',
  label: ' 用户名称',
  loadDatas: async function(){
    let data = []
    const { response } = await http('/mock/ui/getSelectList', {}).post()
    if (response){
      data = response.datas
    }
    return data
  }
})
//用户岗位
const WkSeachUserGwFormContrl =  UI.form.select.autocomplete.generate({
  flex: '0 0 350px',
  label: '用户岗位',
  loadDatas: async function(){
    let data = []
    const { response } = await http('/mock/ui/getSelectList', {}).post()
    if (response){
      data = response.datas
    }
    return data
  }
})
//用户年龄
const WkSeachUserAgeFormContrl = UI.form.input.integer.generate({
  flex: '0 0 350px',
  label: '用户年龄',
  suffix: '岁'
})

//-------高级-----
// 用户账户

// 用户邮箱

// 出生日期

// 操作工具条
const WkToolbar = UI.toolbar.generate({
  flex: 'auto',
  align: 'right',
  max: 4,
  actions:  [
    {
      action: 'search',
      text: '查询'
    },
    {
      action: 'add',
      text: '新增'
    },
    {
      action: 'delete',
      text: '删除'
    },
    {
      action: 'update',
      text: '修改'
    },
    {
      action: 'checkFault',
      text: '审核驳回'
    },
    {
      action: 'checkOk',
      text: '审核通过'
    },
  ]
})

export default {
  WkSeachUserRoleFormContrl,
  WkSeachUserNameFormContrl,
  WkSeachUserGwFormContrl,
  WkSeachUserAgeFormContrl,
  WkPage,
  WkContaner,
  WkToolbar
}