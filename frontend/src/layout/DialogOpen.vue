<template>
  <el-dialog
    :modelValue="!!show"
    @update:modelValue="
      (v: boolean) => {
        if (v === false) {
          show = undefined
        }
      }
    "
    title="打开"
    width="500"
    @closed="input = ''"
  >
    <el-tabs v-model="show">
      <el-tab-pane label="文件" name="file">
        <div class="view-dialog">
          <el-input v-model="input" placeholder="请输入文件路径（不存在的文件编辑后可直接新增）" class="input">
            <template #append>
              <el-button @click="editor.add(input)">确认</el-button>
            </template>
          </el-input>

          <template v-if="open.history.length">
            <div class="title">
              <div class="t">历史记录</div>
              <el-button size="small" @click="open.clearHistory()">清空记录</el-button>
            </div>

            <div class="list">
              <div class="item" v-for="item in open.history" :key="item.path" @click="editor.add(item.path)">
                <div class="t">{{ item.path }}</div>
                <div style="flex: 1"></div>
                <el-icon class="i" @click.stop="open.removeHistory(item.path)"><Close /></el-icon>
              </div>
            </div>
          </template>
        </div>
      </el-tab-pane>

      <el-tab-pane label="目录" name="dir">
        <div class="view-dialog">
          <el-input v-model="input" placeholder="请输入目录路径" class="input">
            <template #append>
              <el-button @click="addDir(input)">添加目录</el-button>
            </template>
          </el-input>

          <div class="title">
            <div class="t">我的目录</div>

            <el-select v-model="cfg.folderDefOpen" size="small" clearable style="width: 200px" placeholder="选择目录">
              <el-option-group label="启动时默认打开">
                <el-option v-for="item in user.cfg.dir" :key="item" :label="item" :value="item" />
              </el-option-group>
            </el-select>
          </div>

          <div class="list">
            <div class="item" v-for="item in user.cfg.dir" :key="item" @click="changeDir(item)">
              <div class="t">{{ item }}</div>
              <div style="flex: 1"></div>
              <el-icon v-if="user.cfg.dir.length > 1" class="i" @click.stop="deleteDir(item)">
                <Close />
              </el-icon>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Close } from '@element-plus/icons-vue'

import { useUserStore } from '@/store/user'
import { useOpenStore } from '@/store/open'
import { useEditorStore } from '@/store/editor'
import { useLikeStore } from '@/store/like'
import { useMenuStore } from '@/store/menu'

const user = useUserStore()
const open = useOpenStore()
const menu = useMenuStore()
const like = useLikeStore()
const editor = useEditorStore()

const { show, input } = storeToRefs(open)
const { cfg } = storeToRefs(user)

onMounted(async () => {
  const query = new URLSearchParams(window.location.search).get('path') || ''
  if (query) {
    editor.add(query)
  } else {
    if (cfg.value.startOpen) {
      show.value = 'file'
    }
  }
})

const changeDir = (v: string) => {
  like.cfg.folderActive = v
  menu.open = 'folder'
  menu.initialized.folder = true
  open.show = undefined
}

const addDir = (v: string) => {
  const index = user.cfg.dir.findIndex((i) => i === v)
  if (index > -1) {
    user.cfg.dir.splice(index, 1)
  }

  user.cfg.dir.unshift(v)
}

const deleteDir = (v: string) => {
  const index = user.cfg.dir.findIndex((i) => i === v)
  if (index > -1) {
    user.cfg.dir.splice(index, 1)

    if (cfg.value.folderDefOpen === v) {
      cfg.value.folderDefOpen = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.view-dialog {
  display: flex;
  flex-direction: column;

  > .input {
    margin-bottom: 12px;
  }

  > .title {
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 12px;

    > .t {
      font-size: 12px;
      color: var(--el-text-color-placeholder);
      flex: 1;
    }
  }

  > .list {
    display: flex;
    flex-direction: column;
    height: 200px;
    overflow: auto;

    > .item {
      display: flex;
      align-items: center;
      padding-right: 10px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        background-color: var(--el-color-info-light-5);
      }

      > .t {
        line-height: 20px;
      }
      > .i {
        &:hover {
          color: var(--el-color-danger);
        }
      }
    }
  }
}
</style>
