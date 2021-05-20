<template>
  <!--按钮 -->
  <div class="online-preview">
    <div style="width: 95%; text-align: right; padding: 5px 0px;">
      <a-button
        type="primary"
        style="margin-right: 8px;"
      > 运行</a-button>
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
          <div>
            代码区域
          </div>
        </div>
        <multipane-resizer style="left:0px;background: #fff;"></multipane-resizer>
        <div
          class="pane"
          :style="{ flexGrow: 1 }"
        >
          预览区域
        </div>
      </multipane>
    </div>
  </div>
</template>

<script>
/**
 * 参考 https://github.com/yansern/vue-multipane
 */
// import vueCodemirror from './components/vue-codemirror'
import { Multipane, MultipaneResizer } from "vue-multipane/src/index";
import { Button as AButton } from 'ant-design-vue'
export default {
  components: {
    //vueCodemirror,
    Multipane,
    MultipaneResizer,
    AButton
  }
}
</script>

<style>
.vertical-panes {
  width: 90%;
  height: 650px;
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
</style>