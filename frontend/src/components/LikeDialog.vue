<template>
  <el-dialog v-model="open" title="偏好设置" width="300">
    <div class="like-dialog" v-if="like">
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
          <el-input-number v-model="like.editorOption.fontSize" :min="8" :max="100" size="small" />
        </div>
      </div>

      <div class="item">
        <div class="label">自动换行</div>
        <div class="value">
          <el-switch
            v-model="like.editorOption.wordWrap"
            inline-prompt
            active-value="on"
            inactive-value="off"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div style="display: flex; align-items: center; margin-top: 32px">
        <el-button size="small" type="danger" @click="emit('reset')">恢复默认</el-button>

        <div style="flex: 1"></div>

        <div style="font-size: 12px; color: var(--el-text-color-placeholder)">
          修改实时生效，且进行缓存
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { THEME_OPTIONS } from '@/utils/option'

import { type LikeModel } from '@/hooks/useLike'

const emit = defineEmits<{ (e: 'reset'): void }>()

const open = defineModel('open')

const like = defineModel<LikeModel>('like')
</script>
