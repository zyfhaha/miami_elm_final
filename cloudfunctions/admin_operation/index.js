// 写了一些管理员会用到的操作

// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAcMIC_CURRENT_ENV,
});
const db = cloud.database({
  env: "env-miamielm-p3buy",
});
const _ = db.command;

const registerCodeRef = db.collection("registerCode");

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const type = event.type;

  if (type === "addShopRegistCode") {
    const code = event.code;
    return await addShopRegistCode(openid, code);
  }
};

async function addShopRegistCode(openid, code) {
  return await registerCodeRef.add({
    data: {
      _openid: openid,
      code: code,
      isUsed: false,
      type: "owner",
      watermark: new Date().getTime(),
    },
  });
}
