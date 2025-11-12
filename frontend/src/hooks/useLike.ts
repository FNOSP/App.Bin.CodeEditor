import { reactive, ref, toRaw, watch } from 'vue'

import localStorage from '@/utils/localStorage'

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

  const like = reactive<LikeModel>(localStorage.get(key) || defLike)

  watch(like, () => {
    localStorage.set(key, toRaw(like))
  })

  const resetLike = () => {
    Object.assign(like, { ...defLike })
  }

  return { open, like, resetLike }
}
