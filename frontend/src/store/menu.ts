import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const open = ref({ folder: false })

  return {
    open,
  }
})
