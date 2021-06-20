<template>

  <Contaner style="flex-wrap: nowrap;">
    <mudoleMenuCard flex="0 0 200px" />
    <Contaner
      :columnCount="1"
      flex="auto"
    >
      <DsWorker
        class="joyin-ds-worker"
        style="margin: 30px 0px;"
        flex="auto"
      ></DsWorker>
    </Contaner>
  </Contaner>

</template>
<script>
import components from './index-state-def.jsx'
import DsWorker from './_design/ds-worker-01.jsx'
export default {
  components: {
    ...components,
    DsWorker
  },
  setup() {

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
  border: 1px solid #efdede;
  position: relative;
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
</style>