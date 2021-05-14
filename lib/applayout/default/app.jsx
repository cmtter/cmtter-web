import { defineComponent } from 'vue'
import { getOptionProps } from 'ant-design-vue/es/_util/props-util'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'app',
  render(){
    const props = { ...getOptionProps(this), ...this.$attrs };
    return (
      <div class="joyin-app" {...props}>
        <RouterView></RouterView>
      </div>
    )
  }
})