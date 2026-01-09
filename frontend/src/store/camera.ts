import { ref } from 'vue'
import { defineStore } from 'pinia'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'

import api from '@/utils/api'
import { APP_DIR_PATH } from '@/utils/env'
import { getKey, readPath, saveFile } from '@/utils/file'

import { useUserStore } from './user'

const CAMERA_DIR_PATH = `${APP_DIR_PATH}/camera`

interface OpenModel {
  path: string
  value: string
  callback?: (v: string) => void
}

export const useCameraStore = defineStore('camera', () => {
  const user = useUserStore()

  const show = ref(false)

  const input = ref('')

  const option = ref<OpenModel>()

  const data = ref<DirModel['files']>([])

  const open = (opt: { path: string; value: string; callback?: (v: string) => void }) => {
    option.value = opt
    show.value = true
    load()
  }

  const load = async () => {
    if (!option.value) {
      data.value = []
      return
    }

    const { data: result } = await readPath<{ code: number; data: DirModel }>({
      path: `${CAMERA_DIR_PATH}/${getKey(option.value.path)}`,
      dir: true,
    })

    if (result.code === 404) {
      data.value = []
    } else {
      result.data.files.sort((i, j) => (dayjs(j.createDate) > dayjs(i.createDate) ? 1 : -1))

      data.value = result.data.files
    }
  }

  const add = async () => {
    if (!option.value || !input.value) {
      return
    }

    if (data.value.find((i) => i.name.replace(/\.txt$/, '') === input.value)) {
      ElMessage({ type: 'error', message: '快照说明不能相同' })
      return
    }

    await saveFile({
      path: `${CAMERA_DIR_PATH}/${getKey(option.value.path)}/${input.value}.txt`,
      force: true,
      file: new Blob([new TextEncoder().encode(option.value.value)]),
    })

    input.value = ''

    await load()
  }

  const del = async (index: number) => {
    if (!option.value) {
      return
    }

    const item = data.value[index]

    if (!item) {
      return
    }

    try {
      await ElMessageBox.confirm(`确定要删除【${item.name.replace(/\.txt$/, '')}】快照吗？删除后将无法恢复`, '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'info',
      })
    } catch {
      return
    }

    const filePath = `${CAMERA_DIR_PATH}/${getKey(option.value.path)}/${item.name}`

    await api.post('/del', { path: filePath })

    ElMessage({ type: 'success', message: '操作成功' })

    data.value.splice(index, 1)
  }

  const usage = async (index: number) => {
    if (!option.value) {
      return
    }

    const item = data.value[index]

    if (!item) {
      return
    }

    if (user.cfg.fileCameraUseConfirm) {
      try {
        await ElMessageBox.confirm(`确定要使用【${item.name.replace(/\.txt$/, '')}】快照吗？当前窗口内容将会被覆盖`, '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'info',
        })
      } catch {
        return
      }
    }

    const result = await readPath({ path: `${CAMERA_DIR_PATH}/${getKey(option.value.path)}/${item.name}`, responseType: 'text' })

    option.value.callback?.(result.data)

    show.value = false
  }

  return { show, input, data, open, add, del, usage }
})
