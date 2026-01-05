const querystring = require('querystring')

const exec = require('./utils/exec')

// 获取 env、query、body
async function getData() {
  const env = process.env

  const assets = env.PATH_INFO.replace('/cgi/ThirdParty/code.editor/index.cgi', '')

  if (assets) {
    const path = assets === '/' ? '/index.html' : assets
    const cache = assets !== '/'

    return {
      env,
      api: 'read',
      query: { path: `/var/apps/code.editor/target/server/dist${path}`, cache },
      body: {},
    }
  }

  const result = {
    env,
    api: env.HTTP_API_PATH || '',
    query: querystring.parse(env.QUERY_STRING || ''),
    body: {},
  }

  if (env.REQUEST_METHOD === 'POST') {
    const contentLength = parseInt(env.CONTENT_LENGTH || '0')

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
        if (str.trim()) {
          const type = env.CONTENT_TYPE || ''

          if (type.includes('application/x-www-form-urlencoded')) {
            result.body = querystring.parse(str)
          } else if (type.includes('application/json')) {
            result.body = JSON.parse(str)
          } else {
            result.body = { raw: str }
          }
        }
      } catch (error) {
        result.body = {}
      }
    }
  }

  return result
}

async function main() {
  try {
    const data = await getData()

    const { type, body } = await exec(data)

    if (type) {
      console.log(`Content-Type: ${type}`)
      console.log(`Content-Length: ${body.size}`)
      console.log(`Last-Modified: ${body.time}`)
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
