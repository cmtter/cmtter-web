/**
 * tree选择
 * 
 * @author xiufu.wang
 */
import { computed, defineComponent, inject, shallowRef, toRaw, ref, watch } from 'vue'
import UIConfig from './ui-config'
import classNames from 'ant-design-vue/es/_util/classNames'
import { getOptionProps } from 'ant-design-vue/es/_util/props-util'
import { defalutProps } from '../utils'
import { TreeSelect, Form, Spin } from 'ant-design-vue'
import VueTypes from  'vue-types'
const FormItem = Form.Item
export const NULL_FUNCTION = () => {}
export const NULL_ARRAY = []

// 格式化数据
function formatTreeData(datas, fields = [], isLeaf, canSelectParent, cache = {total: 0}){
  const res = []
  datas = datas || []
  isLeaf = (isLeaf === NULL_FUNCTION ? null : isLeaf)
  for (let index = 0; index < datas.length; index++) {
    const d = datas[index];
    const children = d[fields[2] || 'children']
    // 判断是否是叶子节点（非父节点）
    const leaf = ((isLeaf && isLeaf(d)) || (d.isLeaf === true || d.isLeaf === false ? d.isLeaf : !children)) 
    const item = {
      ...d,
      value: d[fields[0] || 'value'],
      label: d[fields[1] || 'label'],
      key: (d.key || d[fields[0] || 'value']),
      isLeaf: leaf,
      ...(canSelectParent === false && leaf=== false ? { selectable: false, disableCheckbox: true } : {}),
      ...(children ? {children: formatTreeData(d.children, fields, isLeaf, canSelectParent)} : {})
    }

    //计数
    if (leaf){
      cache.total++
    } else {
      cache.total = cache.total + (item.children || []).length
    }

    res.push(item)
  }
  res.$cache = cache
  return res
}

