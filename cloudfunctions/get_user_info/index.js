// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// TODO 函数用于获取用户开放数据并上传到数据库 需要做一个页面专门干这件事

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return cloud.getOpenData({
    list: event.openData.list,
  })
}