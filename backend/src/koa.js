const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const { koaBody } = require('koa-body')
const cors = require('@koa/cors')

const exec = require('./utils/exec')

const uploadDir = path.join(__dirname, '../runtime/upload')
fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir, { recursive: true })

const getData = (ctx) => {
  const path = decodeURIComponent(ctx.request.url.split('?')[0])

  if (path.indexOf('/api') === 0) {
    return {
      api: path.replace('/api', ''),
      query: ctx.query || {},
      body: ctx.request.body || {},
      files: ctx.request.files
        ? Object.keys(ctx.request.files).reduce((obj, key) => {
            obj[key] = fs.readFileSync(ctx.request.files[key].filepath)
            return obj
          }, {})
        : {},
    }
  } else if (path.indexOf('/proxy') === 0) {
    const query = ctx.query || {}
    return { api: Number(query.dir) === 1 ? '/dir' : '/read', query: { path: path.replace('/proxy', '') } }
  } else {
    // 本地开发用不到这里
    const assets = path === '/' ? '/index.html' : path
    return { api: '/read', query: { path: `/var/apps/code.editor/target/server/dist${assets}` }, cache: path !== '/' }
  }
}

const app = new Koa()

app.use(cors())

app.use(koaBody({ parsedMethods: ['POST', 'PUT', 'PATCH'], multipart: true, formidable: { uploadDir, keepExtensions: true } }))

app.use(async (ctx) => {
  const data = getData(ctx)

  const { type, body } = await exec(data)

  if (type) {
    ctx.set('Content-Type', type)
    ctx.set('Content-Length', body.size)

    // 缓存静态资源
    if (data.cache) {
      //
    } else {
      ctx.set('Cache-Control', 'no-store')
    }

    ctx.set('Access-Control-Expose-Headers', 'X-Size,X-Update-Date,X-Create-Date')
    ctx.set('X-Size', body.size)
    ctx.set('X-Update-Date', body.mtime.toUTCString())
    ctx.set('X-Create-Date', body.birthtime.toUTCString())
    ctx.body = body.stream
  } else {
    ctx.set('Content-Type', 'application/json; charset=utf-8')
    ctx.body = body
  }
})

app.listen(17746)
