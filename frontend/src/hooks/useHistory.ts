import { reactive, watch } from 'vue'

import localStorage from '@/utils/localStorage'

export default function usePath<T>(opt: { key: string; id: keyof T }) {
  const value = reactive<T[]>(localStorage.get<T[]>(opt.key) || [])

  const add = (val: T) => {
    if (!val) {
      return
    }

    remove(val)
    ;(value as T[]).unshift(val)
  }

  const remove = (val: T) => {
    if (!val) {
      return
    }

    const index = value.findIndex((i) => (i as T)[opt.id] === val[opt.id])

    if (index > -1) {
      value.splice(index, 1)
    }
  }

  watch(
    () => value,
    (v) => {
      localStorage.set(opt.key, v)
    },
    { deep: true },
  )

  return { value, add, remove }
}
