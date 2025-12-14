import { reactive, ref, type Reactive } from 'vue'
import { defineStore } from 'pinia'

import localStorage from '@/utils/localStorage'
import { ref2model, reactive2model } from '@/utils/store2model'

interface LikeModel {
  theme: string
  confirm: boolean
  editorOption: {
    fontSize: number
    wordWrap: 'off' | 'on'
  }
}

const def: LikeModel = {
  theme: 'vs-dark',
  confirm: true,
  editorOption: {
    fontSize: 14,
    wordWrap: 'off',
  },
}

const key = 'like_v1'

export const useLikeStore = defineStore('like', () => {
  const open = ref(false)

  const cfg: Reactive<LikeModel> = reactive(Object.assign({}, def, localStorage.get(key)))

  const resetCfg = () => {
    Object.assign(cfg, def)
  }

  return {
    open: ref2model(open),

    cfg: reactive2model(cfg, {
      onSet: () => {
        // 手动设置，避免脏数据
        localStorage.set(key, {
          theme: cfg.theme,
          confirm: cfg.confirm,
          editorOption: {
            fontSize: cfg.editorOption.fontSize,
            wordWrap: cfg.editorOption.wordWrap,
          },
        })
      },
    }),

    resetCfg,
  }
})
