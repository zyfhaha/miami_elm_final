const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const user_col = db.collection("user");

// 云函数入口函数
exports.main = async (event, context) => {
  const { openid } = cloud.getWXContext()
  start_date = Date.now()
  let res = await user_col.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        openid: openid,
        nickName: "",
        gender: 0,
        language: "",
        city: "",
        province: "",
        country: "",
        avatarUrl: "",
        credit: 0,
        start_date: start_date,
        last_active_date: start_date,
      }
    })
  return res
}