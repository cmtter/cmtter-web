<template>
  <div>
    <wkContaner>
      <helpMenus
        flex="0 0 180px"
        @click="updateHep"
      ></helpMenus>
      <div style="flex: 1 1 auto;flex: 1 1 auto;background: #fbf9f9;">
        <component :is="vcomp"></component>
      </div>
    </wkContaner>

  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { UIConfig } from '@lib/components/ui'
import components from './-helper-component'
import docComponents from './'
export default {
  mixins: [UIConfig.HOST_MIXIN],
  components: {
    ...components,
    ...docComponents
  },
  setup() {
    const hep = ref('start')

    const updateHep = ({ key }) => {
      if (!key) {
        return
      }
      hep.value = key
    }
    const vcomp = computed(() => 'helper-' + hep.value)
    return {
      updateHep,
      vcomp
    }
  }
}
</script>

<style>
</style>