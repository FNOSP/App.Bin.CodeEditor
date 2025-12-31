<template>
  <div class="md-view" v-html="html"></div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { marked } from 'marked'

const $props = defineProps<{ src?: string; text?: string }>()

const html = ref('')

watchEffect(async () => {
  html.value = await marked.parse($props.text || '')
})
</script>

<style lang="scss" scoped>
.md-view {
  position: absolute;
  z-index: 10;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
}
</style>
