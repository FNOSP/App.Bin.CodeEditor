import { ref } from 'vue'
import { defineStore } from 'pinia'
import { debounce } from 'lodash'

import localStorage from '@/utils/localStorage'

interface LikeModel {
  folderActive: string
}

const getDef = (): LikeModel => ({
  // 目录
  folderActive: '', // 当前打开的目录
})

const key = 'like_v1'

export const useLikeStore = defineStore('like', () => {
  const open = ref(false)

  const cfg = ref(Object.assign({}, getDef(), localStorage.get(key)))

  return {
    open,

    cfg,

    saveCfg: debounce(() => {}, 300),

    resetCfg: () => {
      cfg.value = getDef()
    },
  }
})
