const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");

const exec = require("./utils/exec");

const app = new Koa();

app.use(cors());

app.use(bodyParser());

app.use(async (ctx) => {
  const data = {
    api: ctx.request.headers["api-path"] || "",
    query: ctx.query || {},
    body: ctx.request.body || {},
  };

  const { type, body } = await exec(data);

  if (type) {
    ctx.set("Content-Type", type);
    ctx.set("Content-Length", body.size);
    ctx.set("Last-Modified", body.time);
    ctx.body = body.stream;
  } else {
    ctx.set("Content-Type", "application/json; charset=utf-8");
    ctx.body = body;
  }
});

app.listen(17746);
