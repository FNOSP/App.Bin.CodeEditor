<template>
  <div class="view">
    <div class="head">
      <div class="title">目录</div>

      <el-icon class="icon" @click="openDir()"><Files /></el-icon>
    </div>

    <div class="content">
      <div class="list">
        <el-tree
          ref="treeRef"
          :key="like.cfg.folderActive"
          :props="{ label: 'label', isLeaf: 'leaf' }"
          :load="loadNode"
          lazy
          node-key="value"
          @node-click="openNode"
        >
          <template #default="{ node, data }">
            <div class="node-item">
              <div class="icon">
                <el-icon v-if="data.dir" size="18">
                  <Refresh v-if="node.expanded" @click.stop="refreshNode(node)" />
                  <Folder v-else />
                </el-icon>

                <FileView v-else :path="data.value" />
              </div>

              <div class="text">
                <div class="t">{{ node.label }}</div>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import { Files, Folder, Refresh } from '@element-plus/icons-vue'

import FileView from '@/components/FileView.vue'

import { HOST } from '@/utils/env'

import { useEditorStore } from '@/store/editor'
import { useLikeStore } from '@/store/like'
import { useOpenStore } from '@/store/open'

import type { TreeInstance, TreeData, TreeNodeData, RenderContentContext } from 'element-plus'

const editor = useEditorStore()
const like = useLikeStore()
const open = useOpenStore()

const treeRef = ref<TreeInstance>()

const openDir = async () => {
  open.show = 'dir'
}

const refreshNode = (node: RenderContentContext['node']) => {
  loadNode(node, (data) => node.key && treeRef.value?.updateKeyChildren(node.key, data))
}

const loadNode = async (node: RenderContentContext['node'], resolve: (v: TreeData) => void) => {
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

const openNode = (data: TreeNodeData) => {
  if (data.leaf) {
    editor.add(data.value, { keep: false })
  }
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

  > .text {
    flex: 1;
    position: relative;

    > .t {
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
