export const LANG_MAP: { [x: string]: string } = {
  // 常见前端 / 通用语言
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'scss',
  less: 'less',
  json: 'json',
  md: 'markdown',
  py: 'python',
  java: 'java',
  c: 'csharp',
  cpp: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  php: 'php',
  rb: 'ruby',
  go: 'go',
  rs: 'rust',
  sql: 'sql',
  xml: 'xml',
  yaml: 'yaml',
  yml: 'yaml',
  Dockerfile: 'dockerfile',
  sh: 'shell',
  vue: 'vue',

  default: 'plaintext',
}

export const FILE_MAP: { [x: string]: string } = {
  jpg: 'img',
  jpeg: 'img',
  png: 'img',
  gif: 'img',
  svg: 'img',
  webp: 'img',
  avif: 'img',
  apng: 'img',
  ico: 'img',
  pdf: 'pdf',
  zip: 'zip',
  rar: 'zip',
  '7z': 'zip',
  gz: 'zip',
  tgz: 'zip',
  xz: 'zip',
  fpk: 'feiniu',
  iso: 'iso',
  exe: 'iso',
  dmg: 'iso',
  pkg: 'iso',
  deb: 'iso',
  rpm: 'iso',
  doc: 'word',
  docx: 'word',
  dotx: 'word',
  dot: 'word',
  xlsx: 'excel',
  xls: 'excel',
  xltx: 'excel',
  xlt: 'excel',
  xlsb: 'excel',
  pptx: 'ppt',
  ppt: 'ppt',
  pptm: 'ppt',
  potx: 'ppt',
  ppsx: 'ppt',
}

export const LANG_OPTIONS = [...new Set(Object.values(LANG_MAP))].map((t) => ({
  label: t,
  value: t,
}))

export const THEME_OPTIONS: { label: string; value: string; dark: boolean }[] = [
  { label: 'VS Light（浅色模式）', value: 'vs', dark: false },
  { label: 'VS Dark（深色模式）', value: 'vs-dark', dark: true },
  { label: 'High Contrast Light（浅色模式）', value: 'hc-light', dark: false },
  { label: 'High Contrast Black（深色模式）', value: 'hc-black', dark: true },
]

const codeMatch = (v: string) => {
  const sum = v.length
  const err = v.split('').filter((i) => i.charCodeAt(0) > 191).length
  return err / sum < 0.1
}

export const ENCODING_OPTIONS = [
  // 推荐优先显示（常用编码）
  { value: 'utf-8', label: 'UTF-8' },
  { value: 'gbk', label: 'GBK' },
  { value: 'gb2312', label: 'GB2312' },
  { value: 'gb18030', label: 'GB18030' },
  { value: 'big5', label: 'Big5' },

  // 国际通用编码
  { value: 'utf-16le', label: 'UTF-16 LE' },
  { value: 'utf-16be', label: 'UTF-16 BE' },
  { value: 'utf-16', label: 'UTF-16' },
  { value: 'ascii', label: 'ASCII', match: codeMatch },
  { value: 'latin1', label: 'ISO-8859-1', match: codeMatch },
  { value: 'windows-1252', label: 'Windows-1252', match: codeMatch },

  // 日韩编码
  { value: 'shift_jis', label: 'Shift_JIS' },
  { value: 'euc-jp', label: 'EUC-JP' },
  { value: 'euc-kr', label: 'EUC-KR' },
  { value: 'windows-949', label: 'Windows-949' },
]
