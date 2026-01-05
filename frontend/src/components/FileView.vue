<template>
  <el-icon v-if="icon" :size="$props.size || 18">
    <component :is="iconView[icon]" />
  </el-icon>
</template>

<script lang="ts" setup>
import { computed, type Component } from 'vue'
import { Picture, Document } from '@element-plus/icons-vue'

import Feiniu from '@/components/icons/Feiniu.vue'
import OfficeWord from '@/components/icons/OfficeWord.vue'
import OfficeExcel from '@/components/icons/OfficeExcel.vue'
import OfficePPT from '@/components/icons/OfficePPT.vue'
import Zip from '@/components/icons/Zip.vue'
import Iso from '@/components/icons/Iso.vue'
import Code from '@/components/icons/Code.vue'

import { LANG_MAP, FILE_MAP } from '@/utils/option'
import { getFileSuffix } from '@/utils/file'

const $props = defineProps<{ size?: number | string; path: string }>()

const iconView: { [x: string]: Component } = {
  img: Picture,
  feiniu: Feiniu,
  word: OfficeWord,
  excel: OfficeExcel,
  ppt: OfficePPT,
  zip: Zip,
  iso: Iso,
  code: Code,
  default: Document,
}

const icon = computed(() => {
  const suffix = getFileSuffix($props.path)

  if (iconView[suffix]) {
    return suffix
  }

  const fileType = FILE_MAP[suffix]

  if (fileType && iconView[fileType]) {
    return fileType
  }

  return LANG_MAP[suffix] ? 'code' : 'default'
})
</script>

<style lang="scss" scoped>
.file-view {
  &-img {
    max-width: 80%;
    max-height: 80%;
  }
}
</style>
