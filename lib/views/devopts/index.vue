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
        :copyMod="copyMod"
        :selectModule="selectModule"
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
import { confirm, warning } from '@lib/api/tools/message'
import { success, error } from '../../api/tools/message.jsx'
import codeGen from './_design/code-gen'

const DEFAULT_PROPS = {
  cmtterDSProtocolStr: JSON.stringify([{ tag: 'div', tagText: '页面', dsKey: 99999999, children: [] }], null, ' ').replace(/"([^\\"]*)":/g, '$1:'),
  cmtterStates: '{}',
  cmtterMethods: '{}'
}

export default {
  mixins: [UIConfig.HOST_MIXIN],
  components: {
    ...components,
    DsWorker
  },
  data() {
    return {
      visible: false,
      drawerVisible: false,
      selectModule: null,
      copyMod: null
    }
  },
  setup() {
    const state = reactive({ ...stateDefs })
    const treeData = ref([])
    const selectedKeys = ref([])
    const checkedKeys = ref([])
    const codeGenLoading = ref(false)
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

    const updateCodeGenLoading = (v) => {
      codeGenLoading.value = v
    }

    // 加载数据
    loadTreeData()
    return {
      updateCodeGenLoading,
      codeGenLoading,
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
    async genCodes() {
      this.updateCodeGenLoading(true)
      try {
        if (this.checkedKeys && this.checkedKeys.length > 0) {
          for (let i = 0; i < this.checkedKeys.length; i++) {
            const k = this.checkedKeys[i];
            if (!k) {
              continue
            }
            const { response } = await this.http('/mock/design/getDesigns?id=' + k).get()
            const data = response.data[0]
            if (data.cmtterDSProtocolStr) {
              const sfc = {
                // 状态
                states: [],
                // 方法
                methods: [],
                // 模板
                templates: []
              }

              // 组件定义
              const defs = {
                // 导出名称
                exports: {},
                // 依赖
                imports: {
                  // 默认引入@lib/components/ui
                  '@lib/components/ui': { defaultNames: 'UI', exportNames: [] }
                },
                // 依赖
                importConsts: [],
                // 定义
                consts: []
              }

              let protcols = ''
              try {
                protcols = new Function(`return ${data.cmtterDSProtocolStr}`)()
              } catch (e) {
                console.log('可视化界面: 协议反序列化错误');
              }
              if (protcols) {
                codeGen(protcols, sfc, defs)
                console.log('--------------------------------');
                console.log('--------------------------------');
                console.log('--------------------------------');
                console.log('--------------------------------');
                const { err } = await this.http('/mock/design/codeGen', {
                  id: k,
                  sfc,
                  defs
                }).post()

                if (err) {
                  throw err
                }
              }
            }
          }
        }
        this.updateCodeGenLoading(false)
        success({ content: '代码生成完成' })
      } catch (err) {
        this.updateCodeGenLoading(false)
        console.log('----------------', err)
        error({ content: '代码生成失败[' + err + ']' })
      }

    },
    //复制
    async copyModule() {
      if (!(this.checkedKeys && this.checkedKeys.length === 1)) {
        warning({ content: '请选择一个模块' })
        return
      }
      const { response } = await this.http('/mock/design/getDesigns?id=' + this.checkedKeys[0], {}).get()
      const data = response.data[0]
      if (!data.cmtterDSProtocolStr) {
        warning({ content: '无法复制, 因为当前模块不存在内容' })
        return
      }
      const isOk = await confirm({ content: '该操作不可逆, 确定该操作吗?' })
      if (!isOk) {
        return
      }

      const p = {
        cmtterDSProtocolStr: data.cmtterDSProtocolStr,
        cmtterStates: (data.cmtterStates || DEFAULT_PROPS.cmtterStates),
        cmtterMethods: (data.cmtterMethods || DEFAULT_PROPS.cmtterMethods)

      }
      this.copyMod = p
    },
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
    },
    // 
    async onSelectTree(keys, selectedNodes) {
      if (!keys || keys.length === 0) {
        return
      }
      const { response } = await this.http('/mock/design/getDesigns?id=' + keys[0], {}).get()
      const data = response.data[0]
      if (!data.PID || (selectedNodes.children && selectedNodes.children.length > 0)) {
        return
      }
      const p = {
        ...data,
        cmtterDSProtocolStr: (data.cmtterDSProtocolStr || DEFAULT_PROPS.cmtterDSProtocolStr),
        cmtterStates: (data.cmtterStates || DEFAULT_PROPS.cmtterStates),
        cmtterMethods: (data.cmtterMethods || DEFAULT_PROPS.cmtterMethods)

      }
      this.selectModule = p
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