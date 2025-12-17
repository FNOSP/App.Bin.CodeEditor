<template>
  <el-dialog v-model="show" title="打开" width="500" @closed="input = ''">
    <el-tabs default-value="file">
      <el-tab-pane label="文件" name="file">
        <div class="view-dialog">
          <el-input v-model="input" placeholder="请输入文件路径（不存在的文件编辑后可直接新增）">
            <template #append>
              <el-button @click="editor.add(input)">确认</el-button>
            </template>
          </el-input>

          <template v-if="open.history.length">
            <div class="title">
              <div class="t">历史记录</div>
              <el-button size="small" @click="open.clearHistory()">清除全部</el-button>
            </div>

            <div class="history">
              <div
                class="item"
                v-for="item in open.history"
                :key="item.path"
                @click="editor.add(item.path)"
              >
                <div class="t">{{ item.path }}</div>
                <div style="flex: 1"></div>
                <el-icon class="i" @click.stop="open.removeHistory(item.path)"><Close /></el-icon>
              </div>
            </div>
          </template>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Close } from '@element-plus/icons-vue'

import { useOpenStore } from '@/store/open'
import { useEditorStore } from '@/store/editor'

const open = useOpenStore()
const editor = useEditorStore()

const { show, input } = storeToRefs(open)

onMounted(async () => {
  const query = new URLSearchParams(window.location.search).get('path') || ''
  if (query) {
    editor.add(query)
  } else {
    show.value = true
  }
})
</script>

<style lang="scss" scoped>
.view-dialog {
  display: flex;
  flex-direction: column;

  > .title {
    margin: 12px 0 4px;
    display: flex;
    align-items: center;
    gap: 12px;

    > .t {
      font-size: 12px;
      color: var(--el-text-color-placeholder);
      flex: 1;
    }
  }

  > .history {
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
