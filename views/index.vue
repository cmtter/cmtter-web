<template>
  <el-form
    :model="testFormState"
    ref="form"
  >
    <test-contaner>
      <test-input
        v-model:value="testFormState.cmtter1"
        name="cmtter1"
      ></test-input>
    </test-contaner>

    <div> 你输入的值: {{testFormState.cmtter1}}

    </div>
    <div>
      <a-button
        @click="testHandler"
        size="small"
      >提交</a-button>

    </div>
  </el-form>
</template>

<script>
import { UIConfig } from '@lib/components/ui'
import { reactive } from 'vue'
import { Form, Button } from 'ant-design-vue'
import components, { _testFormState } from './_index-components'
export default {
  components: {
    elForm: Form,
    ...components,
    aButton: Button
  },
  mixins: [UIConfig.HOST_MIXIN],
  setup() {
    const testFormState = reactive({ ..._testFormState })
    return {
      testFormState
    }
  },
  methods: {
    testHandler() {
      console.log(this.$refs.form);
    }
  }
}
</script>

<style lang="sass">
</style>