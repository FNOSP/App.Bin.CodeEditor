import { onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

import { HOST } from '@/utils/env'
import localStorage from '@/utils/localStorage'
import { LANG_MAP } from '@/utils/option'

interface CodeModel {
  blob: any
  org: string
  value: string
  lang: string
  encode: string
}

export default function useCode(option: { path: string; confirm: () => boolean }) {
  const code = reactive<CodeModel>({ blob: [], org: '', value: '', lang: '', encode: 'utf8' })

  const load = async (path: string) => {
    try {
      if (!path) {
        ElMessage.error('不存在的文件路径，请检查链接地址')
        return ''
      }

      const { data } = await axios.post(
        `${HOST}/read`,
        { path, pswd: localStorage.get('pswd') },
        {
          responseType: 'blob',
        },
      )

      code.blob = data

      code.org = code.value = await data.text()

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

  const upload = async () => {
    try {
      const { data: value }: any = await axios.post(`${HOST}/save`, {
        encode: code.encode,
        value: code.value,
        path: option.path,
        pswd: localStorage.get('pswd') || '',
      })

      if (value.code === 200) {
        ElMessage({ type: 'success', message: '操作成功' })

        code.org = code.value
      } else {
        ElMessage({ type: 'error', message: value.msg })
      }
    } catch {
      ElMessage({ type: 'error', message: '操作失败' })
    }
  }

  onMounted(() => {
    load(option.path)
  })

  return { code, save }
}
