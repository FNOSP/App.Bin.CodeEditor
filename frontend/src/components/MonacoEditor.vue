<template>
  <div style="flex: 1">
    <MonacoEditor
      v-if="code.lang"
      v-model:value="code.value"
      :language="code.lang"
      :theme="like.cfg.theme"
      :options="{ automaticLayout: true, ...like.cfg.editorOption }"
      @editorDidMount="editorDidMount"
    />
  </div>

  <div class="footer">
    <div class="developed">Developed by Flex_7746</div>

    <div style="flex: 1"></div>

    <el-select
      v-model="code.lang"
      style="width: 120px"
      size="small"
      filterable
      placement="top"
      @change="changeLang"
    >
      <el-option
        v-for="item in LANG_OPTIONS"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <el-select
      v-model="code.encode"
      style="width: 120px"
      size="small"
      filterable
      placement="top"
      @change="changeEncode"
    >
      <el-option
        v-for="item in ENCODING_OPTIONS"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <el-button size="small" :icon="Setting" @click="like.open = true"></el-button>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import MonacoEditor from 'monaco-editor-vue3'
import * as iconv from 'iconv-lite'
import { Setting } from '@element-plus/icons-vue'

import { useLikeStore } from '@/store/like'

import { LANG_OPTIONS, ENCODING_OPTIONS } from '@/utils/option'

import useCode from '../hooks/useCode'
import useEditor from '../hooks/useEditor'

const $props = defineProps<{ path: string }>()
const $emit = defineEmits<{ diff: [v: boolean] }>()

const like = useLikeStore()

defineExpose({
  save: () => save(),
})

const { code, save } = useCode({
  path: $props.path,
  confirm: () => like.cfg.confirm,
  onSave: () => $emit('diff', false),
})

const { editorDidMount, changeLang, changeTheme, changeOption } = useEditor({ onSave: save })

const changeEncode = async (v: string) => {
  const buffer = await code.blob.arrayBuffer()
  code.org = code.value = iconv.decode(new Uint8Array(buffer), v)
}

watch(
  () => code.value,
  (v) => {
    $emit('diff', v !== code.org)
  },
)
watch(
  () => like.cfg.theme,
  (v) => {
    changeTheme(v)
  },
)
watch(
  () => like.cfg.editorOption,
  (v) => {
    changeOption(v)
  },
)
</script>

<style lang="scss" scoped>
.footer {
  height: 32px;
  border-top: solid 1px var(--el-border-color);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
  background-color: var(--el-bg-color);

  > * {
    margin: 0;
  }

  > .developed {
    font-size: 12px;
    line-height: 32px;
    color: var(--el-text-color-placeholder);
  }
}
</style>
