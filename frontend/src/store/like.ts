import { ref } from 'vue'
import { defineStore } from 'pinia'
import { debounce } from 'lodash'

import localStorage from '@/utils/localStorage'

interface LikeModel {
  theme: string
  startOpen: boolean
  leftWidth: number
  confirm: boolean
  fileMdView: boolean
  folderActive: string
  folderDefOpen: string
  folderHidePrefix: string[]
  editorOption: {
    fontSize: number
    wordWrap: 'off' | 'on'
  }
}

const getDef = (): LikeModel => ({
  // 全局配置
  theme: 'vs-dark',
  startOpen: true,
  leftWidth: 300, // 侧边栏宽度

  // 安全性
  confirm: true, // 保存二次确认

  // 文件
  fileMdView: false, // md默认预览

  // 目录
  folderActive: '', // 当前打开的目录
  folderDefOpen: '', // 默认开启目录
  folderHidePrefix: ['.'], // 隐藏的文件前缀

  // 编辑器
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
        startOpen: cfg.value.startOpen,
        leftWidth: cfg.value.leftWidth,
        confirm: cfg.value.confirm,
        fileMdView: cfg.value.confirm,
        folderDefOpen: cfg.value.folderDefOpen,
        folderHidePrefix: cfg.value.folderHidePrefix,
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
