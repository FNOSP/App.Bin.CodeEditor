const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const serve = require("koa-static");
const cors = require("@koa/cors");
const path = require("path");
const fs = require("fs");
const iconv = require("iconv-lite");

const app = new Koa();
const router = new Router();

app.use(cors());

app.use(serve(path.join(__dirname, "./public")));

app.use(bodyParser());

router.post("/read", async (ctx) => {
  ctx.status = 200;

  const { path, pswd } = ctx.request.body;

  if (pswd !== process.env.USER_PSWD) {
    ctx.body = { code: 401, msg: "访问密钥错误" };
    return;
  }

  if (!path) {
    ctx.body = { code: 400, msg: "缺少文件路径参数" };
    return;
  }

  if (!fs.existsSync(path)) {
    ctx.body = { code: 404, msg: "文件不存在" };
    return;
  }

  const stat = fs.statSync(path);
  if (!stat.isFile()) {
    ctx.body = { code: 400, msg: "路径不是文件" };
    return;
  }

  ctx.type = "application/octet-stream";
  ctx.body = fs.createReadStream(path);
});

router.post("/save", async (ctx) => {
  ctx.status = 200;

  const { path, pswd, encode, value } = ctx.request.body;

  if (pswd !== process.env.USER_PSWD) {
    ctx.body = { code: 401, msg: "访问密钥错误" };
    return;
  }

  if (!path) {
    ctx.body = { code: 400, msg: "缺少文件路径参数" };
    return;
  }

  if (!fs.existsSync(path)) {
    ctx.body = { code: 404, msg: "文件不存在" };
    return;
  }

  const stat = fs.statSync(path);
  if (!stat.isFile()) {
    ctx.body = { code: 400, msg: "路径不是文件" };
    return;
  }

  try {
    fs.writeFileSync(path, iconv.encode(value, encode));
  } catch (err) {
    if (err.code === "EACCES") {
      ctx.body = { code: 401, msg: "权限不足，无法写入文件" };
      return;
    } else if (err.code === "ENOENT") {
      ctx.body = { code: 400, msg: "目录不存在，无法写入文件" };
      return;
    } else {
      ctx.body = { code: 400, msg: "文件操作错误" };
      return;
    }
  }

  ctx.body = { code: 200, msg: "操作成功" };
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 17746;

app.listen(PORT, () => {
  console.log(`服务已启动，监听端口 ${PORT}`);
});
