const getType = require("./type");

const router = {
  read: { type: "file", run: require("../router/read") },
  save: { run: require("../router/save") },
  dir: { run: require("../router/dir") },
  def: { run: require("../router/def") },
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
