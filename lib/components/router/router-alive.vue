<template>
  <div class="joyin-router-alive">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component
          :is="Component"
          :key="key"
        />
      </keep-alive>
    </router-view>
  </div>
</template>

<script>
/**
 * router-alive
 */
export default {
  props: {
    key: String
  }
}
</script>

<style lang="sass">
</style>