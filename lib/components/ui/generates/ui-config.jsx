import { PolySymbol } from '../../../api/global-symbol'
import  DefineRules from '../rules'
import {createUnitConver} from '../unit'
import {Col } from 'ant-design-vue'
import VueTypes from  'vue-types'
import { provide, inject } from 'vue'
import '../_style/index.scss'

const Conifg = {
  // 宿主容器provide
  UI_HOST_PARENT_CONTEXT_SYMBOL: PolySymbol('UI_HOST_PARENT_CONTEXT'),
  // 宿主容器Mixin
  HOST_MIXIN: {
    created() {
      this.$uis = {}
      provide(Conifg.UI_HOST_PARENT_CONTEXT_SYMBOL, this);
    },
    methods: {
      // 更新组件样式
      applyUI(ui, options) {
        const $uis = this.$uis
        if ($uis[ui]) {
          //更新组件
          $uis[ui].updateDyncProps(options)
        }
      },
      /**
       * 注册组件
       * @param {*} ui  组件实例名称
       * @param {*} instance  组件实例
       */
      registerUI(ui, instance) {
        const $uis = this.$uis
        if ($uis[ui]) {
          throw new Error(`错误!!, ui["${ui}"]名称存在重复`)
        }
        $uis[ui] = instance
      },
  
      removeUI(ui) {
        const $uis = this.$uis
        $uis[ui] = null
        delete $uis[ui]
      }
    }
  },
  // 布局容器provide
  UI_CONTANER_SYMBOL: PolySymbol('UI_CONTANER'),

  // 表单校验规则
  DefineRules: DefineRules,

  //单位
  units: {
    '万元':  {...createUnitConver(10000, 6, {suffix: '万元'})},
    '%':  {...createUnitConver(0.01, 6, {suffix: '%'})}
  },
  // ui mixins
  UI_MIXINS: () => ({
    props:{
      //偏移单位
      offset:VueTypes.integer.def(0),
      //flex 宽度定位
      flex: VueTypes.string,
      // col
      col: VueTypes.number,
      // ui 定义ui唯一名称
      ui: VueTypes.string,
      vif: VueTypes.bool.def(true),
      //是否忽略布局
      ignoreLayout: VueTypes.bool.def(false),
      //仅显示
      onlyRenderControl: VueTypes.bool.def(false)
    },
    created(){
      this.hostComp = inject(Conifg.UI_HOST_PARENT_CONTEXT_SYMBOL)
      this.parentContaner = inject(Conifg.UI_CONTANER_SYMBOL, null)
      if (this.hostComp && this.hostComp.registerUI && this.ui){
        this.hostComp.registerUI(this.ui, this)
      }
    },

    methods: {
      renderVif(children){
        if (this.vif === false){
          return null
        }
        return children
      },
      renderColWapper(children){
        if(this.ignoreLayout === true){
          return children
        }
        if (this.parentContaner && (this.parentContaner.columnCount || this.offset || this.flex || this.col)){
          const { flex, offset } = this
          const columnCount = this.parentContaner.columnCount
          let colProps = null
          // flex优先级最高
          if (flex){
            colProps = {offset, flex}
          }
          if (!colProps){
            const col = (this.col) ? this.col : ((columnCount) ? (24 / columnCount) : null)
            colProps = {
              offset,
              ...(col ? {span: col} : {})
            }
          }
          return (<Col {...colProps}>{children}</Col>)
        }
        return children
      },
    },
    beforeUnmount(){
      if (this.hostComp && this.hostComp.registerUI && this.ui){
        this.hostComp.removeUI(this.ui)
      }
    }

  })

}
export default Conifg 