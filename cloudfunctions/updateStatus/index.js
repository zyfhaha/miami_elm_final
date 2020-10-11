// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({env:"env-miamielm-p3buy"})
const orders_col = db.collection("orders"); 

// 云函数入口函数
exports.main = async (event, context) => {
  // 更新status
  let res = await orders_col.where({
    order_number:event.order_number
  }).update({
    data:{
      status:1
    }
  })
  return res
}