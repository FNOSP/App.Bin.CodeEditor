<template>
  <div style="flex: 1; position: relative">
    <MonacoEditor
      v-if="code.lang"
      v-show="!showMdView"
      v-model:value="code.value"
      :language="code.lang"
      :theme="user.cfg.theme"
      :options="{ automaticLayout: true, ...user.cfg.editorOption }"
      @editorDidMount="editorDidMount"
    />

    <MdView v-show="showMdView" :text="code.value" />
  </div>

  <div class="footer">
    <div class="developed">Developed by Flex_7746</div>

    <div style="flex: 1"></div>

    <el-switch
      v-if="code.lang === 'markdown'"
      v-model="mdView"
      inline-prompt
      active-text="预览"
      inactive-text="源码"
    />

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
      placement="top-end"
      @change="changeEncode"
    >
      <el-option
        v-for="item in ENCODING_OPTIONS"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import MonacoEditor from 'monaco-editor-vue3'
import * as iconv from 'iconv-lite'

import MdView from '@/components/MdView.vue'

import { useUserStore } from '@/store/user'

import { LANG_OPTIONS, ENCODING_OPTIONS } from '@/utils/option'

import useCode from '../hooks/useCode'
import useEditor from '../hooks/useEditor'

const $props = defineProps<{ path: string }>()
const $emit = defineEmits<{ diff: [v: boolean]; error: [v?: string] }>()

const user = useUserStore()

const mdView = ref(user.cfg.fileMdView)

const showMdView = computed(() => code.lang === 'markdown' && mdView)

defineExpose({
  save: () => save(),
})

const { code, load, save } = useCode({
  confirm: () => user.cfg.confirm,
  onSave: () => $emit('diff', false),
  onError: (v) => $emit('error', v),
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
  () => user.cfg.theme,
  (v) => {
    changeTheme(v)
  },
)
watch(
  () => user.cfg.editorOption,
  (v) => {
    changeOption(v)
  },
)

onMounted(() => {
  load($props.path)
})
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
