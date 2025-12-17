import { ref } from 'vue'
import { defineStore } from 'pinia'

import { IS_DEV } from '@/utils/env'

import { useLikeStore } from '@/store/like'

interface LikeModel {
  dir: string[]
}

const getDef = (): LikeModel => ({
  dir: IS_DEV ? ['/Users/flex/Downloads', '/Users/flex/Downloads/code.editor'] : ['/vol1/1000'],
})

export const useUserStore = defineStore('user', () => {
  const like = useLikeStore()

  const initialized = ref(false)

  const cfg = ref(getDef())

  const load = async () => {
    // todo api

    like.cfg.folderActive = like.cfg.folderDefOpen || cfg.value.dir[0] || ''

    initialized.value = true
  }

  return {
    initialized,

    cfg,

    load,
  }
})
