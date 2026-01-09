const exec = require('./utils/exec')

const getQuery = (v = '') =>
  (v || process.env.QUERY_STRING || '')
    .split('&')
    .filter((i) => !!i)
    .map((i) => i.split('='))
    .reduce((o, [k, v]) => {
      o[k] = decodeURIComponent(v)
      return o
    }, {})

const getBody = async () => {
  const result = { body: {}, files: {} }

  if (process.env.REQUEST_METHOD !== 'POST') {
    return result
  }

  if (parseInt(process.env.CONTENT_LENGTH || '0') <= 0) {
    return result
  }

  const chunks = await new Promise((r) => {
    let chunks = []

    process.stdin.on('data', (chunk) => {
      chunks.push(chunk)
    })

    process.stdin.on('end', () => {
      r(Buffer.concat(chunks))
    })
  })

  const contentType = process.env.CONTENT_TYPE || ''

  if (contentType.includes('application/json')) {
    result.body = JSON.parse(chunks.toString())
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    result.body = getQuery(chunks.toString())
  } else if (contentType.includes('multipart/form-data')) {
    const boundary = (contentType.split(';').find((i) => i.includes('boundary=')) || '').split('=').pop()
    if (!boundary) {
      return result
    }

    const br = '\r\n'

    const contentBuffer = chunks.slice(
      Buffer.from('--' + boundary + br).length,
      chunks.indexOf(Buffer.from(br + '--' + boundary + '--' + br))
    )
    const flagBuffer = Buffer.from(br + '--' + boundary + br)
    const value = { prev: 0, flag: contentBuffer.indexOf(flagBuffer), buffer: [] }

    while (value.flag > -1) {
      value.buffer.push(contentBuffer.slice(value.prev, value.flag))
      value.prev = value.flag + flagBuffer.length
      value.flag = contentBuffer.indexOf(flagBuffer, value.prev)
    }

    if (value.prev < contentBuffer.length) {
      value.buffer.push(contentBuffer.slice(value.prev))
    }

    value.buffer.forEach((i) => {
      const flag = Buffer.from(br + br)
      const index = i.indexOf(flag)
      const text = i.slice(0, index).toString()
      const value = i.slice(index + flag.length)

      if (text.includes('Content-Disposition: form-data;')) {
        const line = text.split(br)[0]
        const query = getQuery(line.replace('Content-Disposition: form-data; ', '').replaceAll('; ', '&').replaceAll('"', ''))

        if (query.filename === undefined) {
          result.body[query.name] = value.toString()
        } else {
          if (query.filename || value.length) {
            result.files[query.name] = value
          }
        }
      }
    })
  }

  return result
}

const getData = async () => {
  const path = process.env.PATH_INFO.replace('/cgi/ThirdParty/code.editor/index.cgi', '')

  if (path.indexOf('/api') === 0) {
    const query = getQuery()
    const { body, files } = await getBody()
    return { api: path.replace('/api', ''), query, body, files }
  } else if (path.indexOf('/proxy') === 0) {
    const query = getQuery()
    return { api: Number(query.dir) === 1 ? '/dir' : '/read', query: { path: path.replace('/proxy', '') } }
  } else {
    const assets = path === '/' ? '/index.html' : path
    return { api: '/read', query: { path: `/var/apps/code.editor/target/server/dist${assets}` }, cache: path !== '/' }
  }
}

async function main() {
  try {
    const data = await getData()

    const { type, body } = await exec(data)

    if (type) {
      console.log(`Content-Type: ${type}`)
      console.log(`Content-Length: ${body.size}`)

      // 缓存静态资源
      if (data.cache) {
        const maxAge = 365 * 24 * 60 * 60
        console.log(`Cache-Control: public, max-age=${maxAge}, immutable`)
        console.log(`Expires: ${new Date(Date.now() + maxAge * 1000).toUTCString()}`)
        console.log(`ETag: "${body.size}-${body.mtime.getTime()}"`)
        console.log(`Last-Modified: ${body.mtime.toUTCString()}`)
      }

      // 自定义响应头
      console.log('Access-Control-Expose-Headers: X-Size,X-Update-Date,X-Create-Date')
      console.log(`X-Size: ${body.size}`)
      console.log(`X-Update-Date: ${body.mtime.toUTCString()}`)
      console.log(`X-Create-Date: ${body.birthtime.toUTCString()}`)

      // 返回文件
      console.log('')
      body.stream.pipe(process.stdout)
    } else {
      console.log('Content-Type: application/json; charset=utf-8\n')
      console.log(JSON.stringify(body))
    }
  } catch (error) {
    console.log('Content-Type: application/json; charset=utf-8\n')
    console.log(JSON.stringify({ code: 400, msg: '调用错误' }))
  }
}

main()
