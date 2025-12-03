<template>
  <el-tabs class="view" v-model="active" type="card" closable @tab-remove="remove">
    <el-tab-pane v-for="(item, i) in view" :key="item.path" :name="i">
      <template #label>
        <el-tooltip :content="item.path">
          <div>{{ item.path.split('/').pop() }}</div>
        </el-tooltip>

        <div v-show="item.diff" class="diff"></div>
      </template>

      <MonacoEditor
        ref="editorRef"
        :path="item.path"
        :like="like"
        @like="() => (likeOpen = true)"
        @diff="(v) => (item.diff = v)"
      />
    </el-tab-pane>

    <el-tab-pane :name="-1" disabled>
      <template #label>
        <div class="add" @click="() => (pathOpen = true)">
          <el-icon><Plus /></el-icon>
        </div>
      </template>
    </el-tab-pane>
  </el-tabs>

  <el-button
    size="small"
    class="save"
    v-bind="view?.[active]?.diff ? { type: 'primary' } : { disabled: true }"
    @click="editorRef?.[active]?.save"
  >
    保存
  </el-button>

  <LikeDialog v-model:open="likeOpen" v-model:like="like" @reset="resetLike()" />

  <PathDialog v-model:open="pathOpen" :history="history.value" @open="add" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

import MonacoEditor from '@/components/MonacoEditor.vue'
import LikeDialog from '@/components/LikeDialog.vue'
import PathDialog from '@/components/PathDialog.vue'

import useLike from '@/hooks/useLike'
import usePath from '@/hooks/usePath'

const { open: likeOpen, like, resetLike } = useLike()
const { open: pathOpen, view, active, add, remove, history } = usePath()

const editorRef = ref<any[]>([])
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
}

#app {
  position: relative;

  > .view {
    height: 100%;
    display: flex;
    flex-direction: column;

    > .el-tabs__header {
      height: 40px;
      padding-right: 56px;
      margin: 0;

      .el-tabs__nav {
        border-radius: 0;

        .el-tabs__item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;

          &.is-disabled {
            > .add {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              pointer-events: all;
            }
          }

          .diff {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--el-text-color-placeholder);
          }

          > * {
            margin: 0;
          }
        }
      }

      .el-tabs__new-tab {
        width: 22px;
        height: 22px;
      }
    }

    > .el-tabs__content {
      flex: 1;

      > .el-tab-pane {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    }
  }

  > .save {
    position: absolute;
    right: 8px;
    top: 8px;
  }
}

.like-dialog {
  display: flex;
  flex-direction: column;
  gap: 12px;

  > .item {
    display: flex;
    align-items: center;
    gap: 16px;

    > .label {
      font-size: 14px;
      line-height: 24px;
      width: 70px;
    }

    > .value {
      flex: 1;

      > * {
        width: 100%;
      }
    }
  }
}
</style>
