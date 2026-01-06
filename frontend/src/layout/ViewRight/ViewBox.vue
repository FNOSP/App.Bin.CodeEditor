<template>
  <div class="tips" v-if="error || isBinaryFile">
    <div class="t">{{ error || '暂不支持此类文件的编辑' }}</div>
  </div>

  <template v-else>
    <div class="tips column" v-if="$props.value.wait && $props.value.size !== undefined">
      <div class="t">此文件大小为 {{ getSize($props.value.size) }}</div>
      <div class="t">可能不支持编辑或预览，是否继续？</div>
      <el-button class="b" @click="$emit('next')">加载文件</el-button>
    </div>

    <template v-else>
      <ImageView v-if="fileType === 'img'" :src="$props.value.path" :list="$props.value.list" />

      <PdfView v-else-if="fileType === 'pdf'" :src="$props.value.path" />

      <MonacoEditor v-else ref="editorRef" :path="$props.value.path" @diff="(v) => $emit('diff', v)" @error="(v) => v && (error = v)" />
    </template>
  </template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import MonacoEditor from '@/components/MonacoEditor.vue'
import ImageView from '@/components/ImageView.vue'
import PdfView from '@/components/PdfView.vue'

import { FILE_MAP } from '@/utils/option'
import { getFileSuffix, getSize } from '@/utils/file'

import type { ViewModel as EditorViewModel } from '@/store/editor'

const $props = defineProps<{ value: EditorViewModel }>()
const $emit = defineEmits<{ next: []; diff: [v: boolean] }>()

defineExpose({
  isEditor: () => !!editorRef.value,
  save: () => editorRef.value?.save(),
})

const editorRef = ref<{ save: () => void }>()

const error = ref('')
const fileType = computed(() => FILE_MAP[getFileSuffix($props.value.path)])
const isBinaryFile = computed(() => fileType.value && !['img', 'pdf'].includes(fileType.value))
</script>

<style lang="scss" scoped>
.tips {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &.column {
    flex-direction: column;
  }

  > .t {
    white-space: nowrap;
    font-size: 14px;
    color: var(--el-text-color-placeholder);
  }

  > .b {
    margin-top: 12px;
  }
}
</style>
