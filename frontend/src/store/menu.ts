import { ref } from 'vue'
import { defineStore } from 'pinia'

type MenuType = 'folder' | 'history'

const getDef = (): { [x in MenuType]: boolean } => ({ folder: false, history: false })

export const useMenuStore = defineStore('menu', () => {
  const open = ref<MenuType>()

  const initialized = ref(getDef())

  return {
    open,

    initialized,

    toggle: (key?: MenuType) => {
      if (key) {
        initialized.value[key] = true
      }

      open.value = key
    },
  }
})
