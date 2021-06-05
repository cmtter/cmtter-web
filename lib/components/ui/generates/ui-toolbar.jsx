
 import { defineComponent,shallowRef, toRaw, ref, computed } from 'vue'
 import VueTypes from  'vue-types'
 import {  Row, Col, Button, Space, Dropdown, Menu } from 'ant-design-vue'
 import { getOptionProps } from 'ant-design-vue/es/_util/props-util'
 import {monitorResize} from 'ant-design-vue/es/vc-align/util'
 import debounce from 'lodash-es/debounce';
 import { DownOutlined } from '@ant-design/icons-vue'
 import UIConfig from './ui-config'
 import { defalutProps } from '../utils'
const MenuItem = Menu.Item

function generate(options){
  options = options || {}
  const uimixins = UIConfig.UI_MIXINS()
  const props = {
    // 居中方式,
    align: VueTypes.oneOf(['center', 'left', 'right']).def('right'),
    //按钮
    actions: VueTypes.oneOfType([VueTypes.object, VueTypes.array]),
    max: VueTypes.number.def(0),
    // max width
    maxWidth: VueTypes.string,
    ...(uimixins.props)
  }

  const _toolbar = {
    mixins: [uimixins],
    props: {
      ...(defalutProps(props, options))
    },
    setup(props){
      const dyncProps = shallowRef({})
      const contanerRef = ref()
      const rootRef = ref() 
      const maxCount = ref(0)
      const updateDyncProps = (newProps = {}) => {
        dyncProps.value = {
          ...(toRaw(dyncProps.value)),
          ...newProps
        }
      }

      const actionList = computed(() => {
        const a = dyncProps.value.actions || props.actions || []
        return Array.isArray(a) ? a : [a]
      })

      const updateMaxCount = m => {
        maxCount.value =  props.max > 0 ? Math.min(m, props.max) : m
      }

      const resetMaxCount = () =>{
        maxCount.value =actionList.value.length
      }

      return {
        dyncProps,
        updateDyncProps,
        contanerRef,
        maxCount,
        updateMaxCount,
        rootRef,
        actionList,
        resetMaxCount
      }
    },
    methods: {
      doLayout(){
        const contanerEls = this.contanerRef.$el.children || []
        const rootRec = this.rootRef.$el.getBoundingClientRect()
        let totalW = 0
        const count = [].filter.call(contanerEls, r => {
         const rec =  r.getBoundingClientRect()
         totalW = totalW + rec.width
         return rootRec.width >= (totalW)
        }).length
        this.updateMaxCount(count > 4 ? count-1 : 1)
      }
    },
    mounted(){
      this.doLayout()
      // 监控
      this.clearMonitorResize = monitorResize(this.rootRef.$el, debounce(() => {
        this.resetMaxCount()
        this.$nextTick(() => {
          this.doLayout()
        })
      }, 20))
    },
    beforeMount(){
      if (this.clearMonitorResize){
        this.clearMonitorResize()
      }
    },
    render(){
      const allProps =  { ...getOptionProps(this), ...this.$attrs, ...this.dyncProps };
      const {actionList, maxCount} = this
      const _style = {
        overflow: 'hidden',
        maxWidth: allProps.maxWidth,
        textAlign: allProps.align
      }

      const butList = actionList.length > 0 ? actionList.slice(0, (maxCount === 0 ? actionList.length : maxCount)).map(
        r => {
          return (
            <Button>{r.text}</Button>
          )
        }
      ) : null
      
      const exta = maxCount >= actionList.length || actionList.length === 0 ? null : (
        <Dropdown 
        overlay={
          () => (
            <Menu>
              {
                actionList.slice(maxCount, actionList.length).map(
                  r => {
                    return (
                      <MenuItem key={r.action}>{r.text}</MenuItem>
                    )
                  }
                )
              }
            </Menu>
          )
        }
        >
          <Button>
            更多
            <DownOutlined />
          </Button>
        </Dropdown>
      )

      const rowProps = {
        type: 'flex'
      }
      console.log(rowProps);
      const context = (<Row {...rowProps}><Col flex='auto' style={_style} ref="rootRef">
          <Space size={5} ref="contanerRef">
            {
              butList
            }
            {exta}
          </Space>
         </Col> </Row>)
      
      return this.renderVif(this.renderColWapper(context, {style: {overflow: 'hidden'}}))
    }
  }

  return defineComponent(_toolbar)
}

export default {name: 'toolbar', generate: generate}