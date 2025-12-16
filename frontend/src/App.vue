<template>
  <MenuView />

  <FolderView v-show="menu.open.folder" />

  <EditorView />

  <LikeDialog />
  <OpenDialog />
</template>

<script setup lang="ts">
import MenuView from '@/layout/MenuView.vue'
import FolderView from '@/layout/FolderView.vue'
import EditorView from '@/layout/EditorView.vue'

import LikeDialog from '@/components/LikeDialog.vue'
import OpenDialog from '@/components/OpenDialog.vue'

import { useMenuStore } from './store/menu'

const menu = useMenuStore()
</script>

<style lang="scss">
html,
body {
  height: 100%;
}

#app {
  height: 100%;
  display: flex;
}
</style>
