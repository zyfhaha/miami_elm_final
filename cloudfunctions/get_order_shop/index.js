// 本云函数用于获取当前商店的订单
const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database({env:"env-miamielm-p3buy"})
const order_col = db.collection("order");
const MAX_LIMIT = 100
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // TODO 返回从当前开始30天内的所有订单 订单时间以create_time为准
  // TODO 监听新的订单
  // const start_date = event.start_date
  // const end_date = event.end_date

  // TODO 这里暂时将shop_id写死用于测试
  const shopId = "itoy7Q3q2AmzNYckO041FuTasX8f";
  // const {shop_id} = event.shop_id

  // 订单查询语句 "_q"表示这是一个查询(query)
  let orders_q = order_col.where({
    shopId:shopId
    // create_time: TODO 返回从当前开始30天内的所有订单 订单时间以create_time为准
  })
  
  // ===== 分批次获取数据 =========//

  // 先查询有多少条数据需要返回
  const countResult = await orders_q.count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = orders_q.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}