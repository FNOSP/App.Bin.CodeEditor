<template>
  <el-dialog v-model="open" title="打开" width="500">
    <div class="path-dialog">
      <div class="open">
        <div class="title">文件</div>

        <el-input v-model="input" placeholder="请输入文件路径（不存在的文件编辑后可直接新增）">
          <template #append>
            <el-button @click="openPath">确认</el-button>
          </template>
        </el-input>
      </div>

      <div class="history">
        <div class="title">历史记录</div>
        <div class="list" v-if="history.length">
          <div class="item" v-for="item in history" :key="item.path">
            <div class="i" @click="emit('open', item.path)">{{ item.path }}</div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{ history: { path: string }[] }>()

const emit = defineEmits<{ (e: 'open', v: string): void }>()

const open = defineModel('open')

const input = ref('')

const openPath = () => {
  emit('open', input.value)
  input.value = ''
}
</script>

<style lang="scss" scoped>
.path-dialog {
  display: flex;
  flex-direction: column;
  gap: 24px;

  > div {
    > .title {
      font-size: 12px;
      margin-bottom: 12px;
      color: var(--el-text-color-placeholder);
    }
  }

  > .history {
    > .list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      height: 200px;
      overflow: auto;

      > .item {
        display: flex;
        align-items: center;

        > .i {
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
