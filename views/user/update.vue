<template>
  <div style="padding-top: 100px; padding-left: 100px;">
    <div
      v-show-overflow-tooltip
      style="width: 100px;"
    > <span>aaaaaaaaaaaaaaaaaaa</span> </div>

    <br />
    <div v-show-overflow-tooltip> <span>bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</span> </div>

    <br />

    <Tooltip>
      <span>测试原始的tooltip</span>
      <template #title>
        <span>
          我是标题
        </span>
      </template>
    </Tooltip>

  </div>
</template>

<script>
import { Tooltip } from 'ant-design-vue'
export default {
  data() {
    return {
      name: ''
    }
  },
  components: { Tooltip },
  beforeUnmount() {
    console.log('---beforeUnmount-------------');
  }
}
</script>

<style lang="sass">
</style>