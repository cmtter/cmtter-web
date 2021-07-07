import * as antdv from 'ant-design-vue/lib/index'
import {defineComponent} from 'vue'
import { getSlot, getOptionProps } from 'ant-design-vue/es/_util/props-util'
import {DownOutlined} from '@ant-design/icons-vue'
import UI from '@lib/components/ui'
import designElemets from './components'

const antvComps = {}
antdv.install({use: function(cmp){
  if (cmp && cmp.name){
    antvComps[cmp.name.toLocaleLowerCase()] = {def: cmp, title: cmp.name, exportName: cmp.name.slice(1), defaultProps: {}}
    antvComps[cmp.name] = antvComps[cmp.name.toLocaleLowerCase()]
  }
}, config: {globalProperties: {}}})


//创建一个图标

antvComps['iconDownOutlined'] = {
  def: defineComponent({
    render(){
       return (
        <DownOutlined/>
      )
    }
  }), 
  design: {
    // 不显示配置
    dsConfig: false
  } 
}

// a link
antvComps['a'] = {
  def: defineComponent({
    render(){
      const allProps =  { ...getOptionProps(this), ...this.$attrs};
      const children = getSlot(this);
       return (
        <a {...allProps}>{children} </a>
      )
    }
  }),
  title: 'a(链接)',
  design: {
    // 不显示配置
    dsConfig: false,
    props:{},
    tag: 'a',
    slots:{},
    children: [],
    tagText: 'a(链接)'
  } 
}

// div
antvComps['div'] = antvComps['DIV'] = antvComps['Div'] = {
  def: UI.component.generate({component: defineComponent({
    render(){
      const children = getSlot(this);
      const allProps =  { ...getOptionProps(this), ...this.$attrs};
      return (
        <div {...allProps}>
          {children}
        </div>
      )
    }
  })}),
  title: designElemets.div.title,
  design: designElemets.div.design
}

// span
antvComps['span'] = antvComps['SPAN'] = antvComps['Span'] = {
  def: defineComponent({
    render(){
      const allProps =  { ...getOptionProps(this), ...this.$attrs};
      const children = getSlot(this);
      return (
        <span {...allProps}>
          {children}
        </span>
      )
    }
  }),
  title: designElemets.span.title,
  design: designElemets.span.design
}

//按钮
antvComps['abutton'] = {
  exportName: 'Button',
  def: UI.component.generate({component: antdv.Button}),
  title: designElemets.abutton.title,
  design: designElemets.abutton.design
}

//卡片
antvComps['acard'] = {
  exportName: 'Card',
  def: UI.component.generate({component: antdv.Card}),
  title: designElemets.acard.title,
  design: designElemets.acard.design
}

// 容器
antvComps['contaner'] = antvComps['CONTANER'] = antvComps['Contaner'] = {
  def: UI.contaner.generate({}),
  title: designElemets.contaner.title,
  design: designElemets.contaner.design
}

// 下来按钮
antvComps['adropdown'] = {
  exportName: 'Dropdown',
  def: UI.component.generate({component: antdv.Dropdown}),
  title: designElemets.adropdown.title,
  design: designElemets.adropdown.design
}

// Form
antvComps['aform']  = {
  exportName: 'Form',
  def: UI.component.generate({component: antdv.Form}),
  title: designElemets.aform.title,
  design: designElemets.aform.design
}

// 表单
antvComps['input'] = {
  def: defineComponent({
    render(){
      const children = getSlot(this);
      const allProps =  { ...getOptionProps(this), ...this.$attrs};
      const ddtype = allProps.ddtype
      let Cmp = null
      switch(ddtype) {
        case 'date' :
          Cmp = UI.form.input.date.generate({})
          break;
        case 'datetime' :
          Cmp = UI.form.input.datetime.generate({})
          break;
        case 'email' :
            Cmp = UI.form.input.email.generate({})
          break;
        case 'integer' :
            Cmp = UI.form.input.integer.generate({})
          break;
        case 'number' :
          Cmp = UI.form.input.number.generate({})
          break;
        case 'percentage' :
            Cmp = UI.form.input.percentage.generate({})
          break;
        case 'phone' :
            Cmp = UI.form.input.phone.generate({})
          break;
        default:
            Cmp = UI.form.input.generate({})
      }

      return <Cmp {...allProps}>{children}</Cmp>
    }
  }),
  title: designElemets.input.title,
  design: designElemets.input.design
}

// 对话框
antvComps['amodal']  = {
  exportName: 'Modal',
  def: UI.component.generate({component: antdv.Modal}),
  title: designElemets.amodal.title,
  design: designElemets.amodal.design
}

