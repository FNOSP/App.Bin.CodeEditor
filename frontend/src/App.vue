<template>
  <template v-if="user.initialized">
    <ViewMenu />
    <ViewLeft />
    <ViewRight />

    <DialogLike />
    <DialogOpen />
    <DialogCamera />
  </template>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import ViewMenu from '@/layout/ViewMenu.vue'
import ViewLeft from '@/layout/ViewLeft/LeftBox.vue'
import ViewRight from '@/layout/ViewRight/RightBox.vue'
import DialogLike from '@/layout/DialogLike.vue'
import DialogOpen from '@/layout/DialogOpen.vue'
import DialogCamera from '@/layout/DialogCamera.vue'

import { useUserStore } from '@/store/user'

const user = useUserStore()

onMounted(() => {
  user.load()
})
</script>

<style lang="scss">
html,
body {
  height: 100%;
}

body {
  background-color: var(--el-bg-color);
}

#app {
  height: 100%;
  display: flex;
  user-select: none;
}
</style>
