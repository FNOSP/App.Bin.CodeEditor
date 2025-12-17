<template>
  <ViewMenu />
  <ViewLeft />
  <ViewEditor />

  <DialogLike />
  <DialogOpen />
</template>

<script setup lang="ts">
import ViewMenu from '@/layout/ViewMenu.vue'
import ViewLeft from '@/layout/ViewLeft/LeftBox.vue'
import ViewEditor from '@/layout/ViewEditor.vue'
import DialogLike from '@/layout/DialogLike.vue'
import DialogOpen from '@/layout/DialogOpen.vue'
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
