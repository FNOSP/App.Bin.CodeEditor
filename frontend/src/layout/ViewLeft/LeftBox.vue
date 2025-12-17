<template>
  <div id="left-view" :style="{ width: `${like.cfg.leftWidth}px` }" v-show="menu.open">
    <ViewFolder v-if="menu.initialized.folder" v-show="menu.open === 'folder'" />

    <ViewHistory v-if="menu.initialized.history" v-show="menu.open === 'history'" />

    <ClickMove @move="(v) => changeFolderWidth(v.x)" />
  </div>
</template>

<script lang="ts" setup>
import ClickMove from '@/components/ClickMove.vue'

import ViewFolder from './ViewFolder.vue'
import ViewHistory from './ViewHistory.vue'

import { useLikeStore } from '@/store/like'
import { useMenuStore } from '@/store/menu'

const menu = useMenuStore()
const like = useLikeStore()

const changeFolderWidth = (v: number) => {
  const newVal = like.cfg.leftWidth + v

  if (newVal > 600 || newVal < 200) {
    return
  }

  like.cfg.leftWidth = newVal
}
</script>

<style lang="scss">
#left-view {
  position: relative;
  z-index: 5;
  border-right: 1px solid var(--el-border-color);

  > .view {
    display: flex;
    flex-direction: column;
    height: 100%;

    > .head {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 40px;
      box-sizing: border-box;
      border-bottom: 1px solid var(--el-border-color);
      padding: 0 12px;

      > .title {
        flex: 1;
        font-size: 12px;
        color: var(--el-text-color-regular);
      }

      > .icon {
        color: var(--el-text-color-regular);
        cursor: pointer;
      }
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
