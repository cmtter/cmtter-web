import { createApp, createVNode } from 'vue';
import router from './router';
import 'ant-design-vue/dist/antd.css';
import App from '<%= defaultConfig.applayoutPath%>';
import Store from '@lib/api/store';
import directives from '@lib/components/directives';
import "normalize.css/normalize.css";
import '@lib/assets/css/root.scss';
import 'ant-design-vue/dist/antd.css';
<%= defaultConfig.importAppConfigJsx %>

const app = createApp(App);
app.use(Store);
app.use(router);
app.use(directives);
<%= defaultConfig.insallAppConfig %>

  //挂载
  //
  app.mount('#app');
if (process.env.NODE_ENV !== 'production') {
  //帮助文档中的动态vue加载 需要用到Window.Vue
  window.Vue = window.Vue || {
    createApp,
    createVNode
  }
}
