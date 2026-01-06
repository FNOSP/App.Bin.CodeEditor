import { reactive } from 'vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

import { HOST } from '@/utils/env'
import { LANG_MAP } from '@/utils/option'
import { getEncodeValue } from '@/utils/file'

// import { useOpenStore } from '@/store/open'

interface OptionModel {
  confirm: () => boolean
  onSave: () => void
  onError: (v?: string) => void
}

interface CodeModel {
  path: string
  blob: Blob
  org: string
  value: string
  lang: string
  encode: string
  byte?: number
  date?: dayjs.Dayjs
}

export default function useCode(option: OptionModel) {
  // const open = useOpenStore()

  const code = reactive<CodeModel>({
    path: '',
    blob: new Blob(),
    org: '',
    value: '',
    lang: '',
    encode: 'utf8',
  })

  const load = async (path: string) => {
    try {
      if (!path) {
        ElMessage.error('不存在的文件路径，请检查链接地址')
        return ''
      }

      const { data, headers } = await axios.get(HOST, {
        params: { _api: 'read', path },
        responseType: 'blob',
      })

      const info = await getEncodeValue(data)

      code.blob = data
      code.path = path
      code.encode = info.encode
      code.org = code.value = info.value
      code.byte = headers['x-size'] ? Number(headers['x-size']) : undefined
      code.date = headers['x-update-date'] ? dayjs(headers['x-update-date']) : undefined

      // if (await isBinaryContent(data)) {
      //   option.onError('不支持二进制文件的编辑')
      //   open.removeHistory(path)
      //   return
      // }

      const filename = path.split('/').pop() || ''

      if (filename.includes('.')) {
        const ext = filename.split('.').pop()?.toLowerCase() || ''
        code.lang = LANG_MAP[ext] || (LANG_MAP.default as string)
      } else {
        code.lang = LANG_MAP.default as string
      }
    } catch (e) {
      code.value = JSON.stringify(e || '无法解析文件，请检查文件路径或资源是否存在')
      ElMessage.error('无法解析文件，请检查文件路径或资源是否存在')
    }
  }

  const save = () => {
    if (code.value === code.org) {
      return
    }

    if (option.confirm()) {
      ElMessageBox.confirm('将要保存文件，是否继续', '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => upload())
    } else {
      upload()
    }
  }

  const upload = async (force?: 1) => {
    try {
      const { data: value } = await axios.post<{
        code: number
        msg: string
        data: { size: number; time: string }
      }>(
        HOST,
        {
          encode: code.encode,
          value: code.value,
          path: code.path,
          force,
        },
        { params: { _api: 'save' } },
      )

      if (value.code === 200) {
        ElMessage({ type: 'success', message: '操作成功' })

        code.byte = value.data.size
        code.date = dayjs(value.data.time)

        code.org = code.value

        option.onSave()
      } else {
        if (value.code === 404) {
          ElMessageBox.confirm('文件不存在，是否创建并保存？', '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'info',
          }).then(() => upload(1))
        } else {
          ElMessage({ type: 'error', message: value.msg })
        }
      }
    } catch {
      ElMessage({ type: 'error', message: '操作失败' })
    }
  }

  return { code, load, save }
}
