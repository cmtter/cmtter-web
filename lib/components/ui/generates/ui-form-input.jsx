import { defineComponent, inject, shallowRef, toRaw } from 'vue'
import UIConfig from './ui-config'
import { getOptionProps } from 'ant-design-vue/es/_util/props-util'
import { Input, Form, Col } from 'ant-design-vue'
import omit from 'omit.js';
import { defalutProps } from '../utils'
import VueTypes from  'vue-types'
const FormItem = Form.Item

function generate(options){
  // 定义属性
  const props = {
    // label宽度比例
    labelCol: VueTypes.number,
    // control宽度比例
    wrapperCol: VueTypes.number,
    // 前偏移边距
    beforeOffsetCol: VueTypes.number,
    // 后偏移边距
    afterOffsetCol: VueTypes.number,
    // label
    label: VueTypes.string,
    // rules校验规则
    rules: VueTypes.array,
    // name
    name: VueTypes.string,
    // disabled
    disabled: VueTypes.bool.def(false),
    // value
    value: VueTypes.oneOfType([VueTypes.string, VueTypes.number]),
    //size
    size: VueTypes.oneOf(['large', 'small']).def('small'),
    //placeholder
    placeholder:VueTypes.string,
    //偏移单位
    offset:VueTypes.integer.def(0),
    //flex 宽度定位
    flex: VueTypes.string,
    // col
    col: VueTypes.number,
    // ui 定义ui唯一名称
    ui: VueTypes.string,
    vif: VueTypes.bool
  }

  const defaultValue = (options.value !== undefined && options.value !== null && typeof options.value === 'string') ? options.value : undefined

  const _formControl = {
    props: {
      ...(defalutProps(props, options))
    },
    setup(){
      const hostComp = inject(UIConfig.UI_HOST_PARENT_CONTEXT_SYMBOL)
      const dyncProps = shallowRef({})
      const parentContaner = inject(UIConfig.UI_CONTANER_SYMBOL, null)
      const updateDyncProps = (newProps = {}) => {
        dyncProps.value = {
          ...(toRaw(dyncProps.value)),
          ...newProps
        }
      }
      return {
        hostComp,
        dyncProps,
        updateDyncProps,
        parentContaner
      }
    },
    created(){
      if (this.hostComp && this.hostComp.registerUI && this.ui){
        this.hostComp.registerUI(this.ui, this)
      }
    },
    beforeUnmount(){
      if (this.hostComp && this.hostComp.registerUI && this.ui){
        this.hostComp.removeUI(this.ui)
      }
    },
   
    methods: {
      renderColWapper(children){
        if (this.parentContaner && (this.parentContaner.columnCount || this.offset || this.flex || this.col)){
          const { flex, offset } = this
          const columnCount = this.parentContaner.columnCount
          let colProps = null
          // flex优先级最高
          if (flex){
            colProps = {offset, flex}
          }
          if (!colProps){
            const col = (this.col) ? this.col : ((columnCount) ? (24 / columnCount) : null)
            colProps = {
              offset,
              ...(col ? {span: col} : {})
  
            }
          }
          return (<Col {...colProps}>{children}</Col>)
        }
        return children
      }
    },

    render(){
      if (this.vif === false){
        return null
      }

      let allProps =  { ...getOptionProps(this), ...this.$attrs, ...this.dyncProps };

      const inputProps = {
        ...omit(allProps, ['ui', 'vif']),
        ...(defaultValue ? {defaultValue} : {}),
        allowClear: true,
        autocomplete: 'off'
      }

      const formItemProps = {
        label: allProps.label,
        labelCol: {span: allProps.labelCol},
        wrapperCol:  {span: allProps.wrapperCol},
        name: allProps.name,
        rules: allProps.rules,
        validateFirst: true
      }

      const content = (<FormItem {...formItemProps}><Input {...inputProps}></Input></FormItem>)

      return this.renderColWapper(content)
    } 
  }
  return defineComponent(_formControl)
}

export default {name: 'form.input', generate: generate}