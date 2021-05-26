/**
 * 表单分组交互
 * ui.form.group.genete({
 *  label: ?,
 *  rules: [],
 *  groups: [
 *    {vmodel: sting, ui: option},
 *    {vmodel: string, ui: <span>~</span>},
 *    {vmodel: sting, ui: option},
 *    {vmodel: sting, ui: option}
 *  ]
 * })
 * 
 */
import { defineComponent, isVNode, shallowRef, toRaw, createVNode, cloneVNode } from 'vue'
import { getOptionProps } from 'ant-design-vue/es/_util/props-util'
import classNames from 'ant-design-vue/es/_util/classNames'
import { Form } from 'ant-design-vue'
import omit from 'omit.js';
import { defalutProps } from '../utils'
import VueTypes from  'vue-types'
const FormItem = Form.Item
import UIConfig from './ui-config'
import UiContaner from './ui-contaner'



function generate(options){
  const group_Separator = (<span class="ui-form-group-separator">~</span>)
  const uimixins = UIConfig.UI_MIXINS()
  const vmodelProps = options.groups.reduce((memo, ui) => {
    memo.props[ui.vmodel] = VueTypes.oneOfType([VueTypes.string, VueTypes.number]).def(null)
    return memo
  },{props: {}})
  //定义属性
  const props = {
    // label宽度比例
    labelCol: VueTypes.number.def(6),
    // control宽度比例
    wrapperCol: VueTypes.number.def(16),
    // label
    label: VueTypes.string.def('分组表单'),
    // rules校验规则
    rules: VueTypes.array,
    // name
    name: VueTypes.string,
    // disabled
    disabled: VueTypes.bool.def(false),
    //是否显示分割线
    showSeparator: VueTypes.bool.def(false),
    // 名称
    ui: VueTypes.string,
    // 名称
    vif: VueTypes.bool,
    //分组组件
    groups: VueTypes.array.def([]),
    ...(uimixins.props),
    // 动态生成双向绑定属性
    ...(vmodelProps.props)
  }
  // 布局容器
  const UIContaner = createVNode(UiContaner.generate({col: 24}),{}, [])

  const _formControl = {
    mixins: [uimixins],
    props: {
      ...(defalutProps(props, options))
    },
    setup(){
      const dyncProps = shallowRef({})
      const updateDyncProps = (newProps = {}) => {
        dyncProps.value = {
          ...(toRaw(dyncProps.value)),
          ...newProps
        }
      }
      return {
        dyncProps,
        updateDyncProps
      }
    },
    methods: {
      renderFormControllers(props){
        const groups = props.groups || []
        const goupChildrens = groups.map((r) => {
          const vmodel = r.vmodel
          const ui = r.ui
          let children
          // 定义表单控件配置
          const uiProps = {
            //组件属性
            disabled: props.disabled,
            ...omit(r, ['vmodel', 'ui']),
            //双向绑定属性
            ...(vmodel ? {
              value: props[r.vmodel],
              'onUpdate:value': (v) => {
                this.$emit('update:' + r.vmodel, v)
              }
            } : {}),
            label: '',
            wrapperCol: 24,
            onlyRenderControl: true,
            onBlur: () => {
              setTimeout(() => {
                this.$refs.formitem.onFieldChange()
              }, 0)
            },
            onChange:() => {
              setTimeout(() => {
                this.$refs.formitem.onFieldChange()
              }, 0)
            }
          }
          if (isVNode(ui)){
            children = cloneVNode(ui, uiProps, false)
          } else {
            children = <ui {...uiProps}></ui>
          }
          return children
        })
        if(props.showSeparator === true){
          return goupChildrens.reduce((m, c, index, arr) => {
            m.push(c)
            if (!(arr.length < 2 || goupChildrens.length - 1 === index)) {
              m.push(cloneVNode(group_Separator, {}, false))
            }
            return m
          }, [])
        }
        return goupChildrens
      },
      renderChildren(props){
        /**
         * ui.form.group rules仅支持isValidator 模式
         */
        const groups = props.groups || []
        const rules = (props.rules || []).filter(r => typeof r.validator === 'function').map(r => {
          const _validator = r.validator
          const that = this
          r.validator = function(v, ...args) {
            const vals = groups.reduce((memo, g) => {
              if (g.vmodel && typeof g.vmodel === 'string'){
                memo[g.vmodel] = that[g.vmodel]
              }
              return memo
            }, {})
            return _validator.apply(vals, ...args)
          }
          return {
            ...r,
            host: that.hostComp
          }
        })
        const formItemProps = {
          label: props.label,
          labelCol: {span: props.labelCol},
          wrapperCol:  {span: props.wrapperCol},
          name: props.name,
          rules: rules,
          validateFirst: true,
          ref: 'formitem'
        }
       const contaner =  <UIContaner>{this.renderFormControllers(props)}</UIContaner>
       return (<FormItem {...formItemProps} class={classNames(props.class, {[options.uiaxis || 'ui-form-group']: true})}>{ contaner}</FormItem>)
      }
    },
    render(){
      const props =  { ...getOptionProps(this), ...this.$attrs, ...this.dyncProps };
      return this.renderVif(this.renderColWapper(this.renderChildren(props)))
    }
  }

  return defineComponent(_formControl)
}

export default {name: 'form.group', generate: generate}