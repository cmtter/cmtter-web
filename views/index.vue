<template>
  <el-form
    :model="testFormState"
    ref="form"
  >
    <test-contaner>
      <test-input
        v-model:value="testFormState.cmtter1"
        name="cmtter1"
        ui="testinputui"
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

      <test-form-group
        name="dateRange"
        v-model:m1="testFormState.cmtter11"
        v-model:m2="testFormState.cmtter12"
      ></test-form-group>

      <test-form-input-date-range
        v-model:cmtter11="testFormState.cmtter13"
        v-model:cmtter12="testFormState.cmtter14"
      ></test-form-input-date-range>

      <test-form-input-datetime-range
        v-model:cmtter13="testFormState.cmtter15"
        v-model:cmtter14="testFormState.cmtter16"
      >
      </test-form-input-datetime-range>

      <test-form-input-currency-range
        v-model:cmtter17="testFormState.cmtter17"
        v-model:cmtter18="testFormState.cmtter18"
      >
      </test-form-input-currency-range>

      <test-form-input-number-range
        v-model:cmtter19="testFormState.cmtter19"
        v-model:cmtter20="testFormState.cmtter20"
      >
      </test-form-input-number-range>

      <test-form-input-integer-range
        v-model:cmtter21="testFormState.cmtter21"
        v-model:cmtter22="testFormState.cmtter22"
      >
      </test-form-input-integer-range>

      <test-form-input-percentage-range
        :disabled="true"
        v-model:cmtter23="testFormState.cmtter23"
        v-model:cmtter24="testFormState.cmtter24"
      >
      </test-form-input-percentage-range>

      <test-contaner
        flex="0 0 330px"
        :useEmptyComponent="true"
      >
        <test-datasource
          v-model:value="testFormState.cmtter27"
          dataFieldPath='data.res'
          :params="params"
        >
          <div style="height: 200px;background: #ececec;text-align: center;line-height: 200px;">
            我是一个数据源控件
            <a-button
              @click="params = {}"
              size="small"
            >点击我,刷新数据</a-button>
          </div>
        </test-datasource>

      </test-contaner>
      <test-contaner
        flex="1 1 300px"
        style="padding-top: 40px"
        :useEmptyComponent="true"
      >
        {{testFormState.cmtter27 === null ? '加载中....' : testFormState.cmtter27}}
      </test-contaner>

      <test-contaner
        flex="0 0 330px"
        :useEmptyComponent="true"
      >
        <test-action
          :handler="testActionHander"
          ref="testAction"
        >
          <div style="height: 200px;background: #ececec;text-align: center;line-height: 200px;">
            我是一个操作控件
            <a-button
              @click="$refs.testAction.run()"
              size="small"
            >点击我,测试一下</a-button>
          </div>
        </test-action>
      </test-contaner>

      <testCard></testCard>

    </test-contaner>

    <br /><br />
    <div>
      <a-button
        @click="testHandler"
        size="small"
      >点击我,修改输入框为禁用</a-button>

    </div>
    <br /><br />
    <div> 你输入的值: {{testFormState.cmtter1}}</div>
    <div> 你输入的值: {{testFormState.cmtter2}}</div>
    <div> 你输入的值: {{testFormState.cmtter3}}</div>
    <div> 你输入的值: {{testFormState.cmtter4}}</div>
    <div> 你输入的值: {{testFormState.cmtter5}}</div>
    <div> 你输入的值: {{testFormState.cmtter6}}</div>
    <div> 你输入的值: {{testFormState.cmtter7}}</div>
    <div> 你输入的值: {{testFormState.cmtter8}}</div>
    <div> 你输入的值: {{testFormState.cmtter9}}</div>
    <div> 你输入的值: {{testFormState.cmtter10}}</div>
    <div> 你输入的值: {{testFormState.cmtter11}}</div>
    <div> 你输入的值: {{testFormState.cmtter12}}</div>
    <div> 你输入的值: {{testFormState.cmtter13}}</div>
    <div> 你输入的值: {{testFormState.cmtter14}}</div>
    <div> 你输入的值: {{testFormState.cmtter15}}</div>
    <div> 你输入的值: {{testFormState.cmtter16}}</div>
    <div> 你输入的值: {{testFormState.cmtter17}}</div>
    <div> 你输入的值: {{testFormState.cmtter18}}</div>

    <div> 你输入的值: {{testFormState.cmtter19}}</div>
    <div> 你输入的值: {{testFormState.cmtter20}}</div>
    <div> 你输入的值: {{testFormState.cmtter21}}</div>
    <div> 你输入的值: {{testFormState.cmtter22}}</div>
    <div> 你输入的值: {{testFormState.cmtter23}}</div>
    <div> 你输入的值: {{testFormState.cmtter24}}</div>
    <div> 你输入的值: {{testFormState.cmtter25}}</div>
    <div> 你输入的值: {{testFormState.cmtter26}}</div>
    <div>图标 <JoyinNumberFilled></JoyinNumberFilled>
    </div>

  </el-form>
</template>

<script>
import { UIConfig } from '@lib/components/ui'
import JoyinNumberFilled from '@lib/components/icon/JoyinNumberFilled'
import { reactive } from 'vue'
import { Form, Button } from 'ant-design-vue'
import components, { _testFormState } from './_index-components'
let uuid = 1
export default {
  data() {
    return {
      disabled: true,
      params: {},
      hostVar: '我来自于宿主环境'
    }
  },
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
      //测试利用ui修改testInput属性
      this.applyUI('testinputui', {
        disabled: this.disabled
      })
      this.disabled = !this.disabled
    },
    async testActionHander() {
      console.log('--------------');
      return new Promise((resolve) => {
        setTimeout(resolve, 2000);
      })
    },
    updateHostVar() {
      this.hostVar = this.hostVar + (++uuid)
    }
  }
}
</script>

<style lang="sass">
</style>