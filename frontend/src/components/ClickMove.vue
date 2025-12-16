<template>
  <div class="click-move" @mousedown="onDown">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

const $emit = defineEmits<{ move: [v: { x: number; y: number }] }>()

const move = ref({ x: -1, y: -1 })

const onDown = (e: MouseEvent) => {
  move.value = { x: e.clientX, y: e.clientY }
  document.body.style.cursor = 'e-resize'
}

const onMove = (e: MouseEvent) => {
  if (move.value.x > -1 && move.value.y > -1) {
    $emit('move', { x: e.clientX - move.value.x, y: e.clientY - move.value.y })
    move.value = { x: e.clientX, y: e.clientY }
  }
}

const onUp = () => {
  move.value = { x: -1, y: -1 }
  document.body.style.cursor = 'default'
}

onMounted(() => {
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
})
</script>
