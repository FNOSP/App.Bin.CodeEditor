const getType = require("./type");

const router = {
  assets: { type: "file", run: require("../router/read") },
  read: { type: "file", run: require("../router/read") },
  save: { run: require("../router/save") },
};

module.exports = async function exec(data) {
  const api = router[data.api || data.query._api];

  if (!api) {
    return { body: { code: 404, msg: "不存在的接口" } };
  }

  const result = await api.run(data);

  if (result.code === 200 && api.type === "file") {
    return { type: getType(result.data.filename), body: result.data };
  } else {
    return { body: result };
  }
};
