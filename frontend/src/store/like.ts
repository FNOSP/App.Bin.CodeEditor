import { ref } from 'vue'
import { defineStore } from 'pinia'

interface LikeModel {
  folderActive: string
}

const getDef = (): LikeModel => ({
  folderActive: '', // 当前打开的目录
})

export const useLikeStore = defineStore('like', () => {
  const open = ref(false)

  const cfg = ref(Object.assign({}, getDef()))

  return { open, cfg }
})
