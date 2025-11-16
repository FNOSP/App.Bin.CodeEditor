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
        @like="() => (open = !open)"
        @diff="(v) => (item.diff = v)"
      />
    </el-tab-pane>

    <el-tab-pane :name="-1" disabled>
      <template #label>
        <div class="add" @click="add()">
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

  <el-dialog v-model="open" title="偏好设置" width="300">
    <div class="like-dialog">
      <div class="item">
        <div class="label">保存确认</div>
        <div class="value">
          <el-switch v-model="like.confirm" inline-prompt />
        </div>
      </div>

      <div class="item">
        <div class="label">主题样式</div>
        <div class="value">
          <el-select v-model="like.theme" size="small">
            <el-option
              v-for="item in THEME_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <div class="item">
        <div class="label">字体大小</div>
        <div class="value">
          <el-input-number v-model="like.fontSize" :min="8" :max="100" size="small" />
        </div>
      </div>
    </div>

    <template #footer>
      <div style="display: flex; align-items: center; margin-top: 32px">
        <el-button size="small" type="danger" @click="resetLike()">恢复默认</el-button>

        <div style="flex: 1"></div>

        <div style="font-size: 12px; color: #999">修改实时生效，且进行缓存</div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

import MonacoEditor from './components/MonacoEditor.vue'

import { THEME_OPTIONS } from '@/utils/option'

import useLike from '@/hooks/useLike'
import usePath from '@/hooks/usePath'

const { open, like, resetLike } = useLike()
const { view, active, add, remove } = usePath()

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
