/**
 * 表单上传
 * 仅支持手动上传
 * @author xiufu.wang
 */
 import { defineComponent, shallowRef, toRaw } from 'vue'
 import { defalutProps } from '../utils'
 import classNames from 'ant-design-vue/es/_util/classNames'
 import { PlusOutlined } from '@ant-design/icons-vue'
 import VueTypes from  'vue-types'
 import { Upload } from 'ant-design-vue'
 import UIConfig from './ui-config'
 import { getOptionProps, getSlot} from 'ant-design-vue/es/_util/props-util'

 function generate(options){
  const uimixins = UIConfig.UI_MIXINS()
  //扩展属性
  const props = {
    title: VueTypes.string
  }
  const _formControl = {
    mixins: [uimixins],
    props:{
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
      
      const beforeUpload = () => false

      return {
        dyncProps,
        updateDyncProps,
        beforeUpload
      }
    },
    render(){
      const allProps =  { ...getOptionProps(this), ...this.$attrs, ...this.dyncProps };
      const uploadProps = {
        ...allProps,
        beforeUpload: this.beforeUpload
      }
      let children = getSlot(this);
      children = children && children.length > 0 ?  children : (<div><PlusOutlined/><span class="ant-upload-text"> {this.title || '添加附件'} </span></div>);
      const content = (<Upload {...uploadProps} class={classNames(allProps.class, {'ui-form-upload': true})} v-slots={this.$slot}>{children}</Upload>)
      return  this.renderVif(this.renderColWapper(content)) 
    }
  }
  return defineComponent(_formControl)
 }
 
 export default {name: 'form.upload', generate: generate}