<template>
  <div> 3 {{aaaaaa}}
    <input v-model="aaaaaa">

    <div>
      <button @click="showLoading">显示loading</button>

    </div>
  </div>
</template>

<script>
import composition from '@lib/api/composition'
export default {
  data() {
    return {
      aaaaaa: ''
    }
  },
  setup() {
    const setLoading = composition.useLoading()
    const showLoading = () => {
      setLoading(true, '我是loading')
      setTimeout(() => {
        setLoading(false)
      }, 20000);
    }
    return {
      showLoading
    }
  }
}
</script>

<style lang="sass">
</style>