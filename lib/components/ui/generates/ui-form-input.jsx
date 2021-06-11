import { computed, defineComponent, inject, shallowRef, toRaw, watch, ref } from 'vue'
import UIConfig from './ui-config'
import { getOptionProps } from 'ant-design-vue/es/_util/props-util'
import classNames from 'ant-design-vue/es/_util/classNames'
import { Input, Form, DatePicker} from 'ant-design-vue'
import omit from 'omit.js';
import { defalutProps } from '../utils'
import VueTypes from  'vue-types'
const FormItem = Form.Item
const TextArea = Input.TextArea
function generate(options){
  const uimixins = UIConfig.UI_MIXINS()
  // 定义属性
  const props = {
    // label宽度比例
    labelCol: VueTypes.number.def(6),
    // control宽度比例
    wrapperCol: VueTypes.number.def(16),
    // label
    label: VueTypes.string,
    // rules校验规则
    rules: VueTypes.array,
    // name
    name: VueTypes.string,
    // disabled
    disabled: VueTypes.bool.def(false),
    // value
    value: VueTypes.oneOfType([VueTypes.string, VueTypes.number]).def(null),
    //size
    size: VueTypes.oneOf(['large', 'small']).def(UIConfig.DEFAULT_FORM_SIZE),
    //placeholder
    placeholder:VueTypes.string,
    //prefix
    prefix: VueTypes.oneOfType([VueTypes.string, VueTypes.object]),
    suffix: VueTypes.oneOfType([VueTypes.string, VueTypes.object]),
    inputValidator: VueTypes.func,
    //内容显示格式化
    formatter: VueTypes.func.def(() => false),
    // 显示内容=>格式化到值
    parser: VueTypes.func.def(() => false),
    ...(uimixins.props),
    // 输入类型
    inputType: VueTypes.oneOf(['text', 'date', 'datetime', 'textarea']).def('text'),
    // 国际化
    locale: VueTypes.object,
    // 日期格式化
    dateValueFormat: VueTypes.string
  }

  const defaultValue = (options.value !== undefined && options.value !== null && typeof options.value === 'string') ? options.value : undefined

  const _formControl = {
    mixins: [uimixins],
    props: {
      ...(defalutProps(props, options))
    },
    data(){
     return {}
    },
    setup(props, { emit }){
      const constomerInputValue = ref(null)
      const hostComp = inject(UIConfig.UI_HOST_PARENT_CONTEXT_SYMBOL)
      const dyncProps = shallowRef({})
      const parentContaner = inject(UIConfig.UI_CONTANER_SYMBOL, null)
      const updateDyncProps = (newProps = {}) => {
        dyncProps.value = {
          ...(toRaw(dyncProps.value)),
          ...newProps
        }
      }

      // 实时监控用户输入是否合法
      const inputValue = computed(() => props.value)
      watch(inputValue, (val, preVal) => {
        if (props.inputValidator && props.inputValidator instanceof Function ){
          if (props.inputValidator(val, preVal) === false){
            emit('update:value', preVal)
            return
          }
        }
      })

      // 显示格式化：例如单位的转换
      const formatterInputValue = computed(() => {
        if (constomerInputValue.value !== null){
          return constomerInputValue.value
        }
        if(typeof props.formatter !== 'function' || props.formatter(inputValue.value) === false){
          return inputValue.value
        } else {
          return props.formatter(inputValue.value)
        }
      })

      //保存用户正在的输入内容
      const saveConstomerInputValue = (v) => {
        constomerInputValue.value = v
      }

      // 格式化constomerInputValue
      watch(constomerInputValue, (val, preVal) => {
        if (props.inputValidator && props.inputValidator instanceof Function ){
          if (props.inputValidator(val, preVal) === false){
            constomerInputValue.value = preVal
          }
        }
      })

      return {
        hostComp,
        dyncProps,
        updateDyncProps,
        parentContaner,
        inputValue,
        formatterInputValue,
        constomerInputValue,
        saveConstomerInputValue
      }
    },
    methods: {
      // 用户完成输入后,进行格式化
      handerCompleteInput(e){
        const props = { ...getOptionProps(this), ...this.$attrs, ...this.dyncProps };
        if (props.onBlur){
          props.onBlur(e)
        }
        
        if (props.formatter && typeof props.formatter === 'function'){
            const v = props.formatter(this.value)
            if (v !== false){
              this.saveConstomerInputValue(v)
            }
        }
      },

      // 处理用户正在输入
      handerInputing(e){
        this.saveConstomerInputValue(e.target.value)
      },

      parserValue(v){
        const props = { ...getOptionProps(this), ...this.$attrs, ...this.dyncProps };
        if (props.inputValidator && props.inputValidator instanceof Function ){
          if (props.inputValidator(v, v) === false){
            this.$emit('update:value', null)
          } else {
            if(typeof props.parser !== 'function' || props.parser(v) === false){
              this.$emit('update:value', v)
            } else {
              this.$emit('update:value', props.parser(v))
            }
          }
        }
      },

      renderTextInput(props){
        const inputProps = {
          ...omit(props, ['ui', 'vif', 'value', 'offset', 'flex', 'col', 'inputType']),
          ...(defaultValue ? {defaultValue} : {}),
          allowClear: true,
          autocomplete: 'off',
          value: this.formatterInputValue,
          onBlur: this.handerCompleteInput,
          onInput:  this.handerInputing,
          'onUpdate:value': this.parserValue
        }
        return <Input {...inputProps} ></Input>
      },
      renderDateInput(props){
        const dateProps = {
          ...props,
          inputReadOnly: true,
          valueFormat: props.dateValueFormat
        }
        return <DatePicker {...dateProps}></DatePicker>
      },
      renderTextAreaInput(props){
        const inputProps = {
          ...omit(props, ['ui', 'vif', 'value', 'offset', 'flex', 'col', 'inputType']),
          ...(defaultValue ? {defaultValue} : {}),
          allowClear: true,
          autocomplete: 'off',
          value: this.formatterInputValue,
          onBlur: this.handerCompleteInput,
          onInput:  this.handerInputing,
          'onUpdate:value': this.parserValue
        }
        return <TextArea {...inputProps} ></TextArea>
      },
      renderDateTimeInput(props){
        const dateTimeProps = {
          ...props,
          inputReadOnly: true,
          valueFormat: props.dateValueFormat,
          showTime: true
        }
        return <DatePicker {...dateTimeProps}></DatePicker>
      },
      renderFormController(props){
        if (props.inputType === 'text'){
          return this.renderTextInput(props)
        }
        if (props.inputType === 'date'){
          return this.renderDateInput(props)
        }

        if (props.inputType === 'datetime'){
          return this.renderDateTimeInput(props)
        }

        if (props.inputType === 'textarea'){
          return this.renderTextAreaInput(props)
        }
        return null;
      }
    },

    render(){
      const allProps =  { ...getOptionProps(this), ...this.$attrs, ...this.dyncProps };
      //根据rule注入host宿主组件
      const rules = allProps.rules.map(m => ({...m, host: this.hostComp}))
      const formItemProps = {
        label: allProps.label,
        labelCol: {span: allProps.labelCol},
        wrapperCol:  {span: allProps.wrapperCol},
        name: allProps.name,
        rules: rules,
        validateFirst: true
      }
      const _class = classNames(allProps.class, {[options.uiaxis || 'ui-form-input']: true, ['ui-form']: true})
      const content = this.onlyRenderControl ? (<div class={_class} style="height: 100%"> {this.renderFormController(allProps)} </div>) : (<FormItem {...formItemProps} class={_class}>{this.renderFormController(allProps)}</FormItem>)
      return this.renderVif(this.renderColWapper(content))
    } 
  }
  return defineComponent(_formControl)
}

export default {name: 'form.input', generate: generate}