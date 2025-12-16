<template>
  <div id="folder-view" :style="{ width: `${like.cfg.folderWidth}px` }">
    <div class="head">
      <div class="title">目录</div>

      <el-icon><CaretRight /></el-icon>

      <el-icon><CaretRight /></el-icon>
    </div>

    <div class="content">
      <div class="list">123</div>
      <!-- <div class="tree">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
      </div> -->
    </div>

    <ClickMove @move="(v) => (like.cfg.folderWidth += v.x)" />
  </div>
</template>

<script lang="ts" setup>
import { CaretRight } from '@element-plus/icons-vue'

import ClickMove from '@/components/ClickMove.vue'

import { useLikeStore } from '@/store/like'

const like = useLikeStore()
</script>

<style lang="scss">
#folder-view {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--el-border-color);

  > .head {
    display: flex;
    align-items: center;
    height: 40px;
    box-sizing: border-box;
    border-bottom: 1px solid var(--el-border-color);
  }

  > .content {
    position: relative;
    flex: 1;

    > .list {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      overflow: auto;
    }
  }

  > .click-move {
    position: absolute;
    top: 40px;
    bottom: 0;
    right: 0;
    width: 7px;
    transform: translateX(4px);
    cursor: e-resize;

    &:hover {
      background-color: var(--el-text-color-placeholder);
    }
  }
}
</style>
