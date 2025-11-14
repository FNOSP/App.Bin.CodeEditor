import { ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

export default function usePath() {
  const view = reactive<{ path: string; diff: boolean }[]>([])
  const active = ref('')

  onMounted(async () => {
    const query = new URLSearchParams(window.location.search).get('path') || ''
    if (query) {
      view.push({ path: query, diff: false })
      active.value = query
    } else {
      add(true)
    }
  })

  const add = async (force?: boolean) => {
    const value = await ElMessageBox.prompt(
      '部分文件可在文件管理中双击文件进行编辑，详见应用介绍',
      '请输入文件路径',
      {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false,
        showCancelButton: !force,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      },
    )
      .then(({ value }) => value)
      .catch(() => '')

    if (value) {
      const item = view.find((i) => i.path === value)
      if (item) {
        active.value = item.path
      } else {
        view.push({ path: value, diff: false })
        active.value = value
      }
    }
  }

  const remove = async (path: string) => {
    const index = view.findIndex((i) => i.path === path)
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

      if (active.value === item.path) {
        active.value = (view[index + 1] || view[index - 1])?.path || ''
      }

      view.splice(index, 1)
    }
  }

  return { view, active, add, remove }
}
