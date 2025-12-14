<template>
  <el-dialog v-model="like.open" title="偏好设置" width="300">
    <div class="like-dialog" v-if="like">
      <div class="item">
        <div class="label">保存确认</div>
        <div class="value">
          <el-switch v-model="like.cfg.confirm" inline-prompt />
        </div>
      </div>

      <div class="item">
        <div class="label">主题样式</div>
        <div class="value">
          <el-select v-model="like.cfg.theme" size="small">
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
          <el-input-number
            v-model="like.cfg.editorOption.fontSize"
            :min="8"
            :max="100"
            size="small"
          />
        </div>
      </div>

      <div class="item">
        <div class="label">自动换行</div>
        <div class="value">
          <el-switch
            v-model="like.cfg.editorOption.wordWrap"
            inline-prompt
            active-value="on"
            inactive-value="off"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div style="display: flex; align-items: center; margin-top: 32px">
        <el-button size="small" type="danger" @click="like.resetCfg()">恢复默认</el-button>

        <div style="flex: 1"></div>

        <div style="font-size: 12px; color: var(--el-text-color-placeholder)">
          修改实时生效，且进行缓存
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { watchEffect } from 'vue'

import { THEME_OPTIONS } from '@/utils/option'

import { useLikeStore } from '@/store/like'

const like = useLikeStore()

watchEffect(() => {
  document.documentElement.className = THEME_OPTIONS.find((i) => i.value === like.cfg.theme)?.dark
    ? 'dark'
    : ''
})
</script>

<style lang="scss" scoped>
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
