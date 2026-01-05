<template>
  <div id="ment-view">
    <div class="item" :class="{ active: menu.open === 'folder' }" @click="menu.toggle('folder')">
      <el-icon><Folder /></el-icon>
    </div>

    <div class="item" :class="{ active: menu.open === 'history' }" @click="menu.toggle('history')">
      <el-icon><Timer /></el-icon>
    </div>

    <div style="flex: 1"></div>

    <el-tooltip content="独立窗口" placement="right">
      <div class="item" @click="windowOpen()">
        <el-icon><Notification /></el-icon>
      </div>
    </el-tooltip>

    <el-tooltip content="偏好设置" placement="right">
      <div class="item" @click="like.open = true">
        <el-icon><Setting /></el-icon>
      </div>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { Folder, Timer, Notification, Setting } from '@element-plus/icons-vue'

import { useMenuStore } from '@/store/menu'
import { useLikeStore } from '@/store/like'

const menu = useMenuStore()
const like = useLikeStore()

onMounted(() => {
  if (like.cfg.folderActive) {
    menu.toggle('folder')
  }
})

const windowOpen = () => window.open('./')
</script>

<style lang="scss">
#ment-view {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 40px;
  border-right: 1px solid var(--el-border-color);

  > .item {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--el-text-color-regular);
    transition: all 0.3s;

    &:hover {
      color: var(--el-color-primary-light-5);
    }

    &.active {
      color: var(--el-color-primary);
    }
  }
}
</style>
