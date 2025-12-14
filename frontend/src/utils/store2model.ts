import { computed, type Ref, type Reactive, type WritableComputedRef } from 'vue'

interface OptModel<T> {
  onGet?: () => void
  onSet?: (v: T) => void
}

export function ref2model<T>(org: Ref<T>, opt?: OptModel<T>): WritableComputedRef<T> {
  return computed({
    get: () => {
      opt?.onGet?.()
      return org.value
    },
    set: (v) => {
      opt?.onSet?.(v)
      org.value = v
    },
  })
}

export function reactive2model<T>(org: Reactive<T>, opt?: OptModel<T>) {
  const result = {} as any

  Object.keys(org).forEach((key) => {
    const val = (org as any)[key]

    if (typeof val === 'object' && !Array.isArray(val)) {
      result[key] = reactive2model(val, opt)
    } else {
      result[key] = computed({
        get: () => {
          opt?.onGet?.()
          return (org as any)[key]
        },
        set: (v) => {
          ;(org as any)[key] = v
          opt?.onSet?.(v)
        },
      })
    }
  })

  return result as Reactive<T>
}
