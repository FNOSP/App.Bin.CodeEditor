import { ElMessageBox } from 'element-plus'

import localStorage from '@/utils/localStorage'

export default function useReset(option: { isDiff: () => boolean }) {
  const resetCode = () => {
    if (option.isDiff()) {
      ElMessageBox.confirm('将不会存储已修改的内容，是否继续', '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => window.location.reload())
    } else {
      window.location.reload()
    }
  }

  const resetPath = () => {
    ElMessageBox.prompt('请输入文件路径', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    }).then(({ value }) => {
      if (value) {
        window.location.assign(`/?path=${value}`)
      }
    })
  }

  const resetPswd = () => {
    localStorage.remove('pswd')
    window.location.reload()
  }

  return { resetCode, resetPath, resetPswd }
}
