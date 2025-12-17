<template>
  <div class="view">
    <div class="head">
      <div class="title">目录</div>

      <el-icon class="icon" @click="openDir()"><Files /></el-icon>
    </div>

    <div class="content">
      <div class="list">
        <el-tree
          :key="like.cfg.folderActive"
          :props="{ label: 'label', isLeaf: 'leaf' }"
          :load="loadNode"
          lazy
          @node-click="
            (v: { leaf: boolean; value: string }) => v.leaf && editor.add(v.value, { keep: false })
          "
        >
          <template #default="{ node, data }">
            <div class="node-item">
              <div class="icon">
                <el-icon v-if="data.dir" size="18">
                  <FolderOpened v-if="node.expanded" />
                  <Folder v-else />
                </el-icon>

                <FileView v-else :path="data.value" />
              </div>

              <div class="text">{{ node.label }}</div>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { Files, Folder, FolderOpened } from '@element-plus/icons-vue'

import FileView from '@/components/FileView.vue'

import { HOST } from '@/utils/env'

import { useEditorStore } from '@/store/editor'
import { useLikeStore } from '@/store/like'
import { useOpenStore } from '@/store/open'

import type { LoadFunction } from 'element-plus'

const editor = useEditorStore()
const like = useLikeStore()
const open = useOpenStore()

const openDir = async () => {
  open.show = 'dir'
}

const loadNode: LoadFunction = async (node, resolve) => {
  const root = node.data.value || like.cfg.folderActive

  if (!root) {
    return resolve([])
  }

  const { data: result } = await axios.get<{
    code: number
    data: { dirs: string[]; files: string[] }
  }>(HOST, {
    params: { _api: 'dir', path: root },
  })

  if (result.code !== 200) {
    return resolve([])
  }

  resolve(
    [
      ...result.data.dirs.map((i) => ({ label: i, value: `${root}/${i}`, leaf: false, dir: true })),
      ...result.data.files.map((i) => ({
        label: i,
        value: `${root}/${i}`,
        leaf: true,
        dir: false,
      })),
    ].filter((i) => !like.cfg.folderHidePrefix.some((x) => i.label.indexOf(x) === 0)),
  )
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
