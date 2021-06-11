<template>
  <el-form
    :model="testFormState"
    ref="form"
  >
    <div style="background: gainsboro;padding: 10px 10px; margin: 10px 0px;">1. 表格</div>
    <br />
    <test-contaner>
      <test-table
        @change="handleTableChange"
        :datasource="dataSource"
        :row-selection="rowSelection"
        :loading="aloading"
      ></test-table>
    </test-contaner>

    <div style="background: gainsboro;padding: 10px 10px; margin: 10px 0px;">2.表格 Col分组</div>
    <br />
    <test-contaner>
      <test-table1 :datasource="dataSource1"></test-table1>
    </test-contaner>

    <div style="background: gainsboro;padding: 10px 10px; margin: 10px 0px;">3.表格 Row分组</div>
    <br />
    <test-contaner>
      <test-table2 :datasource="dataSource2"></test-table2>
    </test-contaner>

    <div style="background: gainsboropadding: 10px 10px; margin: 10px 0px;">4.表格 扩展</div>
    <br />
    <test-contaner>
      <test-table3 :row-class-name="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"></test-table3>
    </test-contaner>

    <div style="background: gainsboro;padding: 10px 10px; margin: 10px 0px;">5.表格Tree</div>
    <br />
    <test-contaner>
      <test-table4
        :row-selection="rowSelection"
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      ></test-table4>
    </test-contaner>

    <div style="background: gainsboro;padding: 10px 10px; margin: 10px 0px;">6.输入框</div>
    <br />
    <test-contaner>
      <test-input
        v-model:value="testFormState.cmtter1"
        name="cmtter1"
        ui="testinputui"
      ></test-input>

      <test-text-area
        v-model:value="testFormState.cmtter11111"
        name="cmtter11111"
      ></test-text-area>

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
    </test-contaner>
    <br /><br />

    <div style="background: gainsboro;padding: 10px 10px; margin: 10px 0px;">7.loading技巧处理</div>
    <br />
    <test-contaner>
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
    </test-contaner>

    <div style="background: gainsboro;padding: 10px 10px; margin: 10px 0px;">8.可以通过UI.component.generate方法将任意组件的配置逻辑代码迁移到页面之外</div>
    <br />
    <test-contaner>
      <testCard></testCard>
    </test-contaner>

    <div style="background: gainsboro;padding: 10px 10px; margin: 10px 0px;">9.选择框</div>
    <br />
    <test-contaner>
      <test-simple-select
        v-model:value="testFormState.cmtter29"
        name="cmtter29"
      ></test-simple-select>

      <test-multiple-simple-select
        v-model:value="testFormState.cmtter30"
        name="cmtter30"
      ></test-multiple-simple-select>

      <test-autocomplete-select
        v-model:value="testFormState.cmtter31"
        name="cmtter31"
      ></test-autocomplete-select>

      <test-multiple-autocomplete-select
        v-model:value="testFormState.cmtter32"
        name="cmtter32"
      ></test-multiple-autocomplete-select>
    </test-contaner>
    <br />
    <br />
    <div style="background: gainsboro;padding: 10px 10px; margin: 10px 0px;">10.Tree选择框</div>
    <br />
    <test-contaner>
      <test-tree-select
        v-model:value="testFormState.cmtter33"
        name="cmtter33"
      ></test-tree-select>
      <test-tree-multiple-select
        v-model:value="testFormState.cmtter34"
        name="cmtter34"
      ></test-tree-multiple-select>
      <test-tree-select1
        v-model:value="testFormState.cmtter35"
        name="cmtter35"
      ></test-tree-select1>

      <test-tree-multiple-select1
        v-model:value="testFormState.cmtter36"
        name="cmtter36"
      ></test-tree-multiple-select1>

      <test-tree-multiple-select2
        v-model:value="testFormState.cmtter37"
        name="cmtter37"
      >
      </test-tree-multiple-select2>

      <test-tree-multiple-select3
        v-model:value="testFormState.cmtter38"
        name="cmtter38"
      ></test-tree-multiple-select3>

      <test-tree-select2
        v-model:value="testFormState.cmtter39"
        name="cmtter39"
      ></test-tree-select2>

      <test-tree-select3
        v-model:value="testFormState.cmtter40"
        name="cmtter40"
      ></test-tree-select3>
    </test-contaner>
    <br />
    <br />

    <br /><br />
    <div>
      <a-button
        @click="testHandler"
        size="small"
      >点击我,修改输入框为禁用</a-button>

    </div>
    <br />
    <div>
      <div> 简单选择: {{testFormState.cmtter29}}</div>
      <div> 简单多选: {{testFormState.cmtter30}}</div>
      <div> 自动补全: {{testFormState.cmtter31}}</div>
      <div> 自动补全多选: {{testFormState.cmtter32}}</div>
      <div> 树选择: {{testFormState.cmtter33}}</div>
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
    </div>
    <div>图标 <JoyinNumberFilled></JoyinNumberFilled>
    </div>

  </el-form>

  <div>

  </div>
</template>

<script>
import { UIConfig } from '@lib/components/ui'
import { resolveRowGroupData } from '@lib/components/ui/generates/ui-datatable'
import JoyinNumberFilled from '@lib/components/icon/JoyinNumberFilled'
import { reactive } from 'vue'
import { Form, Button } from 'ant-design-vue'
import components, { _testFormState } from './_index-components'
let uuid = 1
//行分组

const treeData = [
  {
    a: 'a1',
    a2: 'a2',
    children: [
      { a21: 'a21-1', a22: 'a22-1' },
      { a21: 'a21-2', a22: 'a22-2' },
      {
        a21: 'a21-3',
        a22: 'a22-3',
        children: [
          { a211: 'a211-1', a212: 'a212-1' },
          { a211: 'a211-2', a212: 'a212-2' },
          { a211: 'a211-3', a212: 'a212-3' }
        ]
      },
      { a21: 'a21-4', a22: 'a22-4' }
    ]
  }
]

const rowGroupDatas = resolveRowGroupData(treeData)

export default {
  data() {
    return {
      disabled: true,
      params: {},
      hostVar: '我来自于宿主环境',
      dataSource: {
        total: 1000,
        pageSize: 20,
        current: 1,
        datas: [
          {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号西湖区湖底公园1号西湖区湖底公园1号西湖区湖底公园1号西湖区湖底公园1号',
          },
          {
            key: '2',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
          }
        ]
      },
      dataSource1: [
        {
          key: '1',
          name: '胡彦斌',
          xueli: '本科',
          brs: '1985',
          age: 32,
          address: '西湖区湖底公园1号西湖区湖底公园1号西湖区湖底公园1号西湖区湖底公园1号西湖区湖底公园1号',
        },
        {
          key: '2',
          name: '胡彦祖',
          xueli: '本科',
          brs: '1985',
          age: 32,
          address: '西湖区湖底公园1号',
        },
        {
          key: '2',
          name: '王秀夫',
          xueli: '本科',
          brs: '1985',
          age: 32,
          address: '西湖区湖底公园1号',
        }
      ],
      dataSource2: rowGroupDatas,
      aloading: false
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
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      //禁用选择
      getCheckboxProps: (record) => ({
        disabled: record.age === 32, // Column configuration not to be checked
        name: record.name,
      }),
    };
    return {
      testFormState,
      rowSelection
    }
  },
  methods: {
    handleTableChange(pagination) {
      this.aloading = true
      this.dataSource = {
        ...this.dataSource,
        ...pagination
      }
      setTimeout(() => {
        this.aloading = false
      }, 1000);
    },
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

<style>
.table-striped {
  background-color: #fafafa;
}
</style>