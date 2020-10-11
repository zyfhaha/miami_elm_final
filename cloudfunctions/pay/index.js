// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 1 引入tenpay
const tenpay = require('tenpay');
// 2 配置
const config = {
  appid: 'wxd8767a7ca2b73429',
  mchid: '微信商户号',
  partnerKey: '微信支付安全密钥',
  pfx: require('fs').readFileSync('证书文件路径'), //退款相关 可以不要
  notify_url: '支付回调网址', //可以不要
  spbill_create_ip: 'IP地址' //也可以不写
};

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 3 初始化
  const api = tenpay.init(config);

  // 4 获取支付参数
  let result = await api.getPayParams({
    out_trade_no: event.order_number + "",
    body: '这是一次支付',
    total_fee: '订单金额(分)',
    openid: wxContext.OPENID
  });
  
  return result

}