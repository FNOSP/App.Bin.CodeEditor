<template>
  <div class="video-view">
    <video class="i" :src="getFullPath($props.src)" controls></video>
  </div>
</template>

<script lang="ts" setup>
import { getFullPath } from '@/utils/file'

const $props = defineProps<{ src: string }>()
</script>

<style lang="scss" scoped>
.video-view {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > .i {
    max-width: 80%;
    max-height: 80%;
  }
}
</style>
