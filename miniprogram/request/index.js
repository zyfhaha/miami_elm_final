// 同时发送异步代码的次数
let ajaxTimes=0;
export const request=(params)=>{
  ajaxTimes++;
  // 显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true, //时候显示一层蒙版屏蔽用户的所有操作
    success: (result)=>{
    },
  });

  // 定义公共的url
  const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve, reject)=>{
    wx.request({
      ...params,
      url:baseUrl+params.url,
      success:(result)=>{
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      },
      complete:()=>{
        ajaxTimes--;
        if (ajaxTimes===0){
          // 关闭图标
          wx.hideLoading();
        }
      }
    });
  })
};

export const login=()=>{
  return new Promise((resolve, reject)=>{
    wx.login({
      timeout:10000,
      success: (result)=>{
        resolve(result);
      },
      fail: (err)=>{reject(err)},
    });
  })
}

// /**
//  * promise 形式的 小程序的微信支付
//  * @param {object} pay 支付所必要的参数
//  */
// export const requestPayment=(pay)=>{
//   return new Promise((resolve,reject)=>{
//    wx.requestPayment({
//       ...pay,
//      success: (result) => {
//       resolve(result)
//      },
//      fail: (err) => {
//        reject(err);
//      }
//    });
     
//   })
// }
