
import { provide } from 'vue';
import { PolySymbol } from '../../api/global-symbol'

export const UI_HOST_PARENT_CONTEXT_SYMBOL = PolySymbol('UI_HOST_PARENT_CONTEXT')

export default {
  created() {
    this.$uis = {}
    provide(UI_HOST_PARENT_CONTEXT_SYMBOL, this);
  },
  methods: {
    // 更新组件样式
    applyUI(ui, options) {
      const $uis = this.$uis
      if ($uis[ui]) {
        //更新组件
        $uis[ui].options = options
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
}