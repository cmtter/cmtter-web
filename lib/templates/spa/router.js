import { createRouter, createWebHistory } from 'vue-router'
import tabAfterEach from '@lib/components/router/tab-after-each'
import dyncImport from '<%= defaultConfig.dyncImportPath %>'
<%= defaultConfig.importAppConfigJsx %>

const routes = <%= defaultConfig.routes %>

  let router = ((window || {})._jrouter_ = createRouter({
    history: createWebHistory(),
    routes
  }));

  <%=defaultConfig.appjsxBeforeEach %>

export default tabAfterEach(router)
