import { defineComponent } from 'vue'
import AntdIcon from '@ant-design/icons-vue/es/components/AntdIcon'
import JoyinNumberFilled from './asn/JoyinNumberFilled'
export default defineComponent((props, context) => {
  const p = { ...props, ...context.attrs};
  return () => <AntdIcon {...p} icon={JoyinNumberFilled}></AntdIcon>;
})