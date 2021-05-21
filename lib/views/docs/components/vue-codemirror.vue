<template>
  <div class="vue-codemirror">
    <textarea
      ref="textarea"
      v-html="code"
    ></textarea>
  </div>
</template>

<script>

import _CodeMirror from 'codemirror'
const CodeMirror = window.CodeMirror || _CodeMirror
import { codemirrorOption } from './_codemirror'

export default {
  name: 'codemirror',
  data() {
    return {
      content: '',
      cminstance: null
    }
  },
  props: {
    code: String,
    options: {
      type: Object,
      default: () => (codemirrorOption)
    }
  },
  emits: ['update:code'],
  watch: {
    code(newVal) {
      this.codemirror.setValue(newVal || '')
      this.refresh()
    }
  },
  methods: {
    initialize() {
      const cmOptions = Object.assign({}, this.options)
      this.codemirror = CodeMirror.fromTextArea(this.$refs.textarea, cmOptions)
      this.codemirror.setValue(this.code)
      this.refresh()
    },
    refresh() {
      this.$nextTick(() => {
        this.codemirror.refresh()
      })
    }
  },
  mounted() {
    this.initialize()
  }
}
</script>

<style>
.vue-codemirror {
  height: 100%;
  border: 1px solid #000;
}
.vue-codemirror .CodeMirror {
  height: 99%;
}
</style>