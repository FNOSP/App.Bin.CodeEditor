import { ref } from 'vue'
import { defineStore } from 'pinia'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

import { HOST, APP_DIR_PATH } from '@/utils/env'
import { getKey } from '@/utils/file'

const CAMERA_DIR_PATH = `${APP_DIR_PATH}/camera`

interface ValueModel {
  name: string
  size: number
  createDate: string
}

interface OpenModel {
  path: string
  value: string
  encode: string
  callback?: (v: string) => void
}

export const useCameraStore = defineStore('camera', () => {
  const show = ref(false)

  const option = ref<OpenModel>()

  const data = ref<ValueModel[]>([])

  const open = (opt: { path: string; value: string; encode: string; callback?: (v: string) => void }) => {
    option.value = opt
    show.value = true
    load()
  }

  const load = async () => {
    if (!option.value) {
      data.value = []
      return
    }

    const filePath = `${CAMERA_DIR_PATH}/${getKey(option.value.path)}`

    const { data: result } = await axios.get<{ code: number; data: { files: ValueModel[] } }>(HOST, {
      params: { _api: 'dir', path: filePath },
    })

    if (result.code === 404) {
      data.value = []
    } else {
      result.data.files.sort((i, j) => (dayjs(j.createDate) > dayjs(i.createDate) ? 1 : -1))

      data.value = result.data.files
    }
  }

  const add = async (msg: string) => {
    if (!option.value) {
      return
    }

    const filePath = `${CAMERA_DIR_PATH}/${getKey(option.value.path)}/${msg}.txt`

    await axios.post(
      HOST,
      {
        encode: option.value.encode,
        value: option.value.value,
        path: filePath,
        force: 1,
      },
      { params: { _api: 'save' } },
    )

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

    await axios.post(HOST, { path: filePath }, { params: { _api: 'del' } })

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

    try {
      await ElMessageBox.confirm(`确定要使用【${item.name.replace(/\.txt$/, '')}】快照吗？当前窗口内容将会被覆盖`, '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'info',
      })
    } catch {
      return
    }

    const filePath = `${CAMERA_DIR_PATH}/${getKey(option.value.path)}/${item.name}`

    const { data: result } = await axios.get(HOST, {
      params: { _api: 'read', path: filePath },
      responseType: 'blob',
    })

    option.value.callback?.(await result.text())

    show.value = false
  }

  return { show, data, open, add, del, usage }
})
