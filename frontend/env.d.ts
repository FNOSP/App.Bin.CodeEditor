/// <reference types="vite/client" />

interface DirModel {
  dirs: { name: string }[]
  files: { name: string; size: number; updateDate: string; createDate: string }[]
}
