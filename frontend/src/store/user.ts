import { ref, toRaw, watch } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { cloneDeep, debounce } from 'lodash'

import localStorage from '@/utils/localStorage'
import { HOST, IS_DEV, APP_DIR_PATH } from '@/utils/env'

import { useLikeStore } from '@/store/like'

interface LikeModel {
  // 全局配置
  theme: string // 主题
  startOpen: boolean // 启动时询问
  leftWidth: number // 侧边栏宽度

  // 文件
  confirm: boolean // 保存二次确认
  fileMdView: boolean // MD打开默认预览
  fileAllOpen: boolean // Web端全文件支持
  fileBigWait: number // 多大文件暂停加载，0为不启用
  fileCameraUseConfirm: boolean // 切换快照时询问
  fileCameraUseDoSave: boolean // 切换快照立即保存
  fileEncodeFromOrg: boolean // 切换编码忽略编辑
  editorOption: {
    // 编辑器配置
    fontSize: number // 字体大小
    wordWrap: 'off' | 'on' // 自动换行
  }

  // 目录
  dir: string[] // 文件列表
  folderDefOpen: string // 自动打开目录
  folderNotOpenInQuery: boolean // 打开文件时不打开目录
  folderHidePrefix: string[] // 隐藏的文件前缀
}

const USER_CONFIG_PATH = `${APP_DIR_PATH}/config.json`

const dir = IS_DEV ? ['/Users/flex/Downloads'] : ['/vol1/1000']

const getDef = (): LikeModel => ({
  // 全局配置
  theme: 'vs-dark', // 主题
  startOpen: true, // 启动时询问
  leftWidth: 300, // 侧边栏宽度

  // 文件
  confirm: true, // 保存二次确认
  fileMdView: false, // md默认预览
  fileAllOpen: false, // Web端全文件支持
  fileBigWait: 50 * 1024 * 1024, // 多大文件暂停加载，0为不启用，默认50M
  fileCameraUseConfirm: true, // 切换快照时询问
  fileCameraUseDoSave: false, // 切换快照立即保存
  fileEncodeFromOrg: false, // 切换编码忽略编辑
  editorOption: {
    // 编辑器配置
    fontSize: 14, // 字体大小
    wordWrap: 'off', // 自动换行
  },

  // 目录
  dir: [...dir],
  folderDefOpen: dir[0]!, // 自动打开目录
  folderNotOpenInQuery: true, // 打开文件时不打开目录
  folderHidePrefix: ['.'], // 隐藏的文件前缀
})

// 这是旧的偏好设置，移入用户配置之中
const key = 'like_v1'

export const useUserStore = defineStore('user', () => {
  const like = useLikeStore()

  const initialized = ref(false)

  const org = ref(Object.assign({}, getDef(), localStorage.get(key)))
  const cfg = ref(Object.assign({}, getDef(), localStorage.get(key)))

  const load = async () => {
    const { data: result1 } = await axios.get(HOST, {
      params: { _api: 'read', path: USER_CONFIG_PATH },
    })

    if (result1.code === 404) {
      await update()
    } else {
      org.value = Object.assign(org.value, cloneDeep(result1) as LikeModel)
      cfg.value = Object.assign(cfg.value, cloneDeep(result1) as LikeModel)
    }

    like.cfg.folderActive = cfg.value.folderDefOpen || cfg.value.dir[0] || ''

    initialized.value = true
  }

  const update = debounce(async () => {
    await axios.post(
      HOST,
      {
        encode: 'utf-8',
        path: USER_CONFIG_PATH,
        value: JSON.stringify({ ...cfg.value, folderDefOpen: cfg.value.folderDefOpen || '' }),
        force: 1,
      },
      {
        params: { _api: 'save' },
      },
    )

    org.value = cloneDeep(toRaw(cfg.value))
  }, 300)

  watch(
    () => cfg.value.fileAllOpen,
    () => {
      if (!initialized.value) {
        return
      }

      axios.post(HOST, { open: Number(cfg.value.fileAllOpen) }, { params: { _api: 'def' } })
    },
  )

  return { initialized, cfg, load, update }
})
