import { HOST } from '@/utils/env'
import { ENCODING_OPTIONS } from '@/utils/option'

export const getFileName = (v: string) => v.split('/').pop() || ''

export const getFileSuffix = (v: string) => (v.split('.').pop() || '').toLocaleLowerCase()

export const getFullPath = (path: string) => {
  if (path.indexOf('http') === 0) {
    return path
  }

  return `${HOST}?_api=read&path=${encodeURIComponent(path)}`
}

export const getSize = (byte: number) => {
  if (byte < 1024) {
    return `${byte} B`
  }

  const KB = byte / 1024
  if (KB < 1024) {
    return `${Number(KB.toFixed(2))} KB`
  }

  const MB = KB / 1024
  if (MB < 1024) {
    return `${Number(MB.toFixed(2))} MB`
  }

  const TB = MB / 1024
  if (TB < 1024) {
    return `${Number(TB.toFixed(2))} TB`
  }

  return ''
}

export const getKey = (path: string) =>
  path
    .split('/')
    .filter((i) => !!i)
    .join('-')
    .replace(/\./g, '_')

export const getEncodeValue = async (blob: Blob) => {
  const encode: string[] = []
  const buffer = await blob.arrayBuffer()

  for (const item of ENCODING_OPTIONS) {
    try {
      const decoder = new TextDecoder(item.value)
      const text = decoder.decode(buffer)

      if (text.includes('�')) {
        continue
      }

      if (item.match) {
        if (!item.match(text)) {
          continue
        }
      }

      encode.push(item.value)
    } catch {
      continue
    }
  }

  return { encode: encode[0] || 'utf8', value: new TextDecoder(encode[0] || 'utf8').decode(buffer) }
}

export const isBinaryContent = async (blob: Blob) => {
  const slice = blob.slice(0, 1024)
  const arrayBuffer = await slice.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)

  let suspiciousBytes = 0
  const totalBytes = bytes.length

  // 空文件视为文本文件
  if (totalBytes === 0) return false

  // 检查是否有 null 字节（文本文件中罕见）
  if (bytes.includes(0)) return true

  // 统计非 ASCII 字符
  for (let i = 0; i < totalBytes; i++) {
    const byte = bytes[i]

    // ASCII 控制字符（除了常见的制表符、换行符等）
    if (byte && byte < 32 && byte !== 9 && byte !== 10 && byte !== 13) {
      suspiciousBytes++
    }

    // 如果超过一定比例的非文本字符，则认为是二进制
    if (i > 100 && suspiciousBytes / i > 0.3) {
      return true
    }
  }

  // 如果有很多可疑字节，认为是二进制
  return suspiciousBytes / totalBytes > 0.1
}
