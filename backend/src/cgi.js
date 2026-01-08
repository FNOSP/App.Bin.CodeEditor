const exec = require('./utils/exec')

const getQuery = (v = '') =>
  (v || process.env.QUERY_STRING || '')
    .split('&')
    .filter((i) => !!i)
    .map((i) => i.split('='))
    .reduce((o, [k, v]) => {
      o[k] = v
      return o
    }, {})

const getBody = async () => {
  const result = { body: {}, files: {} }

  if (process.env.REQUEST_METHOD !== 'POST') {
    return result
  }

  const contentLength = parseInt(process.env.CONTENT_LENGTH || '0')

  if (contentLength > 0) {
    const str = await new Promise((r) => {
      let str = ''

      process.stdin.on('data', (chunk) => {
        str += chunk.toString()
      })

      process.stdin.on('end', () => {
        r(str)
      })
    })

    try {
      const type = process.env.CONTENT_TYPE || ''

      if (type.includes('application/json')) {
        result.body = JSON.parse(str)
      } else if (type.includes('application/x-www-form-urlencoded')) {
        result.body = { body: getQuery(str) }
      } else if (type.includes('multipart/form-data')) {
        const boundary = (type.split(';').find((i) => i.includes('boundary=')) || '').split('=').pop()

        if (!boundary) {
          return result
        }

        const br = '\r\n'

        str
          .split(`--${boundary}`)
          .filter((i) => !['', '--' + br].includes(i))
          .forEach((i) => {
            const [info, value] = i.split(br + br).map((i) => i.replace(br, ''))

            if (info.includes('Content-Disposition: form-data;')) {
              const line = info.split(br)[0]
              const query = getQuery(line.replace('Content-Disposition: form-data; ', '').replaceAll('; ', '&').replaceAll('"', ''))

              if (query.filename === undefined) {
                result.body[query.name] = value
              } else {
                if (query.filename) {
                  result.files[query.name] = {
                    name: query.filename,
                    data: value,
                  }
                }
              }
            }
          })
      }
    } catch {}
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
