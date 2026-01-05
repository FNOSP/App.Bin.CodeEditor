<template>
  <el-dialog v-model="camera.show" :title="`文件快照：${camera.path}`" width="600">
    <div class="camera-dialog">
      <div>111</div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useCameraStore } from '@/store/camera2'

const camera = useCameraStore()
</script>

<style lang="scss" scoped></style>
