import { ref } from 'vue'
import { defineStore } from 'pinia'

type MenuType = 'folder'

export const useMenuStore = defineStore('menu', () => {
  const open = ref<{ [x in MenuType]: boolean }>({ folder: false })

  const initialized = ref<{ [x in MenuType]: boolean }>({ folder: false })

  return {
    open,

    initialized,

    toggle: (key: MenuType, value?: boolean) => {
      open.value[key] = value === undefined ? !open.value[key] : value

      if (open.value[key]) {
        initialized.value[key] = true
      }
    },
  }
})
