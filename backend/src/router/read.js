const fs = require('fs')

module.exports = async function ({ query }) {
  if (!query.path) {
    return { code: 400, msg: '缺少文件路径参数', query }
  }

  const filePath = query.path[0] === '/' ? query.path : `/${query.path}`

  try {
    if (!fs.existsSync(filePath)) {
      return { code: 404, msg: '文件不存在', query }
    }

    const stat = fs.statSync(filePath)
    if (!stat.isFile()) {
      return { code: 400, msg: '路径不是文件', query }
    }

    return {
      code: 200,
      msg: '操作成功',
      data: {
        size: stat.size,
        mtime: stat.mtime,
        birthtime: stat.birthtime,
        filename: filePath.split('/').pop(),
        stream: fs.createReadStream(filePath),
      },
    }
  } catch (error) {
    if (error.code === 'EACCES' || error.code === 'EPERM') {
      return { code: 401, msg: '权限不足，无法读取文件', query }
    } else if (err.code === 'ENOENT') {
      return { code: 400, msg: '文件不存在', query }
    } else if (err.code === 'EISDIR') {
      return { code: 400, msg: '路径是目录而不是文件', query }
    } else {
      return { code: 400, msg: `读取文件失败: ${err.message}`, query }
    }
  }
}
