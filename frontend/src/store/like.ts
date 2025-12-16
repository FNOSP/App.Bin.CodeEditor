import { ref } from 'vue'
import { defineStore } from 'pinia'
import { debounce } from 'lodash'

import localStorage from '@/utils/localStorage'

interface LikeModel {
  theme: string
  confirm: boolean
  folderWidth: number
  editorOption: {
    fontSize: number
    wordWrap: 'off' | 'on'
  }
}

const getDef = (): LikeModel => ({
  theme: 'vs-dark',
  confirm: true,
  folderWidth: 240,
  editorOption: {
    fontSize: 14,
    wordWrap: 'off',
  },
})

const key = 'like_v1'

export const useLikeStore = defineStore('like', () => {
  const open = ref(false)

  const cfg = ref(Object.assign({}, getDef(), localStorage.get(key)))

  return {
    open,

    cfg,

    saveCfg: debounce(() => {
      localStorage.set(key, {
        theme: cfg.value.theme,
        confirm: cfg.value.confirm,
        folderWidth: cfg.value.folderWidth,
        editorOption: {
          fontSize: cfg.value.editorOption.fontSize,
          wordWrap: cfg.value.editorOption.wordWrap,
        },
      })
    }, 300),

    resetCfg: () => {
      cfg.value = getDef()
    },
  }
})
