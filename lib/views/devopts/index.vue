<template>

  <div>

    <Contaner
      :columnCount="1"
      flex="auto"
    >
      <DsWorker
        class="joyin-ds-worker"
        style="margin: 40px 0px;"
        flex="auto"
      ></DsWorker>
    </Contaner>
    <wk-modal
      v-model:visible="visible"
      @ok="save"
    >
      <wk-form
        :model="state.moduleState"
        ref="moduleForm"
      >
        <Contaner :columnCount="1">
          <wkCodeInput
            v-model:value="state.moduleState.name"
            name="name"
          ></wkCodeInput>
          <wkCodeInputLabel
            v-model:value="state.moduleState.title"
            name="title"
          ></wkCodeInputLabel>
        </Contaner>

      </wk-form>
    </wk-modal>
    <Drawer
      v-model:visible="drawerVisible"
      wrapClassName="ds-main"
      width="500"
      placement="left"
      title="模块列表"
    >
      <MudoleMenuCard />
    </Drawer>
  </div>
</template>
<script>
import components, { stateDefs } from './-index-state-def.jsx'
import DsWorker from './_design/ds-worker.jsx'
import composition from '@lib/api/composition'
import { ref, reactive, toRaw } from 'vue'
import { UIConfig } from '@lib/components/ui'
import { confirm } from '@lib/api/tools/message'
export default {
  mixins: [UIConfig.HOST_MIXIN],
  components: {
    ...components,
    DsWorker
  },
  data() {
    return {
      visible: false,
      drawerVisible: false
    }
  },
  setup() {
    const state = reactive({ ...stateDefs })
    const treeData = ref([])
    const selectedKeys = ref([])
    const checkedKeys = ref([])
    const { http } = composition.useHttp()
    const loadTreeData = async () => {
      const { response } = await http('/mock/design/getDesigns', {}).get()
      treeData.value = response.data
    }

    const updateselectedKeys = (v) => {
      selectedKeys.value = v
    }
    const updateCheckedKeys = (v) => {
      checkedKeys.value = v
    }

    // 加载数据
    loadTreeData()
    return {
      treeData,
      loadTreeData,
      state,
      http,
      updateselectedKeys,
      selectedKeys,
      updateCheckedKeys,
      checkedKeys
    }
  },
  methods: {
    onChageVisible(v) {
      this.visible = v
      this.state.moduleState = {}
    },
    async save() {
      try {
        await this.$refs.moduleForm.$refs.compRef.validate()
        await this.http('/mock/design/save', {
          ...toRaw(this.state.moduleState),
          pid: (this.selectedKeys && this.selectedKeys.length > 0) ? this.selectedKeys[0] : null
        }).post()
        this.loadTreeData()
        this.visible = false
      } catch (e) {
        this.visible = false
      }

    },
    async removeModule() {
      const isOk = await confirm({ content: '该操作不可恢复, 确定要删除吗?' })
      if (isOk) {
        await this.http('/mock/design/remove', {
          id: this.checkedKeys
        }).post()
        this.loadTreeData()
      }
    }
  }
}
</script>

<style>
.ant-card-head-title .ant-tabs-bar {
  border-bottom: 1px solid #fff !important;
  margin: 0 0 8px 0px;
}

.joyin-ds-worker .ds-config-action {
  color: #000;
  margin: 0px 3px 2px 0px;
  height: 30px;
}

.joyin-ds-worker .ds-config-action .ant-btn {
  font-size: 11px !important;
}

.joyin-ds-worker {
  margin: 15px;
  border: 1px dashed #efdede;
  position: relative;
  min-height: 50px;
}

.ds-worker-drawer .ant-drawer-mask {
  background-color: rgba(0, 0, 0, 0) !important;
}
.ds-worker-drawer .ant-drawer-body {
  padding: 10px !important;
}
.ds-worker-drawer {
  z-index: 99999;
}
.ds-worker-drawer .ant-drawer-body,
.ds-main .ant-drawer-body {
  padding: 0px;
}
</style>