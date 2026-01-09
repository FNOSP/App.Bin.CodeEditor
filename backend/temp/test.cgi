#!/var/apps/nodejs_v22/target/bin/node

console.log('Content-Type: text/plain\n')

const fs = require('fs')

for (const key in process.env) {
  console.log(`${key}=${process.env[key]}`)
}

console.log('')
console.log('')

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

const run = async () => {
  try {
    console.log(getQuery())
    console.log(await getBody())
  } catch (e) {
    console.log(JSON.stringify(e))
  }
}

run()
