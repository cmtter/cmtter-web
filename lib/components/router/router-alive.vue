<template>
  <div class="joyin-router-alive">
    <router-view v-slot="{ Component }">
      <router-alive-ext :include="keepAliveInclude">
        <component
          :is="Component"
          :key="pkey"
        />
      </router-alive-ext>
    </router-view>
  </div>
</template>

<script>
import VueTypes from 'vue-types'
import useTabs from '@lib/api/composition/use-tabs'
import RouterAliveExt from '../vue/router-alive-ext'
import { computed } from 'vue'
/**
 * router-alive
 */
export default {
  props: {
    pkey: VueTypes.string.isRequired
  },
  components: {
    'router-alive-ext': RouterAliveExt
  },
  setup() {
    const { tabs } = useTabs()
    const keepAliveInclude = computed(() => {
      return tabs.value.map(r => r.uuid)
    })
    return {
      keepAliveInclude
    }
  },
  created() {

  },
  updated() {

  }
}
</script>

<style lang="sass">
.joyin-router-alive
  height: 100%
</style>