<template>
  <MonacoEditor v-if="defInfo.path" :path="defInfo.path" :like="like" @like="open = !open" />

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
import { onBeforeMount, reactive } from 'vue'
import { ElMessageBox } from 'element-plus'

import MonacoEditor from './components/MonacoEditor.vue'

import { THEME_OPTIONS } from '@/utils/option'

import useLike from '@/hooks/useLike'

const { open, like, resetLike } = useLike()

const defInfo = reactive({ path: '' })

onBeforeMount(async () => {
  defInfo.path = await getPath()
})

const getPath = async (): Promise<string> => {
  const query = new URLSearchParams(window.location.search).get('path') || ''
  if (query) {
    return query
  }

  return await ElMessageBox.prompt('部分文件可在文件管理中双击文件进行编辑，详见应用介绍', '请输入文件路径', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then(({ value }) => {
    if (value) {
      window.location.assign(`/?path=${value}`)
      return ''
    } else {
      return value
    }
  })
}
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;

  > .header,
  > .footer {
    height: 32px;
    display: flex;
    align-items: center;
    gap: 4px;
    background-color: #1c1c1c;
    padding: 0 12px;

    > * {
      margin: 0;
    }
  }

  > .header {
    border-bottom: solid 1px rgba(255, 255, 255, 0.2);

    > .title {
      font-size: 14px;
      line-height: 32px;
      color: #fff;
    }
  }

  > .footer {
    border-top: solid 1px rgba(255, 255, 255, 0.2);

    > .developed {
      font-size: 12px;
      line-height: 32px;
      color: gray;
    }
  }

  > .editor {
    position: relative;
    flex: 1;

    > .content {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
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
