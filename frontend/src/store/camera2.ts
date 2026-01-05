import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCameraStore = defineStore('camera', () => {
  const show = ref(false)

  const path = ref('')

  return {
    show,

    path,

    open: (v: string) => {
      show.value = true
      path.value = v
    },
  }
})
