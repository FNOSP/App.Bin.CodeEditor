<template>
  <div class="view">
    <div class="head">
      <div class="title">目录</div>

      <el-tooltip content="切换目录" placement="bottom">
        <el-icon class="icon" @click="openDir()"><Files /></el-icon>
      </el-tooltip>
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
                  <FolderOpened v-if="node.expanded" />
                  <Folder v-else />
                </el-icon>

                <FileView v-else :path="data.value" />
              </div>

              <div class="text">
                <div class="t">{{ node.label }}</div>
              </div>

              <div class="edit" v-if="data.dir" v-show="node.expanded">
                <el-tooltip content="刷新目录" placement="top">
                  <el-icon @click.stop="refreshNode(node)"><Refresh /></el-icon>
                </el-tooltip>

                <el-tooltip content="上传文件" placement="top">
                  <el-icon @click.stop="uploadFile(node)"><Upload /></el-icon>
                </el-tooltip>

                <el-tooltip content="创建文件" placement="top">
                  <el-icon @click.stop="addFile(node)"><DocumentAdd /></el-icon>
                </el-tooltip>
              </div>
              <div class="edit" v-else>
                <!-- <el-tooltip content="删除文件" placement="top">
                  <el-icon><DocumentAdd /></el-icon>
                </el-tooltip> -->
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </div>

    <input class="node-upload" ref="upload" type="file" @change="uploadFileChange" />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, useTemplateRef } from 'vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { Files, Folder, FolderOpened, Refresh, Upload, DocumentAdd } from '@element-plus/icons-vue'

import FileView from '@/components/FileView.vue'

import { useEditorStore } from '@/store/editor'
import { useLikeStore } from '@/store/like'
import { useOpenStore } from '@/store/open'
import { useUserStore } from '@/store/user'

import { readPath, saveFile } from '@/utils/file'

import type { TreeInstance, TreeData, TreeNodeData, RenderContentContext } from 'element-plus'

const editor = useEditorStore()
const like = useLikeStore()
const user = useUserStore()
const open = useOpenStore()

const uploadRef = useTemplateRef('upload')
const uploadInfo = ref<RenderContentContext['node']>()

const treeRef = ref<TreeInstance>()

const openDir = async () => {
  open.show = 'dir'
}

const addFile = async (node: RenderContentContext['node']) => {
  try {
    const { value } = await ElMessageBox.prompt(`${node.data.value}/`, '创建文件', {
      inputValidator: (v) => (v ? true : '请输入文件名'),
      inputPlaceholder: '文件名+后缀',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })

    const path = `${node.data.value}/${value}`

    await saveFile({ path, force: true, file: new Blob([new TextEncoder().encode(' ')]) })

    ElMessage({ type: 'success', message: '操作成功' })

    editor.add(path, { keep: false })

    refreshNode(node)
  } catch {
    return
  }
}

const uploadFile = (node: RenderContentContext['node']) => {
  uploadInfo.value = node
  uploadRef.value?.click()
}

const uploadFileChange = async (e: any) => {
  if (!uploadInfo.value) {
    return
  }

  const [file] = e?.target?.files || []
  if (!file) {
    return
  }

  const children = uploadInfo.value.childNodes.map((i) => i.data.label)
  if (children.includes(file.name)) {
    try {
      await ElMessageBox.confirm(`当前目录存在同名文件：【${file.name}】，继续上传将覆盖该文件，是否继续？`, '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'info',
      })
    } catch {
      return
    }
  }

  const path = `${uploadInfo.value.data.value}/${file.name}`

  await saveFile({ path, force: true, file })

  ElMessage({ type: 'success', message: '操作成功' })

  refreshNode(uploadInfo.value)

  editor.remove(path, true)

  e.target.value = ''
  uploadInfo.value = undefined

  nextTick(() => {
    editor.add(path, { keep: false })
  })
}

const refreshNode = (node: RenderContentContext['node']) => {
  loadNode(node, (data) => node.key && treeRef.value?.updateKeyChildren(node.key, data))
}

const loadNode = async (node: RenderContentContext['node'], resolve: (v: TreeData) => void) => {
  const root = node.data.value || like.cfg.folderActive

  if (!root) {
    return resolve([])
  }

  const { data: result } = await readPath<{ code: number; data: DirModel }>({ path: root, dir: true })

  if (result.code !== 200) {
    return resolve([])
  }

  resolve(
    [
      ...result.data.dirs.map((i) => ({
        label: i.name,
        value: `${root}/${i.name}`,
        leaf: false,
        dir: true,
      })),
      ...result.data.files.map((i) => ({
        label: i.name,
        value: `${root}/${i.name}`,
        leaf: true,
        dir: false,
        size: i.size,
        updateDate: i.updateDate,
      })),
    ].filter((i) => !user.cfg.folderHidePrefix.some((x) => i.label.indexOf(x) === 0)),
  )
}

const openNode = (data: TreeNodeData) => {
  if (data.leaf) {
    editor.add(data.value, {
      keep: false,
      list: treeRef.value?.getNode(data.value)?.parent?.childNodes?.map((i) => i.data.value) || [],
      size: data.size,
      date: dayjs(data.updateDate),
    })
  }
}
</script>

<style lang="scss" scoped>
.node-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 4px;

  &:hover {
    > .edit {
      display: flex;
    }
  }

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

  > .edit {
    display: none;
    align-items: center;
    gap: 8px;
  }
}

.node-upload {
  height: 0;
  width: 0;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0;
}
</style>
