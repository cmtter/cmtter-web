const readline = require('readline');
const path = require('path');
const fs = require('fs');

const aaa = `

<template>
  <div style="height: 1000px;">
    用户管理

  </div>

</template>

<script>
/**
 * @defRouter: {title: '设计'}
 */
export default {
  data() {
    return {

    }
  },
  components: {
  },
  mixins: [],
  setup() {

  },
  created() {
  },
  methods: {

  }
}
</script>

<style>
</style>
`

const r1 = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../views/system/use.vue'))
});
let i = 1
r1.on('line', function (line) { //事件监听
  console.log('Line from file:' + i + ":" + line);
  if (i == 1) {
    console.log(line)
  }
  i += 1;
})


