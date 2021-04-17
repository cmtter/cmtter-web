import { createRouter, createWebHistory } from 'vue-router'
import tabAfterEach from '@lib/components/router/tab-after-each'
import dyncImport from '<%= defaultConfig.dyncImportPath %>'

const routes = <%= defaultConfig.routes %>

export default tabAfterEach(
  createRouter({
    history: createWebHistory(),
    routes
  }))
