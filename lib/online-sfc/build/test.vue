<template>
  <a-form
    :model="formState"
    ref="form"
    style="padding: 50px;"
  >
    <a-form-item
      label="账户"
      name="uname"
    >
      <a-input v-model:value="formState.uname" />
    </a-form-item>
    <a-form-item
      label="密码"
      name="password"
    >
      <a-input v-model:value="formState.password" />
    </a-form-item>
    <a-form-item>
      <a-button
        type="primary"
        @click="showAlert"
      >
        提交
      </a-button>
    </a-form-item>
  </a-form>
</template>
<script>
/**
  注释:
  
  **/
import { Button as AButton, input as AInput, Form as AForm } from 'ant-design-vue'
import { reactive } from 'vue'
const AFormItem = AForm.Item
export default {
  components: {
    AButton,
    AInput,
    AForm,
    AFormItem
  },
  setup() {
    const formState = reactive({ uname: null, password: null })
    return {
      formState
    }
  },
  methods: {
    showAlert() {
      alert('click')
    }
  }
}
</script>

<style>
</style>



