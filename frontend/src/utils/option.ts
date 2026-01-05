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

export const ENCODING_OPTIONS = [
  // 推荐优先显示（常用编码）
  { value: 'utf8', label: 'UTF-8' },
  { value: 'gbk', label: 'GBK' },
  { value: 'gb2312', label: 'GB2312' },
  { value: 'gb18030', label: 'GB18030' },
  { value: 'big5', label: 'Big5' },

  // 国际通用编码
  { value: 'utf16le', label: 'UTF-16 LE' },
  { value: 'utf16be', label: 'UTF-16 BE' },
  { value: 'utf16', label: 'UTF-16' },
  { value: 'ascii', label: 'ASCII' },
  { value: 'latin1', label: 'ISO-8859-1' },
  { value: 'windows-1252', label: 'Windows-1252' },

  // 日韩编码
  { value: 'shift_jis', label: 'Shift_JIS' },
  { value: 'euc-jp', label: 'EUC-JP' },
  { value: 'euc-kr', label: 'EUC-KR' },
  { value: 'windows-949', label: 'Windows-949' },

  // 东欧/斯拉夫编码
  { value: 'windows-1251', label: 'Windows-1251' },
  { value: 'koi8-r', label: 'KOI8-R' },
  { value: 'iso-8859-5', label: 'ISO-8859-5' },

  // 西欧/南欧编码
  { value: 'iso-8859-2', label: 'ISO-8859-2' },
  { value: 'windows-1250', label: 'Windows-1250' },
  { value: 'iso-8859-3', label: 'ISO-8859-3' },

  // 中东编码
  { value: 'windows-1256', label: 'Windows-1256' },
  { value: 'iso-8859-6', label: 'ISO-8859-6' },
  { value: 'windows-1255', label: 'Windows-1255' },
  { value: 'iso-8859-8', label: 'ISO-8859-8' },
]
