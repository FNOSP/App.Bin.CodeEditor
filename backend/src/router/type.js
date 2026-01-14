const fs = require('fs')

module.exports = async function ({ query }) {
  if (!query.path) {
    return { code: 400, msg: '缺少文件路径参数', query }
  }

  const qPath = query.path[0] === '/' ? query.path : `/${query.path}`

  try {
    if (!fs.existsSync(qPath)) {
      return { code: 404, msg: '路径不存在', query }
    }

    const stat = fs.statSync(qPath)

    return { code: 200, msg: '操作成功', data: { isDirectory: stat.isDirectory() } }
  } catch (err) {
    if (err.code === 'EACCES' || err.code === 'EPERM') {
      return { code: 401, msg: '权限不足，无法读取', query }
    } else if (err.code === 'ENOENT') {
      return { code: 400, msg: '内容不存在', query }
    } else {
      return { code: 400, msg: `读取内容失败: ${err.message}`, query }
    }
  }
}
