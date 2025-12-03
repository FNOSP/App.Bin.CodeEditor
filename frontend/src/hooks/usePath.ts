import { ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

import useHistory from '@/hooks/useHistory'

export default function usePath() {
  const open = ref(false)
  const view = reactive<{ path: string; diff: boolean }[]>([])
  const active = ref(0)

  const history = useHistory<{ path: string }>({ key: 'PATH_HISTORY', id: 'path' })

  onMounted(async () => {
    const query = new URLSearchParams(window.location.search).get('path') || ''
    if (query) {
      add(query)
    } else {
      open.value = true
    }
  })

  const add = async (path: string) => {
    if (path) {
      const index = view.findIndex((i) => i.path === path)
      if (index > -1) {
        active.value = index
      } else {
        active.value = view.push({ path, diff: false }) - 1
      }
      history.add({ path })
    }

    open.value = false
  }

  const remove = async (index: number) => {
    const item = view[index]
    if (item) {
      if (item.diff) {
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

      if (index === active.value) {
        active.value += view[index + 1] ? 0 : -1
      } else if (index < active.value) {
        active.value--
      }

      view.splice(index, 1)
    }
  }

  return { open, view, active, history, add, remove }
}
