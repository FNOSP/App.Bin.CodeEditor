import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { debounce } from 'lodash'

import localStorage from '@/utils/localStorage'
import { HOST, IS_DEV, USER_CONFIG_PATH } from '@/utils/env'

import { useLikeStore } from '@/store/like'

interface LikeModel {
  // 全局配置
  theme: string // 主题
  startOpen: boolean // 启动时询问
  leftWidth: number // 侧边栏宽度

  // 文件
  confirm: boolean // 保存二次确认
  fileMdView: boolean // MD打开默认预览
  editorOption: {
    // 编辑器配置
    fontSize: number // 字体大小
    wordWrap: 'off' | 'on' // 自动换行
  }

  // 目录
  dir: string[] // 文件列表
  folderDefOpen: string // 默认开启目录
  folderHidePrefix: string[] // 隐藏的文件前缀
}

const getDef = (): LikeModel => ({
  // 全局配置
  theme: 'vs-dark', // 主题
  startOpen: true, // 启动时询问
  leftWidth: 300, // 侧边栏宽度

  // 文件
  confirm: true, // 保存二次确认
  fileMdView: false, // md默认预览
  editorOption: {
    // 编辑器配置
    fontSize: 14, // 字体大小
    wordWrap: 'off', // 自动换行
  },

  // 目录
  dir: IS_DEV ? ['/Users/flex/Downloads'] : ['/vol1/1000'],
  folderDefOpen: '', // 默认开启目录
  folderHidePrefix: ['.'], // 隐藏的文件前缀
})

// 这是旧的偏好设置，移入用户配置之中
const key = 'like_v1'

export const useUserStore = defineStore('user', () => {
  const like = useLikeStore()

  const initialized = ref(false)

  const cfg = ref(Object.assign({}, getDef(), localStorage.get(key)))

  const load = async () => {
    const { data: result1 } = await axios.get(HOST, {
      params: { _api: 'read', path: USER_CONFIG_PATH },
    })

    if (result1.code === 404) {
      await update()
    } else {
      cfg.value = Object.assign(cfg.value, result1 as LikeModel)
    }

    like.cfg.folderActive = cfg.value.folderDefOpen || cfg.value.dir[0] || ''

    initialized.value = true
  }

  const update = debounce(async () => {
    await axios.post(
      HOST,
      {
        encode: 'utf8',
        path: USER_CONFIG_PATH,
        value: JSON.stringify(cfg.value),
        force: 1,
      },
      {
        params: { _api: 'save' },
      },
    )
  }, 300)

  return { initialized, cfg, load, update }
})
