/**
 * 选择框,适应场景:
 * 1. 数据量少(<20)
 * 2. > 10条会自动显示搜索
 */
import { defineComponent, computed, ref, inject, watch, shallowRef, toRaw} from 'vue'
import classNames from 'ant-design-vue/es/_util/classNames'
import { getOptionProps } from 'ant-design-vue/es/_util/props-util'
import VueTypes from  'vue-types'
import UIConfig from './ui-config'
import { defalutProps } from '../utils'
import { Select, Form, spin } from 'ant-design-vue'
import debounce from 'lodash-es/debounce';
const FormItem = Form.Item

export const NULL_FUNCTION = () => {}
export const NULL_ARRAY = []
function generate(options){
  const uimixins = UIConfig.UI_MIXINS()
  const props = {
    // label宽度比例
    labelCol: VueTypes.number.def(6),
    // control宽度比例
    wrapperCol: VueTypes.number.def(16),
    // label
    label: VueTypes.string.def('简单选择'),
    // name
    name: VueTypes.string,
    // disabled
    disabled: VueTypes.bool.def(false),
    // value
    value: VueTypes.oneOfType([VueTypes.object, VueTypes.array]).def(null),
    //size
    size: VueTypes.oneOf(['large', 'small']),
    //placeholder
    placeholder:VueTypes.string.def('请选择...'),
    //数据转换
    transform: VueTypes.func.def(NULL_FUNCTION),
    // value、label字段解析配置['valueField', 'labelField']
    fields: VueTypes.array.def(NULL_ARRAY),
    //数据
    datas: VueTypes.array.def(NULL_ARRAY),
    //参数
    params: VueTypes.object,
    //加载数据函数 datas优先级高于loadDatas
    loadDatas: VueTypes.func.def(NULL_FUNCTION),
    //服务端搜索: 异步加载数据 loadDatas优先级高于loadDatasAsync
    loadDatasAsync: VueTypes.func.def(NULL_FUNCTION),
    //校验规则
    rules: VueTypes.array.def(NULL_ARRAY),
    //loadData
    mode: VueTypes.oneOf(['multiple', 'combobox', 'tags']),
    // tag的最大文本长度,超过则显示省略号
    maxTagTextLength: VueTypes.number,
    //最大tag显示个数
    maxTagCount: VueTypes.number,
    ...(uimixins.props),
    // 场景
    scene: VueTypes.oneOf(['autoComplete', 'multipleautoComplete'])
  }

  const _formControl = {
    mixins: [uimixins],
    props: {
      ...(defalutProps(props, options))
    },
    setup(props, {emit}){
      // 获取宿主组件
      const hostComp = inject(UIConfig.UI_HOST_PARENT_CONTEXT_SYMBOL)
      const loading = ref(false)
      const mergeDatas = shallowRef([])
      const preSearchText = ref('')

       // 是否是服务端查询
       const hasLoadDatasAsync = computed(() => (typeof props.loadDatasAsync === 'function' && props.loadDatasAsync !== NULL_FUNCTION))

      //加载数据
      const loadDatas = async (params, _datas) => {
        _datas = _datas || props.datas
        if ((!_datas || _datas.length === 0) && typeof props.loadDatas === 'function' && props.loadDatas !== NULL_FUNCTION){
          loading.value = true
          _datas = await props.loadDatas.call(hostComp, params)
          loading.value = false
        }
        _datas = _datas || []
        const d = (typeof props.transform === 'function' &&  props.transform !== NULL_FUNCTION) ? (props.transform(_datas) || []) : _datas
        mergeDatas.value = (d || []).map(r => {
          if (props.fields && props.fields.length > 0){
            return {
              ...r,
              ...(props.fields[0] ? {value: r[props.fields[0]]} : {}),
              ...(props.fields[1] ? {label: r[props.fields[1]]} : {})
            }
          }
          return {...r}
        })
        // autoComplete多选场景下
        if (props.scene === 'multipleautoComplete'){
          const text = toRaw(preSearchText.value)
          mergeDatas.value = [ {value: text, label: text}, ...(toRaw(mergeDatas.value))]
        }
      }
      
      // 是否显示搜索
      const showSearch  = computed(() => mergeDatas.value.length > 10 || hasLoadDatasAsync.value)

      const setBindSearchValue = debounce((inputValue) => {
        inputValue = (inputValue || '').trim()
        emit('update:value', inputValue ? {value: inputValue, label: inputValue} : null)
      }, 200)

      // 过滤
      const filterOption = (inputValue, option) => {
        if (props.scene === 'autoComplete' && inputValue){
          setBindSearchValue(inputValue)
        }
        return !inputValue || option.label.indexOf(inputValue) > -1
      }

      // 格式化value => []
      const valueList = computed(() => {
        const v = props.value || []
        return Array.isArray(v) ? v : [v]
      })

      // onSelect
      const onSelect = v => {
        emit('update:value', v)
      }

      const onSearch = computed(() => {
        if (hasLoadDatasAsync.value){
          return debounce(async function(text){
            text = preSearchText.value = (text || preSearchText.value)
            loading.value = true
            if (props.scene === 'autoComplete'){
              emit('update:value', {value: text, label: text})
            }
            const res = await props.loadDatasAsync.call(this, text, props.params)
            loading.value = false
            loadDatas(null, res)
            return res
          }, 500)
        } 
        return null
      })

      // 加载数
      if (!hasLoadDatasAsync.value){
        loadDatas(props.params)
      }
      
      watch(() => props.params, () => {
        if (!hasLoadDatasAsync.value){
          loadDatas(props.params)
        } else {
          onSearch.value()
        }
      })

      watch(() => props.datas, () => {
        loadDatas(props.params)
      })

      const dyncProps = shallowRef({})
      const updateDyncProps = (newProps = {}) => {
        dyncProps.value = {
          ...(toRaw(dyncProps.value)),
          ...newProps
        }
      }

      return {
        mergeDatas,
        showSearch,
        filterOption,
        valueList,
        onSelect,
        loading,
        onSearch,
        hasLoadDatasAsync,
        dyncProps,
        updateDyncProps
      }
    },
    // 渲染
    render(){
      const allProps =  { ...getOptionProps(this), ...this.$attrs, ...this.dyncProps };
      const { mergeDatas , showSearch, filterOption,valueList, onSelect, loading, onSearch, hasLoadDatasAsync } = this
      const rules = allProps.rules.map(m => ({...m, host: this.hostComp}))
      // formItem 属性
      const formItemProps = {
        label: allProps.label,
        labelCol: {span: allProps.labelCol},
        wrapperCol:  {span: allProps.wrapperCol},
        name: allProps.name,
        rules: rules
      }
      
      //
      const notFoundContent = (hasLoadDatasAsync && loading) ? (<div style="text-align:center;"><spin size="small" /></div>) : null

      // 属性配置
      const selectProps = {
        allowClear: true,
        labelInValue: true,
        options: mergeDatas,
        size: allProps.size,
        ...(hasLoadDatasAsync ? {filterOption: false} : {filterOption: filterOption} ),
        value: valueList,
        'onUpdate:value': onSelect,
        showSearch: showSearch,
        //大于50条会自动启用virtual
        virtual: mergeDatas.length > 50,
        placeholder: allProps.placeholder,
        disabled: allProps.disabled,
        mode: allProps.mode,
        maxTagTextLength: allProps.maxTagTextLength,
        maxTagCount: allProps.maxTagCount,
        //服务端模式下 忽略右侧的loading
        ...(hasLoadDatasAsync ? {} : {loading: loading} ),
        showArrow: true,
        onSearch: onSearch,
        notFoundContent
      }
      const _class = classNames(allProps.class, {[options.uiaxis || 'ui-form-select']: true, ['ui-form']: true})
      const formController = <Select {...selectProps} v-slots={this.$slots}></Select>
      const content = this.onlyRenderControl ? (<div class={_class} style="height: 100%"> {formController} </div>) : (<FormItem {...formItemProps} class={_class}>{formController}</FormItem>)
      return this.renderVif(this.renderColWapper(content))
    }
  }

  return defineComponent(_formControl)
}

export default {name: 'form.select', generate: generate}