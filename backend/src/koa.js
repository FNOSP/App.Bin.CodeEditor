const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const { koaBody } = require('koa-body')
const cors = require('@koa/cors')

const exec = require('./utils/exec')

const app = new Koa()

app.use(cors())

app.use(
  koaBody({
    parsedMethods: ['POST', 'PUT', 'PATCH'],
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '../../runtime/upload'),
      keepExtensions: true,
    },
  })
)

app.use(async (ctx) => {
  const url = ctx.request.url.split('?')[0]

  const data = {
    api: url.replace('/api', ''),
    query: ctx.query || {},
    body: ctx.request.body || {},
    files: ctx.request.files
      ? Object.keys(ctx.request.files).reduce((obj, key) => {
          obj[key] = fs.readFileSync(ctx.request.files[key].filepath)
          return obj
        }, {})
      : {},
  }

  const { type, body } = await exec(data)

  if (type) {
    ctx.set('Content-Type', type)
    ctx.set('Content-Length', body.size)
    ctx.set('Access-Control-Expose-Headers', 'X-Size,X-Update-Date,X-Create-Date')
    ctx.set('X-Size', body.size)
    ctx.set('X-Update-Date', body.mtime)
    ctx.set('X-Create-Date', body.birthtime)
    ctx.body = body.stream
  } else {
    ctx.set('Content-Type', 'application/json; charset=utf-8')
    ctx.body = body
  }
})

app.listen(17746)
