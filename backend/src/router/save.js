const fs = require('fs')
const iconv = require('iconv-lite')
const path = require('path')

module.exports = async function ({ body, files }) {
  if (!body.path) {
    return { code: 400, msg: '缺少文件路径参数' }
  }
  if (!files.file) {
    return { code: 400, msg: '缺少文件' }
  }

  const filePath = body.path[0] === '/' ? body.path : `/${body.path}`

  try {
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath)
      if (!stat.isFile()) {
        return { code: 400, msg: '路径不是文件' }
      }
    } else {
      if (Number(body.force) === 1) {
        const dir = path.dirname(filePath)
        fs.existsSync(dir) || fs.mkdirSync(dir, { recursive: true })
      } else {
        return { code: 404, msg: '文件不存在' }
      }
    }

    fs.writeFileSync(filePath, files.file)

    const stat = fs.statSync(filePath)

    return { code: 200, msg: '操作成功', data: { size: stat.size, time: stat.mtime.toUTCString() } }
  } catch (err) {
    if (err.code === 'EACCES') {
      return { code: 401, msg: '权限不足，无法写入文件' }
    } else if (err.code === 'ENOENT') {
      return { code: 400, msg: '目录不存在，无法写入文件' }
    } else {
      return { code: 400, msg: `文件操作错误: ${err.message}` }
    }
  }
}
