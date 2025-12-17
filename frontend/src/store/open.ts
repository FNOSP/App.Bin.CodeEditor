import { reactive, ref, toRaw } from 'vue'
import { defineStore } from 'pinia'

import localStorage from '@/utils/localStorage'

const key = 'PATH_HISTORY'

interface HistoryModel {
  path: string
}

type OpenType = 'file' | 'dir'

export const useOpenStore = defineStore('open', () => {
  const show = ref<OpenType>()
  const input = ref('')
  const history = reactive<HistoryModel[]>(localStorage.get(key) || [])

  const addHistory = (val: HistoryModel) => {
    if (!val) {
      return
    }

    removeHistory(val.path)

    history.unshift(val)

    localStorage.set(key, toRaw(history))
  }
  const removeHistory = (path: string) => {
    if (!path) {
      return
    }

    const index = history.findIndex((i) => i.path === path)

    if (index > -1) {
      history.splice(index, 1)

      localStorage.set(key, toRaw(history))
    }
  }
  const clearHistory = () => {
    history.splice(0, history.length)

    localStorage.set(key, toRaw(history))
  }

  return { input, show, history, addHistory, removeHistory, clearHistory }
})
