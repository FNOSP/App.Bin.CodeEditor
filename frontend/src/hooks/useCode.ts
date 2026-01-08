import { reactive } from 'vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import iconv from 'iconv-lite'

import { LANG_MAP } from '@/utils/option'
import { getEncodeValue, readFile, saveFile } from '@/utils/file'

// import { useOpenStore } from '@/store/open'

interface OptionModel {
  confirm: () => boolean
  onSave: () => void
  onError: (v?: string) => void
}

interface CodeModel {
  buffer: ArrayBuffer
  path: string
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
    buffer: new ArrayBuffer(),
    path: '',
    org: '',
    value: '',
    lang: '',
    encode: 'utf-8',
  })

  const load = async (path: string) => {
    try {
      if (!path) {
        ElMessage.error('不存在的文件路径，请检查链接地址')
        return ''
      }

      const { data, byte, date } = await readFile(path, 'arraybuffer')

      code.path = path
      code.buffer = data
      code.byte = byte
      code.date = date

      const info = getEncodeValue(code.buffer)
      code.encode = info.encode
      code.org = code.value = info.value

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
      const buffer = iconv.encode(code.value, code.encode)

      const value = await saveFile({ path: code.path, force: force ? 1 : 0, file: new Blob([buffer]) })

      if (value.code === 200) {
        ElMessage({ type: 'success', message: '操作成功' })

        code.byte = value.data.size
        code.date = dayjs(value.data.time)
        code.org = code.value
        code.buffer = buffer

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
