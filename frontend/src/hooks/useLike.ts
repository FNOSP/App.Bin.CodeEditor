import { reactive, ref, toRaw, watch, watchEffect } from 'vue'

import localStorage from '@/utils/localStorage'
import { THEME_OPTIONS } from '@/utils/option'

export interface LikeModel {
  theme: string
  fontSize: number
  confirm: boolean
}

const defLike: LikeModel = {
  theme: 'vs-dark',
  fontSize: 14,
  confirm: true,
}

const key = 'like_v1'

export default function useCode() {
  const open = ref(false)

  const like = reactive<LikeModel>(Object.assign({}, defLike, localStorage.get(key)))

  watch(like, () => {
    localStorage.set(key, toRaw(like))
  })

  watchEffect(() => {
    const dark = THEME_OPTIONS.find((i) => i.value === like.theme)?.dark
    document.documentElement.className = dark ? 'dark' : ''
  })

  const resetLike = () => {
    Object.assign(like, { ...defLike })
  }

  return { open, like, resetLike }
}
