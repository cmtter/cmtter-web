<template>
  <!--按钮 -->
  <div class="online-preview">
    <div style="width: 95%; text-align: right; padding: 5px 0px;">
      <a-button
        type="primary"
        style="margin-right: 8px;"
        @click="compilerCode"
        :loading="compilerLoading"
      > {{ compilerLoading ? '正在编译....' : '运行' }}</a-button>
      <a-button>保存</a-button>
    </div>
    <div style="height: 100%;display: flex;justify-content: center;">
      <multipane
        class="vertical-panes"
        layout="vertical"
      >
        <!-- 代码 -->
        <div
          class="pane"
          :style="{ minWidth: '10%', width: '40%', maxWidth: '95%' }"
        >
          <vue-codemirror
            v-model:code="code"
            ref="codemirror"
          ></vue-codemirror>
        </div>
        <multipane-resizer style="left:0px;background: #fff;"></multipane-resizer>
        <div
          class="pane"
          :style="{ flexGrow: 1 }"
        >
          <iframe
            v-if="previewUrl"
            style="width: 100%; height: 100%;"
            :src="previewUrl"
          ></iframe>
        </div>
      </multipane>
    </div>
  </div>
</template>

<script>
/**
 * 参考 https://github.com/yansern/vue-multipane
 */
import { ref, getCurrentInstance } from 'vue';
import vueCodemirror from './components/vue-codemirror'
import Multipane from "vue-multipane/src/multipane.vue";
import MultipaneResizer from "vue-multipane/src/multipane-resizer";
import { Button as AButton } from 'ant-design-vue'
import composition from '@lib/api/composition'
import { error } from '@lib/api/tools/message'

export default {
  components: {
    vueCodemirror,
    Multipane,
    MultipaneResizer,
    AButton
  },
  setup() {
    // 定义状态
    const code = ref('')
    const previewUrl = ref(null)
    const compilerLoading = ref(false)
    const instance = getCurrentInstance()

    const { http } = composition.useHttp()
    //编译代码
    const compilerCode = async () => {
      if (compilerLoading.value) {
        return
      }
      compilerLoading.value = true
      const _sfcCode = instance.ctx.$refs.codemirror.codemirror.getValue()
      const resp = await http('/mock/sfc/compiler', { code: _sfcCode }).post()
      if (resp.response && resp.response.isOk === true) {
        previewUrl.value = '/sfcpreview/demo.html?file=' + resp.response.file
      } else {
        error({ content: '失败: 检测是语法是否错误!!!' })
      }
      compilerLoading.value = false
    }

    return {
      code,
      compilerCode,
      previewUrl,
      compilerLoading
    }
  }
}
</script>

<style>
.vertical-panes {
  width: 90%;
  height: 600px;
  border: 1px solid #ccc;
}

.vertical-panes > .pane {
  text-align: left;
  padding: 15px;
  overflow: hidden;
  background: #eee;
}

.vertical-panes > .pane ~ .pane {
  border-left: 1px solid #ccc;
}

.online-preview .multipane-resizer:before {
  display: block;
  content: '';
  width: 3px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -20px;
  margin-left: -1.5px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
}

.online-preview .multipane-resizer:hover:before {
  border-color: rgb(202, 51, 51);
}
</style>