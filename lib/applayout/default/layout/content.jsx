import { defineComponent, getCurrentInstance,provide } from 'vue'
import VueTypes from 'vue-types'
import { Layout } from 'ant-design-vue'
import useState from '../../../api/composition/use-state'
import useStore from '../../../api/composition/use-store'
import { getOptionProps } from 'ant-design-vue/es/_util/props-util'
import { MAIN_LAYOUT_CONTENT } from '../../../api/global-symbol'

const ALayoutContent = Layout.Content

const contentProps = {
  logo: VueTypes.string,
  title: VueTypes.string
};

export default defineComponent({
  name: 'main-layout-content',
  inheritAttrs: false,
  props: {
    ...contentProps
  },

  setup() {
    const layoutState = useState('layout')
    const store = useStore()
    const instance = getCurrentInstance()
    provide(MAIN_LAYOUT_CONTENT, () => instance)
    return {
      layoutState,
      store
    };
  },
  methods: {
   
  },
  render() {
    const props = { ...getOptionProps(this), ...this.$attrs };
    return <ALayoutContent {...props} v-slots={this.$slots} style={{background: '#fff'}}></ALayoutContent>
  }
})