<template>
  <div class="pdf-edit">
    <iframe class="i" :src="$props.src" frameborder="0"></iframe>
  </div>
</template>

<script lang="ts" setup>
const $props = defineProps<{ src: string }>()
</script>

<style lang="scss" scoped>
.pdf-edit {
  height: 100%;

  > .i {
    height: 100%;
    width: 100%;
  }
}
</style>
