import { defineComponent } from 'vue'
import { getOptionProps } from 'ant-design-vue/es/_util/props-util'
import { ConfigProvider } from 'ant-design-vue'
import locale from 'ant-design-vue/es/locale/zh_CN'
import {RouterView} from 'vue-router'

export default defineComponent({
  name: 'app',
  render(){
    const props = { ...getOptionProps(this), ...this.$attrs };
    return (
      <ConfigProvider locale={locale}>
        <div class="joyin-app" {...props}>
          <RouterView></RouterView>
        </div>
      </ConfigProvider>
    )
  }
})