function generate(options){
  options = options || {}
  const uimixins = UIConfig.UI_MIXINS()
  
  const props = {
    // label宽度比例
    labelCol: VueTypes.number.def(6),
    // control宽度比例
    wrapperCol: VueTypes.number.def(16),
    // label
    label: VueTypes.string.def('树选择'),
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
    // value、label字段解析配置['valueField', 'labelField', 'childrenField']
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
    // 是否是leaf
    isLeafFn: VueTypes.func.def(NULL_FUNCTION),
    //是否多选
    multiple: VueTypes.bool.def(false),
    maxTagTextLength: VueTypes.number.def(10),
    //是否可以选择父节点
    canSelectParent: VueTypes.bool.def(true),
    //最大tag显示个数
    maxTagCount: VueTypes.number.def(3),
     /**
      * 定义当父节点满选的时候,该怎么显示
      * SHOW_ALL: 全显示包括父节点
      * SHOW_PARENT: 只显示父节点
      * SHOW_CHILD: 只显示子节点
      */
     showCheckedStrategy: VueTypes.oneOf(['SHOW_ALL', 'SHOW_PARENT', 'SHOW_CHILD']),
    ...(uimixins.props),
    // 场景
    scene: VueTypes.oneOf(['singleSelect', 'multipleSelect'])
  }

  const _formControl = {
    mixins: [uimixins],
    props: {
      ...(defalutProps(props, options))
    },
    setup(props, {emit}){
      const hostComp = inject(UIConfig.UI_HOST_PARENT_CONTEXT_SYMBOL)
      const mergeDatas = shallowRef([])
      const loading = ref(false)
      const needFilter = ref(false)
      
      const hasLoadDatasAsync = computed(() => (typeof props.loadDatasAsync === 'function' && props.loadDatasAsync !== NULL_FUNCTION))

      const loadDatas = async (_datas) => {
        let d = _datas || []
        //非异步加载
        if (!hasLoadDatasAsync.value){
          if (props.datas && props.datas.length > 0){
            d = props.transform !== NULL_FUNCTION ? (props.transform(props.datas) || []) : props.datas
          } else if ( props.loadDatas !== NULL_FUNCTION ){
            loading.value = true
            mergeDatas.value = []
            d = await props.loadDatas.call(hostComp, props.params)
            loading.value = false
          }
        } 
        // 格式化
        d = formatTreeData(d, props.fields, props.isLeafFn, props.canSelectParent)
        mergeDatas.value = d
        needFilter.value = d.$cache.total > 10
      }

      // 异步加载
      const onLoadData = async (treeNode ) => {
        const d = await props.loadDatasAsync.call(hostComp, treeNode, props.params)
        if (treeNode){
          treeNode.dataRef.children = d || []
          mergeDatas.value  = [...(toRaw(mergeDatas.value))]
          loadDatas([...(toRaw(mergeDatas.value))])
        } else {
          loadDatas(d)
        }
        
      }

       // 格式化value => []
      const valueList = computed(() => {
        const v = props.value || []
        return Array.isArray(v) ? v : [v]

      })

      // onSelect
      const onSelect = (v) => {
        emit('update:value', v)
      }

      //是否显示查询
      const showSearch = computed(() => needFilter.value)

      //过滤
      const filterNode = (inputValue, node) => {
        return node.props.dataRef.label.indexOf(inputValue) > -1
      }

      //监控参数
      const params = computed(() => props.params)
      watch(params,() => {
        if (!hasLoadDatasAsync.value){
          loadDatas()
        }
      })

      watch(() => props.datas, () => {
        mergeDatas.value = toRaw(props.datas)
      })

      //初始化数据
      if (hasLoadDatasAsync.value){
        onLoadData()
      } else{
        loadDatas()
      }
     

      const dyncProps = shallowRef({})
      const updateDyncProps = (newProps = {}) => {
        dyncProps.value = {
          ...(toRaw(dyncProps.value)),
          ...newProps
        }
      }

      return {
        hostComp,
        mergeDatas,
        valueList,
        onSelect,
        showSearch,
        dyncProps,
        updateDyncProps,
        loading,
        filterNode,
        onLoadData,
        hasLoadDatasAsync
      }
    },
    methods: {},

    render(){
      const allProps =  { ...getOptionProps(this), ...this.$attrs, ...this.dyncProps };
      const { mergeDatas , valueList, hostComp, showSearch, onSelect, loading, filterNode, onLoadData, hasLoadDatasAsync} = this
      const rules = allProps.rules.map(m => ({...m, host: hostComp}))
      // formItem 属性
      const formItemProps = {
        label: allProps.label,
        labelCol: {span: allProps.labelCol},
        wrapperCol:  {span: allProps.wrapperCol},
        name: allProps.name,
        rules: rules
      }
      
      const notFoundContent = loading && mergeDatas.length === 0 ? <div style="text-align:center;"><Spin size="small" /></div> : null
      
      //过滤处理
      const filterTreeNode = showSearch === false ? false : filterNode

      // 属性配置
      const selectProps = {
        allowClear: true,
        labelInValue: true,
        dropdownStyle: { maxHeight: '300px', overflow: 'auto' },
        treeData: mergeDatas,
        value: valueList,
        size: allProps.size,
        filterTreeNode: filterTreeNode,
        showSearch: showSearch,
        placeholder: allProps.placeholder,
        disabled: allProps.disabled,
        maxTagTextLength: allProps.maxTagTextLength,
        maxTagCount: allProps.maxTagCount,
        showArrow: true,
        multiple: allProps.multiple,
        treeCheckable: allProps.multiple,
        'onUpdate:value': onSelect,
        notFoundContent: notFoundContent,
        showCheckedStrategy: allProps.showCheckedStrategy,
        treeDefaultExpandAll: (!hasLoadDatasAsync && !showSearch),
        ...(hasLoadDatasAsync ? {loadData: onLoadData} : {})

      }
      const _class = classNames(allProps.class, {[options.uiaxis || 'ui-form-tree-select']: true, ['ui-form']: true})
      const formController = <TreeSelect {...selectProps} v-slots={this.$slots}></TreeSelect>
      const content = this.onlyRenderControl ? (<div class={_class} style="height: 100%"> {formController} </div>) : (<FormItem {...formItemProps} class={_class}>{formController}</FormItem>)
      return this.renderVif(this.renderColWapper(content))
    }
  }

  return defineComponent(_formControl)
 }
 
 export default {name: 'form.tree.select', generate: generate}