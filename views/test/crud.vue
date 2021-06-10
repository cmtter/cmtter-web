<template>
  <wk-page>
    <wk-card
      size="small"
      title="用户查询"
    >
      <wk-form
        :model="searchForm"
        ref="searchFormRef"
      >

        <wk-contaner>
          <!-- 用户角色 -->
          <wk-seach-user-role-form-contrl
            v-model:value="searchForm.value1"
            name="value1"
          ></wk-seach-user-role-form-contrl>
          <!-- 用户名称 -->
          <wk-seach-user-name-form-contrl
            v-model:value="searchForm.value2"
            name="value2"
          ></wk-seach-user-name-form-contrl>
          <!-- 用户岗位 -->
          <wk-seach-user-gw-form-contrl
            v-model:value="searchForm.value3"
            name="value3"
          ></wk-seach-user-gw-form-contrl>
          <!-- 用户年龄 -->
          <wk-seach-user-age-form-contrl
            v-model:value="searchForm.value4"
            name="value4"
          ></wk-seach-user-age-form-contrl>
        </wk-contaner>
        <wk-collapse
          v-model:activeKey="showMore"
          class="user-test-search"
        >
          <wk-collapse-panel
            key='more'
            :showArrow="false"
            :forceRender="false"
          >
            <wk-contaner>
              <!-- 用户角色 -->
              <wk-seach-user-role-form-contrl
                v-model:value="searchForm.value5"
                name="value5"
              ></wk-seach-user-role-form-contrl>
              <!-- 用户名称 -->
              <wk-seach-user-name-form-contrl
                v-model:value="searchForm.value6"
                name="value6"
              ></wk-seach-user-name-form-contrl>
              <!-- 用户岗位 -->
              <wk-seach-user-gw-form-contrl
                v-model:value="searchForm.value7"
                name="value7"
              ></wk-seach-user-gw-form-contrl>
              <!-- 用户年龄 -->
              <wk-seach-user-age-form-contrl
                v-model:value="searchForm.value8"
                name="value8"
              ></wk-seach-user-age-form-contrl>

              <!-- 用户角色 -->
              <wk-seach-user-role-form-contrl
                v-model:value="searchForm.value9"
                name="value9"
              ></wk-seach-user-role-form-contrl>
              <!-- 用户名称 -->
              <wk-seach-user-name-form-contrl
                v-model:value="searchForm.value10"
                name="value10"
              ></wk-seach-user-name-form-contrl>
              <!-- 用户岗位 -->
              <wk-seach-user-gw-form-contrl
                v-model:value="searchForm.value11"
                name="value11"
              ></wk-seach-user-gw-form-contrl>
              <!-- 用户年龄 -->
              <wk-seach-user-age-form-contrl
                v-model:value="searchForm.value12"
                name="value12"
              ></wk-seach-user-age-form-contrl>
            </wk-contaner>
          </wk-collapse-panel>
        </wk-collapse>
      </wk-form>

      <template #extra>
        <a
          href="#"
          @click="showMore = showMore ? null : ['more']"
        >更多</a>
      </template>
    </wk-card>

    <wk-card
      size="small"
      title="用户列表"
    >
      <template #extra>
        <wk-contaner>
          <wk-toolbar @action="onAction"></wk-toolbar>
        </wk-contaner>
      </template>
      <wk-table
        size="small"
        :rowSelection="{}"
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 1000, y: 1000}"
      >
        <template #action>
          <a>删除</a> | <a>添加</a>
        </template>
      </wk-table>
    </wk-card>

  </wk-page>
</template>

<script>
import { UIConfig } from '@lib/components/ui'
import { reactive } from 'vue'
import { Form, Card, Collapse, Table } from 'ant-design-vue'
import components, { searchFormState } from './-crud-components'
const CollapsePanel = Collapse.Panel
export default {
  data() {
    return {
      showMore: null,
      data: [
        { id: '1', a1: '王秀夫', a2: 'xiufu.wang', a3: '33', a4: '前端开发', a5: '大专学历', a6: '11', a7: '前端工程师' },
        { id: '2', a1: '王秀夫', a2: 'xiufu.wang', a3: '33', a4: '前端开发', a5: '大专学历', a6: '11', a7: '前端工程师' },
        { id: '3', a1: '王秀夫', a2: 'xiufu.wang', a3: '33', a4: '前端开发', a5: '大专学历', a6: '11', a7: '前端工程师' },
        { id: '4', a1: '王秀夫', a2: 'xiufu.wang', a3: '33', a4: '前端开发', a5: '大专学历', a6: '11', a7: '前端工程师' },
        { id: '5', a1: '王秀夫', a2: 'xiufu.wang', a3: '33', a4: '前端开发', a5: '大专学历', a6: '11', a7: '前端工程师' },
        { id: '6', a1: '王秀夫', a2: 'xiufu.wang', a3: '33', a4: '前端开发', a5: '大专学历', a6: '11', a7: '前端工程师' },
        { id: '7', a1: '王秀夫', a2: 'xiufu.wang', a3: '33', a4: '前端开发', a5: '大专学历', a6: '11', a7: '前端工程师' },
        { id: '8', a1: '王秀夫', a2: 'xiufu.wang', a3: '33', a4: '前端开发', a5: '大专学历', a6: '11', a7: '前端工程师' },
        { id: '9', a1: '王秀夫', a2: 'xiufu.wang', a3: '33', a4: '前端开发', a5: '大专学历', a6: '11', a7: '前端工程师' },
        { id: '10', a1: '王秀夫', a2: 'xiufu.wang', a3: '33', a4: '前端开发', a5: '大专学历', a6: '11', a7: '前端工程师' }
      ],
      columns: [
        { title: '用户名', width: 100, dataIndex: 'a1', key: 'name', fixed: 'left' },
        { title: '账户', width: 100, dataIndex: 'a2', key: 'age', fixed: 'left' },
        { title: '年龄', dataIndex: 'a3', key: '1', },
        { title: '岗位', dataIndex: 'a4', key: '2', },
        { title: '学历', dataIndex: 'a5', key: '3', },
        { title: '年限', dataIndex: 'a6', key: '7', },
        { title: '备注', dataIndex: 'a7', key: '8' },
        {
          title: '操作',
          key: 'operation',
          fixed: 'right',
          width: 100,
          slots: { customRender: 'action' },
        },
      ]
    }
  },
  components: {
    WkForm: Form,
    WkCard: Card,
    WkCollapse: Collapse,
    WkTable: Table,
    WkCollapsePanel: CollapsePanel,
    ...components
  },
  mixins: [UIConfig.HOST_MIXIN],
  setup() {
    const searchForm = reactive(searchFormState)
    return {
      searchForm
    }
  },
  methods: {

    onAction(action) {
      this[action]()

    },
    async search() {
      // const data = this.searchForm
      // const { response } = await http('/api/searcn', data).post()
      // this.data = response

    }

  }
}
</script>

<style lang="scss">
.user-test-search {
  .ant-collapse-header {
    display: none;
  }
  &.ant-collapse {
    border: 0px solid #d9d9d9 !important;
    & > .ant-collapse-item {
      border-bottom: 0px solid #d9d9d9;
    }
  }
  .ant-collapse-content {
    border: 0px;
    border-top: 0px;
    .ant-collapse-content-box {
      padding: 0px;
    }
  }
}
</style>