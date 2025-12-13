import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

import localStorage from '@/utils/localStorage'
import { THEME_OPTIONS } from '@/utils/option'
import { ref2model } from '@/utils/store2model'

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

  const cfg: Ref<LikeModel> = ref(Object.assign({}, def, localStorage.get(key)))

  const changeTheme = () => {
    document.documentElement.className = THEME_OPTIONS.find((i) => i.value === cfg.value.theme)
      ?.dark
      ? 'dark'
      : ''
  }

  const changeCfg = (opt: Partial<LikeModel>) => {
    cfg.value = Object.assign(cfg.value, opt)

    // 手动设置，避免脏数据
    localStorage.set(key, {
      theme: cfg.value.theme,
      confirm: cfg.value.confirm,
      editorOption: {
        fontSize: cfg.value.editorOption.fontSize,
        wordWrap: cfg.value.editorOption.wordWrap,
      },
    })
  }

  const resetCfg = () => {
    changeCfg(def)
  }

  return {
    open: ref2model(open),

    cfg,

    changeTheme,
    changeCfg,
    resetCfg,
  }
})
