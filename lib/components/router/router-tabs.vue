<template>
  <div class="joyin-router-tabs">
    <div class="joyin-router-headers">
      <a-affix
        :offset-top="0"
        :target="targetRef"
      >
        <a-tabs
          v-model:activeKey="activeTabKey"
          hide-add
          type="editable-card"
          size="small"
          @edit="removeTab"
        >
          <a-tab-pane
            v-for="tab in tabs"
            :key="tab.uuid"
            :closable="tab.toMeta.closable && tabs.length > 1"
          >
            <template #tab>
              <span style="margin-right: 5px;">
                {{tab.title}}
                <RedoOutlined
                  class="refresh ant-tabs-close-x"
                  v-if="curTab && curTab.uuid === tab.uuid"
                  @click="refreshTab"
                />
              </span>
            </template>
          </a-tab-pane>
        </a-tabs>
      </a-affix>
    </div>

    <div class="joyin-router-container">
      <joyin-router-alive :pkey="curTab.uuid"></joyin-router-alive>
      <iframe
        v-for="url in iframes"
        v-show="url === currentIframe"
        :key="url"
        :src="url"
        :name="url"
        frameborder="0"
        class="joyin-router-tab__iframe"
      />
    </div>
  </div>
</template>

<script>
import { provide, inject, getCurrentInstance } from 'vue'
import { Tabs, Affix } from 'ant-design-vue'
import { RedoOutlined } from '@ant-design/icons-vue'
import JoyinRouterAlive from './router-alive'
import * as message from '../../api/tools/message'
import useIframe from './composition/use-iframe'
import { ROUTER_TABS_SYMBOL, MAIN_LAYOUT_CONTENT } from '../../api/global-symbol'

import useTabs from '@lib/api/composition/use-tabs'
export default {
  data() {
    return {
      targetRef: null,
      currentRouteComp: null
    }
  },
  provide() {
    return {
      ROUTER_TABS_SYMBOL: this
    }
  },
  setup() {
    const instance = getCurrentInstance()
    provide(ROUTER_TABS_SYMBOL, instance)
    const iframes = useIframe()
    const tabs = useTabs()
    const mainLayoutContentInstance = inject(MAIN_LAYOUT_CONTENT, {})

    //删除tab
    const removeTab = async uuid => {
      const res = await message.confirm({ content: '确定删除吗？' })
      if (res) {
        tabs.deleteTab(uuid)
      }
    }

    // 刷新tab
    const refreshTab = async uuid => {
      const res = await message.confirm({ content: '确定刷新吗？' })
      if (res && instance.ctx && instance.ctx.currentRouteComp) {
        instance.ctx.currentRouteComp.refresh(uuid)
      }
    }

    return {
      ...iframes,
      ...tabs,
      mainLayoutContentInstance,
      removeTab,
      refreshTab
    }
  },

  components: {
    [Tabs.name]: Tabs,
    [Affix.name]: Affix,
    [Tabs.TabPane.name]: Tabs.TabPane,
    'joyin-router-alive': JoyinRouterAlive,
    RedoOutlined

  },

  created() {

  },
  mounted() {
    const mainContentCmp = this.mainLayoutContentInstance()
    this.targetRef = () => mainContentCmp.vnode.el
  },
  methods: {
    setRouterComp(cmp) {
      this.currentRouteComp = cmp
    }
  }
}
</script>

<style lang="scss">
.joyin-router-tabs {
  display: flex;
  flex-direction: column;
  min-height: 95%;
  box-sizing: border-box;

  .joyin-router-headers {
    padding: 0 10px 1px 10px;
    .ant-tabs-nav .ant-tabs-tab-active {
      font-weight: 700;
    }
    .ant-affix > .ant-tabs-card {
      background: #fff;
    }
    .ant-tabs-bar {
      margin: 0px;
    }
  }

  .joyin-router-container {
    flex: 1 1 auto;
    padding: 10px;
    background-color: rgba(250, 250, 250, 1);
  }
}
</style>