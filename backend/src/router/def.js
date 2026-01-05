const fs = require('fs')
const path = require('path')

const wwwRoot = '/usr/trim/www'
const wwwReg = /(?<=<script\s[^>]*?src=")\/assets\/index[^"]+(?=")/gi

const constReg = /fn\:\(\)\=\>\{const (.+)\=\{\}\;return .+\.state\.apps\.forEach/

module.exports = async function read({ body }) {
  try {
    const html = fs.readFileSync(path.join(wwwRoot, './index.html'), { encoding: 'utf-8' })

    const jsMatch = html.match(wwwReg)

    if (!jsMatch || !jsMatch[0]) {
      return { code: 500, msg: `操作失败: 入口匹配失败`, data: body }
    }

    const jsPath = path.join(wwwRoot, `.${jsMatch[0]}`)

    let jsText = fs.readFileSync(path.join(wwwRoot, `.${jsMatch[0]}`), { encoding: 'utf-8' })

    const jsConst = jsText.match(constReg)

    if (!jsConst || !jsConst[1]) {
      return { code: 500, msg: `操作失败: 脚本匹配失败`, data: body }
    }

    if (body.open) {
      jsText = jsText.replace(
        /\,\{fileApps\:(.+)\}\}\,deps\:/,
        `,{fileApps:new Proxy(${jsConst[1]},{get:(o,k)=>o[k]!==undefined?o[k]:o["*"]})}},deps:`
      )
    } else {
      jsText = jsText.replace(/\,\{fileApps\:(.+)\}\}\,deps\:/, `,{fileApps:${jsConst[1]}}},deps:`)
    }

    fs.writeFileSync(jsPath, jsText)

    return { code: 200, msg: '操作成功', data: {} }
  } catch (error) {
    if (error.code === 'EACCES' || error.code === 'EPERM') {
      return { code: 403, msg: '权限不足，无法操作', data: query }
    }

    return { code: 500, msg: `操作失败: ${error.message}`, data: query }
  }
}
