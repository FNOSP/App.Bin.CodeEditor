<template>
  <div class="view">
    <div class="head">
      <div class="title">历史记录</div>

      <el-icon class="icon" @click="open.clearHistory()"><Delete /></el-icon>
    </div>

    <div class="content">
      <div class="list">
        <div
          class="node-item"
          v-for="item in open.history"
          :key="item.path"
          @click="editor.add(item.path, { keep: false, history: false })"
        >
          <div class="icon">
            <FileView :path="item.path" />
          </div>

          <div class="text">{{ getFileName(item.path) }}</div>

          <div style="flex: 1"></div>
          <el-icon class="i" @click.stop="open.removeHistory(item.path)"><Close /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Close } from '@element-plus/icons-vue'

import FileView from '@/components/FileView.vue'

import { getFileName } from '@/utils/file'

import { useOpenStore } from '@/store/open'
import { useEditorStore } from '@/store/editor'

const open = useOpenStore()
const editor = useEditorStore()
</script>

<style lang="scss" scoped>
.node-item {
  height: 26px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 12px 0 24px;
  cursor: pointer;

  &:hover {
    --el-tree-node-hover-bg-color: var(--el-fill-color-light);
    background-color: var(--el-tree-node-hover-bg-color);
  }

  > .icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  > .text {
    --el-tree-text-color: var(--el-text-color-regular);
    color: var(--el-tree-text-color);
    font-size: var(--el-font-size-base);
  }
}
</style>
