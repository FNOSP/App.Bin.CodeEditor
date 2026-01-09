import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { dayjs, ElMessageBox } from 'element-plus'

import { FILE_MAP } from '@/utils/option'
import { getFileSuffix } from '@/utils/file'

import { useOpenStore } from './open'
import { useUserStore } from './user'

export interface ViewModel {
  path: string
  diff: boolean
  keep: boolean
  list: string[]
  wait: boolean
  size?: number
  date?: dayjs.Dayjs
}

export interface AddOption {
  history?: boolean
  keep?: ViewModel['keep']
  list?: ViewModel['list']
  size?: ViewModel['size']
  date?: ViewModel['date']
}

export const useEditorStore = defineStore('editor', () => {
  const open = useOpenStore()
  const user = useUserStore()

  const view = reactive<ViewModel[]>([])

  const active = ref('')

  const index = computed(() => view.findIndex((i) => i.path === active.value))

  const add = (path: ViewModel['path'], opt: AddOption = { keep: true, history: true, list: [] }) => {
    if (!path) {
      return
    }

    const keep = opt.keep === undefined ? true : opt.keep
    const history = opt.history === undefined ? true : opt.history
    const list = opt.list === undefined ? [] : opt.list

    const index = view.findIndex((i) => i.path === path)

    if (index === -1) {
      view.push({
        path,
        diff: false,
        keep,
        list,
        wait: user.cfg.fileBigWait > 0 && opt.size !== undefined && opt.size > user.cfg.fileBigWait,
        size: opt.size,
        date: opt.date,
      })
    }

    active.value = path

    open.show = undefined

    if (history) {
      open.addHistory({ path })
    }

    const fileType = FILE_MAP[getFileSuffix(path)]

    if (fileType) {
      if (fileType === 'img') {
        return
      }

      open.removeHistory(path)
    }
  }

  const remove = async (path: string, force = false) => {
    const index = view.findIndex((i) => i.path === path)
    const item = view[index]
    if (item) {
      if (item.diff && !force) {
        const value = await ElMessageBox.confirm('文件未保存，你的更改将丢失，确认关闭？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
        })
          .then(() => true)
          .catch(() => false)
        if (!value) {
          return
        }
      }

      view.splice(index, 1)

      if (path === active.value) {
        if (view[index]) {
          active.value = view[index].path
        } else {
          active.value = view[view.length - 1]?.path || ''
        }
      }
    }
  }

  return { active, index, view, add, remove }
})
