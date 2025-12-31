const mimeMap = {
  // 文本类型
  css: "text/css",
  mjs: "text/javascript",
  js: "text/javascript",
  html: "text/html",
  htm: "text/html",
  xml: "text/xml",
  txt: "text/plain",
  csv: "text/csv",

  // 图片类型
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  bmp: "image/bmp",

  // 字体类型
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  eot: "application/vnd.ms-fontobject",

  // 音频视频
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  mp4: "video/mp4",
  webm: "video/webm",

  // 应用类型
  json: "application/json",
  pdf: "application/pdf",
  zip: "application/zip",
  rar: "application/x-rar-compressed",
  "7z": "application/x-7z-compressed",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // 其他
  wasm: "application/wasm",

  default: "application/octet-stream",
};

module.exports = function getType(filename) {
  const suffix = filename.split(".").pop();
  return mimeMap[suffix] || mimeMap.default;
};
