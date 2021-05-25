import { defineComponent, provide, inject, toRaw, shallowRef } from 'vue'
import VueTypes from  'vue-types'
import { Row } from 'ant-design-vue'
import UIConfig from './ui-config'
import omit from 'omit.js';
import { getOptionProps, getSlot } from 'ant-design-vue/es/_util/props-util'
import classNames from 'ant-design-vue/es/_util/classNames'
import { defalutProps } from '../utils'

function generate(options){
  const uimixins = UIConfig.UI_MIXINS()
  const props = {
    // 左右和上下边距(px)
    gutter: VueTypes.array.def([4,4]),
    // 定义一行多少列 该优先级低于子元素的flex
    columnCount: VueTypes.integer.def(0),
    // 水平对齐方式
    justify: VueTypes.oneOf(['start', 'center', 'end', 'space-between', 'space-around']),
    // 垂直对齐方式
    align: VueTypes.oneOf(['top', 'middle', 'bottom']),
    ...(uimixins.props)
  }

  const _formControl = {
    mixins: [uimixins],
    props: {
      ...defalutProps(props, options)
    },
    setup(){
      const dyncProps = shallowRef({})
      const parentContaner = inject(UIConfig.UI_CONTANER_SYMBOL, null)
      const updateDyncProps = (newProps = {}) => {
        dyncProps.value = {
          ...(toRaw(dyncProps.value)),
          ...newProps
        }
      }
      return {
        dyncProps,
        updateDyncProps,
        parentContaner
      }
    },
    created(){
      provide(UIConfig.UI_CONTANER_SYMBOL, this)
    },
    methods:{},
    render(){
      let allProps =  { ...getOptionProps(this), ...this.$attrs, ...this.dyncProps };
      const rowProps = omit(allProps, ['offset', 'flex', 'columnCount'])
      // 样式
      const children = getSlot(this);
      return this.renderVif(this.renderColWapper((<Row {...rowProps} class={classNames(rowProps.class, {'ui-contaner': true})}>{children}</Row>)))
    }
  }

  return defineComponent(_formControl)
}

export default {name: 'contaner', generate: generate}