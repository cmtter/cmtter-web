import { defineComponent, shallowRef, toRaw, ref, watch, computed } from 'vue'
import { defalutProps } from '../utils'
import VueTypes from  'vue-types'
import UIConfig from './ui-config'
import omit from 'omit.js';
import { getOptionProps} from 'ant-design-vue/es/_util/props-util'
import classNames from 'ant-design-vue/es/_util/classNames'
import { Table } from 'ant-design-vue'

function generate(options){
  const uimixins = UIConfig.UI_MIXINS()
  options = options || {}
  const props = {
    size: VueTypes.oneOf(['large', 'small']).def('small'),
    /**
     * 列配置自定为每一个列生成slot
     */
    columns:VueTypes.array,
    /**
     * 数据中包括total、pageSize 会自动启用分页
     */
     datasource: VueTypes.oneOfType([VueTypes.object, VueTypes.array]),

    slots: VueTypes.object.def({}),
    loading: VueTypes.bool.def(false),
    ...(uimixins.props),
  }

  const _Table = {
    mixins: [uimixins],
    props: {
      ...defalutProps(props, options)
    },
    setup(props){
      const dyncProps = shallowRef({})
      const dataSourceCfg = shallowRef(null)
      const columnsCfg = ref([])
      const paginationCfg = ref({})

      //处理列
      const _resolveColumns = () => {
        const columns = dyncProps.value.columns || props.columns || []
        columnsCfg.value = columns.map(r => {
          //slots: { customRender: 'name' },
          const slots = r.slots || {}
          if (!r.customRender &&  !slots.customRender){
            slots.customRender = r.dataIndex + 'CellSlot'
          }
          if (!r.title && !slots.title){
            slots.title = r.dataIndex + 'HeaderSlot'
          }
          r.slots = slots
          if (r.ellipsis !== false){
            r.ellipsis = true
          }
          return r
        })
      }

      // 处理分页
      const _resolvePagination = ()=> {
        const dataSource = dataSourceCfg.value || []
        if (Array.isArray(dataSource)){
          paginationCfg.value = {pagination: false}
        } else {
          const {total = 0, pageSize = 10, current = 1 } = dataSource
          paginationCfg.value = {
            pagination: {
              position: 'bottom',
              total,
              pageSize,
              current
            }
          }
        }
      }

      //加载数据
      const resolveDataSource = async () => {
        dataSourceCfg.value = props.datasource || []
        _resolvePagination()
      }

      const updateDyncProps = (newProps = {}) => {
        dyncProps.value = {
          ...(toRaw(dyncProps.value)),
          ...newProps
        }
      }
     
      resolveDataSource()
      _resolveColumns()

      // 配置变化的时候
      const dataSourceChange = computed(()=> props.dataSource)
      watch(dataSourceChange, ()=>{
        resolveDataSource()
      })

      //列配置变化
      const columnsChange = computed(()=> props.datasource)
      watch(columnsChange, ()=>{
        _resolveColumns()
      })

      return {
        dyncProps,
        updateDyncProps,
        dataSourceCfg,
        columnsCfg,
        paginationCfg
      }
    },
    methods: {
      // sormPaarms
      onChange(pagination, filters, sorter, { currentDataSource}){
        this.$emit('change', pagination, filters, sorter, { currentDataSource})
      }
    },
    render(){
      let allProps =  { ...getOptionProps(this), ...this.$attrs, ...this.dyncProps };
      let slotsOptions = allProps.slots || {}
      const { dataSourceCfg, columnsCfg, paginationCfg, hostComp } = this

      const tableProps = {
          ...(omit(allProps, ['slots'])),
          columns: columnsCfg,
          ...paginationCfg,
          ...(dataSourceCfg && dataSourceCfg.datas ? {dataSource: dataSourceCfg.datas} : {dataSource: dataSourceCfg}),
          onChange: this.onChange,
          bordered:true
      }

      //绑定插槽作用域
      const _slotsOptions = Object.keys(slotsOptions).reduce((s, slotName) => {
        if (slotsOptions[slotName] && typeof slotsOptions[slotName] === 'function'){
          s[slotName] = function(...args){
            return slotsOptions[slotName](hostComp, ...args)
          }
        }
        return s
      }, {})

      const _slots = {
        ...(_slotsOptions),
        ...(this.$slots)
      }
      
      const content = (<Table {...tableProps} class={classNames(allProps.class, {'ui-datatable': true})} v-slots={_slots}>
      </Table>)
      return this.renderVif(this.renderColWapper(content))
     }
  }

  return defineComponent(_Table)
}

export default {name: 'datatable', generate: generate}

/**
 * 行分组数据处理------------------------------------------------
 * 1.数据要求: 每一级数据字段不能有交集
 *
  const tree = [
  {
    a: 'a1',
    a2: 'a2',
    children: [
      { a21: 'a21-1', a22: 'a22-1' },
      { a21: 'a21-2', a22: 'a22-2' },
      {
        a21: 'a21-3',
        a22: 'a22-3',
        children: [
          { a211: 'a211-1', a212: 'a212-1' },
          { a211: 'a211-2', a212: 'a212-2' },
          { a211: 'a211-3', a212: 'a212-3' }
        ]
      },
      { a21: 'a21-4', a22: 'a22-4' }
    ]
  }
]
 * 
 */
 function computerAllChildrenCount(datas) {
  let count = datas.length
  for (let i = 0; i < datas.length; i++) {
    if (datas[i].children && datas[i].children.length > 0) {
      count = count + computerAllChildrenCount(datas[i].children) - 1
    }
  }
  return count
}

 function workTree(datas, parent, cache, level) {
  //收集所有的field
  const $keys = cache.$keys || (cache.$keys = {})
  for (let i = 0; i < datas.length; i++) {
    const d = datas[i]
    d.parent = parent
    d.rowSpanF = {}
    //处理叶子节点
    if (!d.children || d.children.length === 0) {
      cache.push(d)
      //为叶子节点合并所有父节点的属性
      let a = d.parent
      const ckeys = Object.keys(d)
      let pindex = 2
      let stopTag = false
      while (a) {
        Object.keys(a).forEach(r => {
          if (r !== 'parent' && r !== 'children' && r !== 'rowSpanF') {
            d[r] = a[r]
            if (!$keys[r]) {
              $keys[r] = true
            }
            d.rowSpanF[r] = (level[level.length - pindex] == 0 && i === 0 && stopTag === false) ? computerAllChildrenCount(a.children) : 0
          }
        })
        if (level[level.length - 1] > 0) {
          stopTag = true
        }
        pindex++
        a = a.parent
      }

      ckeys.forEach(r => {
        if (r !== 'parent' && r !== 'children' && r !== 'rowSpanF') {
          d.rowSpanF[r] = 1
          if (!$keys[r]) {
            $keys[r] = true
          }
        }
      })
    }

    if (d.children && d.children.length > 0) {
      workTree(d.children, d, cache, [...level, i])
    }
  }
}
let uuud = 1
function resolveRowGroupData(treeDatas){
  const cache = []
  workTree(treeDatas, null, cache, [0])
  const $keys = Object.keys(cache.$keys)
  return cache.map(r => {
    const res = {
      rowSpanF: r.rowSpanF,
      key: (r['key'] || (uuud++))
    }
    $keys.forEach(r1 => {
      res[r1] = r[r1] || null
    })
    return res
  });
}

export {
  resolveRowGroupData
}