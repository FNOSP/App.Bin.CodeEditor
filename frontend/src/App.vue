<template>
  <el-tabs
    class="view"
    v-model="active"
    type="card"
    addable
    :closable="view.length > 1"
    @edit="viewEdit"
  >
    <el-tab-pane v-for="item in view" :key="item.path" :name="item.path">
      <template #label>
        <el-tooltip :content="item.path">
          <div>{{ item.path.split('/').pop() }}</div>
        </el-tooltip>
      </template>

      <MonacoEditor
        :path="item.path"
        :like="like"
        @like="() => (open = !open)"
        @diff="(v) => (item.diff = v)"
      />
    </el-tab-pane>
  </el-tabs>

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
          <el-select v-model="like.theme" style="width: 150px" size="small">
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
          <el-input-number v-model="like.fontSize" :min="8" :max="100" />
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
import MonacoEditor from './components/MonacoEditor.vue'

import { THEME_OPTIONS } from '@/utils/option'

import useLike from '@/hooks/useLike'
import usePath from '@/hooks/usePath'

const { open, like, resetLike } = useLike()
const { view, active, add, remove } = usePath()

const viewEdit = (v: string, action: 'remove' | 'add') => {
  if (action === 'add') {
    add()
  } else {
    remove(v)
  }
}
</script>

<style lang="scss">
html,
body,
#app {
  position: relative;
  height: 100%;

  > .view {
    height: 100%;
    display: flex;
    flex-direction: column;

    > .el-tabs__header {
      height: 40px;
      padding-right: 56px;
      margin: 0;

      .el-tabs__nav {
        border-top: none;
        border-radius: 0;
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
}

.like-dialog {
  display: flex;
  flex-direction: column;
  gap: 12px;

  > .item {
    display: flex;
    align-items: center;
    gap: 12px;

    > .label {
      font-size: 14px;
      line-height: 24px;
      width: 100px;
    }

    > .value {
      flex: 1;
    }
  }
}
</style>
