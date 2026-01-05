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
    <el-tooltip content="文件快照" placement="bottom">
      <el-icon class="icon" @click="camera.open(code.path)"><Camera /></el-icon>
    </el-tooltip>

    <div class="info" v-if="code.date">修改时间：{{ code.date.format('YYYY/MM/DD HH:mm:ss') }}</div>

    <div class="info" v-if="code.byte !== undefined">文件大小：{{ getSize(code.byte) }}</div>

    <div style="flex: 1"></div>

    <div class="info">{{ code.value.length }} 个字符</div>

    <el-switch v-if="code.lang === 'markdown'" v-model="mdView" inline-prompt active-text="预览" inactive-text="源码" />

    <el-select v-model="code.lang" style="width: 120px" size="small" filterable placement="top" @change="changeLang">
      <el-option v-for="item in LANG_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>

    <el-select v-model="code.encode" style="width: 120px" size="small" filterable placement="top-end" @change="changeEncode">
      <el-option v-for="item in ENCODING_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import MonacoEditor from 'monaco-editor-vue3'
import { Camera } from '@element-plus/icons-vue'
import * as iconv from 'iconv-lite'

import MdView from '@/components/MdView.vue'

import { useUserStore } from '@/store/user'
import { useCameraStore } from '@/store/camera2'

import { LANG_OPTIONS, ENCODING_OPTIONS } from '@/utils/option'
import { getSize } from '@/utils/file'

import useCode from '../hooks/useCode'
import useEditor from '../hooks/useEditor'

const $props = defineProps<{ path: string }>()
const $emit = defineEmits<{ diff: [v: boolean]; error: [v?: string] }>()

const user = useUserStore()
const camera = useCameraStore()

const mdView = ref(user.cfg.fileMdView)

const showMdView = computed(() => code.lang === 'markdown' && mdView.value)

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
  gap: 8px;
  padding: 0 8px;
  background-color: var(--el-bg-color);

  > * {
    margin: 0;
  }

  > .icon {
    color: var(--el-text-color-regular);
    cursor: pointer;
  }

  > .info {
    font-size: 12px;
    line-height: 32px;
    color: var(--el-text-color-placeholder);
  }
}
</style>
