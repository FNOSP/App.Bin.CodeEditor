const fs = require('fs')
const path = require('path')

module.exports = async function read({ query }) {
  if (!query.path) {
    return { code: 400, msg: '缺少文件路径参数', data: query }
  }

  const dirPath = query.path[0] === '/' ? query.path : `/${query.path}`

  try {
    if (!fs.existsSync(dirPath)) {
      return { code: 404, msg: '目录不存在', data: query }
    }

    const stat = fs.statSync(dirPath)
    if (!stat.isDirectory()) {
      return { code: 400, msg: '路径不是目录', data: query }
    }

    const items = fs.readdirSync(dirPath)

    const result = { files: [], dirs: [] }

    items.forEach((item) => {
      const fullPath = path.join(dirPath, item)
      const itemStats = fs.statSync(fullPath)

      if (itemStats.isDirectory()) {
        result.dirs.push({ name: item })
      } else {
        result.files.push({ name: item, size: itemStats.size, updateDate: itemStats.mtime })
      }
    })

    result.files.sort((i, j) => ((i.name || '').toLocaleLowerCase() > (j.name || '').toLocaleLowerCase() ? 1 : -1))
    result.dirs.sort((i, j) => ((i.name || '').toLocaleLowerCase() > (j.name || '').toLocaleLowerCase() ? 1 : -1))

    return { code: 200, msg: '操作成功', data: result }
  } catch (error) {
    if (error.code === 'EACCES' || error.code === 'EPERM') {
      return { code: 403, msg: '权限不足，无法读取目录', data: query }
    }

    return { code: 500, msg: `读取目录失败: ${error.message}`, data: query }
  }
}
