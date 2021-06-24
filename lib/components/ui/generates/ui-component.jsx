/**
 * 通用组件创建
 * 
 * 为了保持使用组件规范的一致性,建议使用antd-design-vue组件都是用这个该库进行创建:
 * 
 * 例如 
 * import {Spin} from 'antd-design-vue'
 * const SpinComp = UI.component.generate({
 *   component: Spin 
 *   props: { }  属性,
 *   slots: {
 *     // 定义插槽(部件)
 *     name: (hostScope(宿主环境对象), prop(组件默认参数)) => (<div></div>)
 *   }
 * })
 * 
 * 基于以上的规范, 因为ant-design-vue组件存在一个name属性, 这样后续框架可以基于交互规范进行灵活的扩展，从而收敛组件的使用
 * 复杂度
 * 
 */
import { defineComponent, shallowRef, toRaw } from 'vue'
import objectProperty from '@lib/api/tools/object-property'
import { getOptionProps } from 'ant-design-vue/es/_util/props-util'
import VueTypes from  'vue-types'
import UIConfig from './ui-config'
import { defalutProps } from '../utils'

const UI = window._$UIS$_ || {}

function generate(options){
  const UIComponent = options.component
  const componentName = UIComponent.name
  const uimixins = UIConfig.UI_MIXINS()
  
  //是否存在已重写的 UI.overwrite.[componentName] 组件
  const constomerDefineUI = objectProperty(UI, 'overwrite.' + componentName, false)
  if (constomerDefineUI && typeof constomerDefineUI.generate === 'function'){
      return constomerDefineUI.generate(options)
  }

  //定义属性
  const props = {
    props: VueTypes.object.def({}),
    slots: VueTypes.object.def({}),
    ...(uimixins.props),
  }

  //定义组件
  const _componentOption = {
    mixins: [uimixins],
    props: {
      ...(defalutProps(props, options))
    },
    setup(){
      const dyncProps = shallowRef({})
      const updateDyncProps = (newProps = {}) => {
        const nprops = {
          props: {
             ...(objectProperty(toRaw(dyncProps.value), 'props', {})),
             ...(objectProperty(newProps, 'props', {}))
          },
          slots:{
            ...(objectProperty(toRaw(dyncProps.value), 'slots', {})),
             ...(objectProperty(newProps, 'slots', {})),
          }
        }
        dyncProps.value = nprops
      }
      return {
        dyncProps,
        updateDyncProps
      }
    },
    render(){
      const {hostComp} = this
      const props = { ...getOptionProps(this), ...this.dyncProps };
      const attrs = {...(this.$attrs || {})}
      const componentProp = {
          ...(props.props || {}),
          ...attrs
      }
      const slots = {
        ...(props.slots || {}),
        ...(this.$slots || {})
      }

      //绑定宿主环境作用域
      Object.keys(slots).forEach(r => {
        if(typeof slots[r] === 'function'){
          const _o = slots[r]
          slots[r] = function(arg){
            if (arg === null || arg === undefined){
              return  _o.call(this, {hostComp})
            }
            if (typeof arg !== 'object' && (typeof arg === 'string' || typeof arg === 'boolean' || !isNaN(arg))){
              return  _o.call(this, {arg, hostComp})
            }
            return  _o.call(this, {...arg, hostComp})
          }
        }
      })
      const content = <UIComponent {...componentProp} v-slots={slots} ref="compRef"></UIComponent>
      return this.renderVif(this.renderColWapper(content))
    }
  }
  return defineComponent(_componentOption)
}

export default {name: 'component', generate: generate}