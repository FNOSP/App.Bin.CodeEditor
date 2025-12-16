<template>
  <div id="ment-view">
    <div class="item" :class="{ active: menu.open.folder }" @click="menu.toggle('folder')">
      <el-icon><Folder /></el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMenuStore } from '@/store/menu'
import { Folder } from '@element-plus/icons-vue'

const menu = useMenuStore()
</script>

<style lang="scss">
#ment-view {
  position: relative;
  z-index: 10;
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
