const fs = require('fs')

module.exports = async function ({ body }) {
  if (!body.path) {
    return { code: 400, msg: '缺少文件路径参数' }
  }

  const filePath = body.path[0] === '/' ? body.path : `/${body.path}`

  try {
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath)
      if (!stat.isFile()) {
        return { code: 400, msg: '路径不是文件' }
      }
    } else {
      return { code: 404, msg: '文件不存在' }
    }

    fs.rmSync(filePath, { force: true })

    return { code: 200, msg: '操作成功', data: {} }
  } catch (err) {
    if (err.code === 'EACCES') {
      return { code: 401, msg: '权限不足，无法删除文件' }
    } else if (err.code === 'ENOENT') {
      return { code: 400, msg: '目录不存在，无法删除文件' }
    } else {
      return { code: 400, msg: `文件操作错误: ${err.message}` }
    }
  }
}
