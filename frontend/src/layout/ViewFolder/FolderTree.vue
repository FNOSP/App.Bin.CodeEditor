<template>
  <el-tree
    :props="props"
    :load="loadNode"
    lazy
    @node-click="(v: { leaf: boolean; value: string }) => v.leaf && editor.add(v.value, false)"
  >
    <template #default="{ node, data }">
      <div class="node-item">
        <div class="icon">
          <FileView v-if="node.isLeaf" :path="data.value" />

          <el-icon v-else size="18">
            <FolderOpened v-if="node.expanded" />
            <Folder v-else />
          </el-icon>
        </div>

        <div class="text">{{ node.label }}</div>
      </div>
    </template>
  </el-tree>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { Folder, FolderOpened } from '@element-plus/icons-vue'

import FileView from '@/components/FileView.vue'

import { useEditorStore } from '@/store/editor'

import { HOST } from '@/utils/env'

import type { LoadFunction } from 'element-plus'

const editor = useEditorStore()

const props = { label: 'label', children: 'zones', isLeaf: 'leaf' }

const loadNode: LoadFunction = async (node, resolve) => {
  const root = node.data.value || '/Users/flex/Downloads'

  const { data } = await axios.get<{ data: { dirs: string[]; files: string[] } }>(HOST, {
    params: { _api: 'dir', path: root },
  })

  resolve([
    ...data.data.dirs.map((i) => ({ label: i, value: `${root}/${i}`, leaf: false })),
    ...data.data.files.map((i) => ({ label: i, value: `${root}/${i}`, leaf: true })),
  ])
}
</script>

<style lang="scss" scoped>
.node-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;

  > .icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
