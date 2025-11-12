<template>
  <div class="header">
    <div class="title">{{ $props.path }}</div>

    <el-button size="small" @click="resetPath()">修改路径</el-button>

    <div style="flex: 1"></div>

    <el-button size="small" @click="$emit('like')">偏好</el-button>

    <el-button size="small" :disabled="code.value === code.org" @click="save()">保存</el-button>
  </div>

  <div class="editor">
    <div class="content" v-if="code.lang">
      <MonacoEditor
        v-model:value="code.value"
        :language="code.lang"
        :theme="like.theme"
        :options="{ fontSize: 14, automaticLayout: true }"
        @editorDidMount="editorDidMount"
      />
    </div>
  </div>

  <div class="footer">
    <div class="developed">Developed by Flex_7746</div>

    <div style="flex: 1"></div>

    <el-button size="small" @click="resetPswd()">清除密钥</el-button>

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
import { reactive, watch } from 'vue'
import MonacoEditor from 'monaco-editor-vue3'
import * as iconv from 'iconv-lite'

import { LANG_OPTIONS, ENCODING_OPTIONS } from '@/utils/option'

import { type LikeModel } from '../hooks/useLike'
import useCode from '../hooks/useCode'
import useEditor from '../hooks/useEditor'
import useReset from '../hooks/useReset'

const $props = defineProps<{ path: string; like: LikeModel }>()
const $emit = defineEmits<{ like: [] }>()

watch(
  () => $props.like.confirm,
  (v) => {
    editorLike.confirm = v
  },
)
watch(
  () => $props.like.theme,
  (v) => {
    editorLike.theme = v
    changeTheme(v)
  },
)
watch(
  () => $props.like.fontSize,
  (v) => {
    editorLike.fontSize = v
    changeSize(v)
  },
)

const editorLike = reactive({ ...$props.like })

const { code, save } = useCode({ path: $props.path, confirm: () => editorLike.confirm })

const { editorDidMount, changeLang, changeTheme, changeSize } = useEditor({ onSave: save })

const { resetPath, resetPswd } = useReset({ isDiff: () => code.value !== code.org })

const changeEncode = async (v: string) => {
  const buffer = await code.blob.arrayBuffer()
  code.org = code.value = iconv.decode(new Uint8Array(buffer), v)
}
</script>
