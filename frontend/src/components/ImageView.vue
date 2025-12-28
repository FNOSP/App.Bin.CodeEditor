<template>
  <div class="image-view">
    <el-image
      style="width: 80%; height: 80%"
      :src="getFullPath($props.src)"
      fit="contain"
      :preview-src-list="imgs.map((i) => getFullPath(i))"
      show-progress
      :initial-index="imgs.findIndex((i) => i === $props.src)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { getFileSuffix, getFullPath } from '@/utils/file'
import { FILE_MAP } from '@/utils/option'

const $props = defineProps<{ src: string; list: string[] }>()

const imgs = computed(() => $props.list.filter((i) => FILE_MAP[getFileSuffix(i)] === 'img'))
</script>

<style lang="scss" scoped>
.image-view {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
