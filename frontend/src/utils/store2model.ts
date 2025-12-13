import { computed, type Ref } from 'vue'

export function ref2model<T>(org: Ref<T>) {
  return computed({
    get: () => org.value,
    set: (v) => (org.value = v),
  })
}