// 选择框
antvComps['select'] = {
  def: defineComponent({
    render(){
      const children = getSlot(this);
      const allProps =  { ...getOptionProps(this), ...this.$attrs};
      const ddtype = allProps.ddtype
      let Cmp = null
      switch(ddtype) {
        case 'multiple' :
          Cmp = UI.form.select.multiple.generate({})
          break;
        case 'multiple-autocomplete' :
          Cmp = UI.form.select.multiple.autocomplete.generate({})
          break;
        case 'autocomplete' :
          Cmp = UI.form.select.autocomplete.generate({})
          break;
        default:
          Cmp = UI.form.select.generate({})
      }

      return <Cmp {...allProps}>{children}</Cmp>
    }
  }),
  title: designElemets.select.title,
  design: designElemets.select.design
}

// 树选择框
antvComps['treeselect'] = {
  def: defineComponent({
    render(){
      const children = getSlot(this);
      const allProps =  { ...getOptionProps(this), ...this.$attrs};
      const ddtype = allProps.ddtype
      let Cmp = null
      switch(ddtype) {
        case 'multiple' :
          Cmp = UI.form.tree.select.multiple.generate({})
          break;
        default:
          Cmp = UI.form.tree.select.generate({})
      }

      return <Cmp {...allProps}>{children}</Cmp>
    }
  }),
  title: designElemets.treeselect.title,
  design: designElemets.treeselect.design
}

// 表格
antvComps['atable'] = {
  def: UI.datatable.generate({}),
  title: designElemets.atable.title,
  design: designElemets.atable.design
}

// 标签页

antvComps['atabs'] = {
  exportName: 'Tabs',
  def: UI.component.generate({
    component: antdv.Tabs
  }),
  title: designElemets.atabs.title,
  design: designElemets.atabs.design
}

// 树
antvComps['atree'] = {
  exportName: 'Tree',
  def: UI.component.generate({
    component: antdv.Tree
  }),
  title: designElemets.atree.title,
  design: designElemets.atree.design
}

// 上传附件
antvComps['aupload'] = {
  def: UI.form.upload.generate({}),
  title: designElemets.aupload.title,
  design: designElemets.aupload.design
}

//详情列表
antvComps['adescriptions'] = {
  exportName: 'Descriptions',
  def: UI.component.generate({
    component: antdv.Descriptions
  }),
  title: designElemets.adescriptions.title,
  design: designElemets.adescriptions.design
}


//详情列表
antvComps['adescriptions'] = {
  exportName: 'Descriptions',
  def: UI.component.generate({
    component: antdv.Descriptions
  }),
  title: designElemets.adescriptions.title,
  design: designElemets.adescriptions.design
}

// 步骤条
antvComps['asteps'] = {
  exportName: 'Descriptions',
  def: UI.component.generate({
    component: antdv.Steps
  }),
  title: designElemets.asteps.title,
  design: designElemets.asteps.design
}

/**
 * 定义vue组件
 */
export const vueComponents = {
  ...antvComps
}

export const allowDsComponents = [
  {key: 'a',value: 'a', label:  antvComps['a'].title},
  {key: 'div',value: 'div', label:  antvComps['div'].title},
  {key: 'span',value: 'span', label:  antvComps['span'].title},
  {key: 'abutton',value: 'abutton', label:  antvComps['abutton'].title},
  {key: 'acard',value: 'acard', label:  antvComps['acard'].title},
  {key: 'contaner',value: 'contaner', label:  antvComps['contaner'].title},
  {key: 'adropdown',value: 'adropdown', label:  antvComps['adropdown'].title},
  {key: 'aform',value: 'aform', label:  antvComps['aform'].title},
  {key: 'input',value: 'input', label:  antvComps['input'].title},
  {key: 'amodal',value: 'amodal', label:  antvComps['amodal'].title},
  {key: 'select',value: 'select', label:  antvComps['select'].title},
  {key: 'treeselect',value: 'treeselect', label:  antvComps['treeselect'].title},
  {key: 'atable',value: 'atable', label:  antvComps['atable'].title},
  {key: 'atabs',value: 'atabs', label:  antvComps['atabs'].title},
  {key: 'atree',value: 'atree', label:  antvComps['atree'].title},
  {key: 'aupload',value: 'aupload', label:  antvComps['aupload'].title},
  {key: 'adescriptions',value: 'adescriptions', label:  antvComps['adescriptions'].title},
  {key: 'asteps',value: 'asteps', label:  antvComps['asteps'].title}
]

