<template>
  <ViewMenu />

  <ViewFolder v-show="menu.open.folder" />

  <ViewEditor />

  <DialogLike />
  <DialogOpen />
</template>

<script setup lang="ts">
import ViewMenu from '@/layout/ViewMenu.vue'
import ViewFolder from '@/layout/ViewFolder.vue'
import ViewEditor from '@/layout/ViewEditor.vue'
import DialogLike from '@/layout/DialogLike.vue'
import DialogOpen from '@/layout/DialogOpen.vue'

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
  user-select: none;
}
</style>
