<template>
  <el-dialog v-model="open" title="偏好设置" width="500">
    <el-tabs default-value="def" class="like-dialog">
      <el-tab-pane label="常规" name="def">
        <div class="item">
          <div class="label">主题样式</div>
          <div class="value">
            <el-select v-model="cfg.theme" size="small">
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
          <div class="label">启动时询问</div>
          <div class="value">
            <el-switch v-model="cfg.startOpen" />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="文件" name="editor">
        <div class="item">
          <div class="label">保存时确认</div>
          <div class="value">
            <el-switch v-model="cfg.confirm" />
          </div>
        </div>

        <div class="item">
          <div class="label">字体大小</div>
          <div class="value">
            <el-input-number v-model="cfg.editorOption.fontSize" :min="8" :max="100" size="small" />
          </div>
        </div>

        <div class="item">
          <div class="label">自动换行</div>
          <div class="value">
            <el-switch
              v-model="cfg.editorOption.wordWrap"
              inline-prompt
              active-value="on"
              inactive-value="off"
            />
          </div>
        </div>

        <div class="item">
          <div class="label">MD 打开时预览</div>
          <div class="value">
            <el-switch v-model="cfg.fileMdView" />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="目录" name="folder">
        <div class="item">
          <div class="label">默认打开</div>
          <div class="value">
            <el-select
              v-model="cfg.folderDefOpen"
              size="small"
              clearable
              placeholder="启动时默认打开某个目录"
            >
              <el-option v-for="item in user.cfg.dir" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
        </div>

        <div class="item">
          <div class="label">隐藏前缀文件</div>
          <div class="value">
            <el-select
              v-model="cfg.folderHidePrefix"
              size="small"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="输入后回车即可添加"
            >
            </el-select>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'

import { THEME_OPTIONS } from '@/utils/option'

import { useUserStore } from '@/store/user'
import { useLikeStore } from '@/store/like'

const user = useUserStore()
const like = useLikeStore()

const { open } = storeToRefs(like)
const { cfg } = storeToRefs(user)

watchEffect(() => {
  document.documentElement.className = THEME_OPTIONS.find((i) => i.value === cfg.value.theme)?.dark
    ? 'dark'
    : ''
})

watch(cfg, user.update, { deep: true })
</script>

<style lang="scss" scoped>
.like-dialog {
  > .el-tabs__content {
    > .el-tab-pane {
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
          width: 100px;
          text-align: right;
        }

        > .value {
          flex: 1;
        }
      }
    }
  }
}
</style>
