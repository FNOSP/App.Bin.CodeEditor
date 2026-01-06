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

export const getEncodeValue = (buffer: ArrayBuffer) => {
  const encode: string[] = []

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
