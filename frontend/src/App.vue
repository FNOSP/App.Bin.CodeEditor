<template>
  <FolderView />

  <EditorView />

  <LikeDialog />
</template>

<script setup lang="ts">
import FolderView from '@/layout/FolderView.vue'
import EditorView from '@/layout/EditorView.vue'

import LikeDialog from '@/components/LikeDialog.vue'
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
