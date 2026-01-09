import axios from 'axios'
import { dayjs } from 'element-plus'

import api from '@/utils/api'
import { HOST } from '@/utils/env'
import { ENCODING_OPTIONS } from '@/utils/option'

export const getFileName = (v: string) => v.split('/').pop() || ''

export const getFileSuffix = (v: string) => (v.split('.').pop() || '').toLocaleLowerCase()

export const getFullPath = (path: string) => {
  if (path.indexOf('http') === 0) {
    return path
  }

  const encode = path
    .split('/')
    .filter((i) => i !== '')
    .map((i) => encodeURIComponent(i))
    .join('/')

  return `${HOST}/proxy/${encode}`
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
  let encode = 'utf-8'

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

      encode = item.value
      break
    } catch {
      continue
    }
  }

  return { encode, value: new TextDecoder(encode).decode(buffer) }
}

export const readPath = async <T = any>(opt: { path: string; responseType?: 'json' | 'arraybuffer' | 'text'; dir?: boolean }) => {
  const responseType = opt.responseType || 'json'

  const { data, headers } = await (getFileSuffix(opt.path) === 'cgi'
    ? api.get<T>('/read', { params: { path: opt.path }, responseType })
    : axios<T>(getFullPath(opt.path), { params: { dir: opt.dir ? 1 : undefined }, responseType }))

  return {
    data,
    byte: headers['x-size'] ? Number(headers['x-size']) : undefined,
    date: headers['x-update-date'] ? dayjs(headers['x-update-date']) : undefined,
  }
}

export const saveFile = async (opt: { path: string; force?: boolean; file: Blob | File }) => {
  const formData = new FormData()

  formData.append('path', opt.path)
  opt.force && formData.append('force', '1')
  formData.append('file', opt.file)

  const { data } = await api.post<{ code: number; msg: string; data: { size: number; time: string } }>('/save', formData)

  return data
}
