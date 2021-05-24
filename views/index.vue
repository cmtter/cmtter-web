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

      <test-input-phone
        v-model:value="testFormState.cmtter2"
        name="cmtter2"
      ></test-input-phone>

      <test-input-email
        v-model:value="testFormState.cmtter3"
        name="cmtter3"
      ></test-input-email>

      <test-input-number
        v-model:value="testFormState.cmtter4"
        name="cmtter4"
      ></test-input-number>

      <test-input-integer
        v-model:value="testFormState.cmtter5"
        name="cmtter5"
      ></test-input-integer>

      <test-input-currency
        v-model:value="testFormState.cmtter6"
        name="cmtter6"
      ></test-input-currency>

      <test-input-currency-wanyuan
        v-model:value="testFormState.cmtter7"
        name="cmtter7"
      ></test-input-currency-wanyuan>

      <test-input-percentage
        v-model:value="testFormState.cmtter8"
        name="cmtter8"
      ></test-input-percentage>

      <test-input-date
        v-model:value="testFormState.cmtter9"
        name="cmtter9"
      ></test-input-date>
      <test-input-datetime
        v-model:value="testFormState.cmtter10"
        name="cmtter10"
      ></test-input-datetime>
    </test-contaner>
    <br /><br /><br /><br />
    <div> 你输入的值: {{testFormState.cmtter10}}

    </div>
    <div>图标 <JoyinNumberFilled></JoyinNumberFilled>
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
import JoyinNumberFilled from '@lib/components/icon/JoyinNumberFilled'
import { reactive } from 'vue'
import { Form, Button } from 'ant-design-vue'

import components, { _testFormState } from './_index-components'
export default {
  components: {
    elForm: Form,
    ...components,
    aButton: Button,
    JoyinNumberFilled
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
      console.log(this.$refs.form, this.testFormState.cmtter7);
    }
  }
}
</script>

<style lang="sass">
</style>