export default {
  set(key: string, val: any): void {
    return localStorage.setItem(key, JSON.stringify(val))
  },

  get<T>(key: string): T | null {
    const val = localStorage.getItem(key)

    if (val !== null) {
      try {
        return JSON.parse(val)
      } catch {
        localStorage.removeItem(key)
      }
    }

    return null
  },

  remove(key: string): void {
    return localStorage.removeItem(key)
  },

  clear(): void {
    return localStorage.clear()
  },
}
