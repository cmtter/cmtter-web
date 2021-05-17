import { defineComponent, provide, inject, toRaw, shallowRef } from 'vue'
import VueTypes from  'vue-types'
import { Row, Col } from 'ant-design-vue'
import UIConfig from './ui-config'
import omit from 'omit.js';
import { getOptionProps, getSlot } from 'ant-design-vue/es/_util/props-util'
import { defalutProps } from '../utils'

function generate(options){
  const props = {
    // 左右和上下边距(px)
    gutter: VueTypes.array.def([4,4]),
    // 定义一行多少列 该优先级低于子元素的flex
    columnCount: VueTypes.integer.def(0),
    // 水平对齐方式
    justify: VueTypes.oneOf(['start', 'center', 'end', 'space-between', 'space-around']),
    // 垂直对齐方式
    align: VueTypes.oneOf(['top', 'middle', 'bottom']),
    //偏移单位
    offset:VueTypes.integer.def(0),
    //flex 宽度定位
    flex: VueTypes.string,
    // col
    col: VueTypes.number,
    ui: VueTypes.string,
    vif: VueTypes.bool
  }

  const _formControl = {
    props: {
      ...defalutProps(props, options)
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
      provide(UIConfig.UI_CONTANER_SYMBOL, this)
      if (this.hostComp && this.hostComp.registerUI && this.ui){
        this.hostComp.registerUI(this.ui, this)
      }
    },
    methods:{
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
            const col = this.col ? this.col : (columnCount ? (24 / columnCount) : null)
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
      const rowProps = omit(allProps, ['offset', 'flex', 'columnCount'])
      const children = getSlot(this);
      return this.renderColWapper((<Row {...rowProps}>{children}</Row>))
    }
  }

  return defineComponent(_formControl)
}

export default {name: 'contaner', generate: generate}