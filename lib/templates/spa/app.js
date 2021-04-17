import { createApp } from 'vue'
import router from './router'
import 'ant-design-vue/dist/antd.css';
import App from '<%= defaultConfig.applayoutPath%>'
import Store from '@lib/api/store'
import "normalize.css/normalize.css"
import '@lib/assets/css/root.scss';
import 'ant-design-vue/dist/antd.css'
const app = createApp(App)
app.use(Store)
app.use(router)
app.mount('#app')