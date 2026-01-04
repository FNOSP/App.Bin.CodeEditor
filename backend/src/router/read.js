const fs = require("fs");

module.exports = async function read({ query }) {
  if (!query.path) {
    return { code: 400, msg: "缺少文件路径参数", data: query };
  }

  const path = query.path[0] === "/" ? query.path : `/${query.path}`;

  try {
    if (!fs.existsSync(path)) {
      return { code: 404, msg: "文件不存在", data: query };
    }

    const stat = fs.statSync(path);
    if (!stat.isFile()) {
      return { code: 400, msg: "路径不是文件", data: query };
    }

    if (query.cache) {
      const maxAge = 365 * 24 * 60 * 60;

      console.log(`Cache-Control: public, max-age=${maxAge}, immutable`);
      console.log(
        `Expires: ${new Date(Date.now() + maxAge * 1000).toUTCString()}`
      );
      console.log(`ETag: "${stat.size}-${stat.mtime.getTime()}"`);
    }

    return {
      code: 200,
      msg: "操作成功",
      data: {
        size: stat.size,
        time: stat.mtime.toUTCString(),
        filename: path.split("/").pop(),
        stream: fs.createReadStream(path),
      },
    };
  } catch (error) {
    if (error.code === "EACCES" || error.code === "EPERM") {
      return { code: 403, msg: "权限不足，无法读取文件", data: query };
    }

    if (error.code === "ENOENT") {
      return { code: 404, msg: "文件不存在", data: query };
    }

    if (error.code === "EISDIR") {
      return { code: 400, msg: "路径是目录而不是文件", data: query };
    }

    return { code: 500, msg: `读取文件失败: ${error.message}`, data: query };
  }
};
