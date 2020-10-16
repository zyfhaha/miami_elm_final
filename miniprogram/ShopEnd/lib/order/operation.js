import {showLoading,hideLoading} from "../../utils/asyncWX.js"
import { CanI } from "../accessControl/operation.js";
let app=getApp()
const db = wx.cloud.database({
  env: "env-miamielm-p3buy",
});
// 获取最近一周的订单
export async function getRecentOrderCloud(shopId, pageNum) {
  let res = await wx.cloud.callFunction({
    name: "get_order_shop",
    data: {
      shopId: shopId,
      type: "recent",
      pageNum: pageNum,
    },
  });
  return res;
}

// 获取一周前的订单
export async function getOldOrderCloud(shopId, pageNum) {
  let res = await wx.cloud.callFunction({
    name: "get_order_shop",
    data: {
      shopId: shopId,
      type: "old",
      pageNum: pageNum,
    },
  });
  return res;
}

// 获取未完成的订单
export async function getUncompleteOrderCloud(shopId) {
  let res = await wx.cloud.callFunction({
    name: "get_order_shop",
    data: {
      shopId: shopId,
      type: "uncomplete",
    },
  });
  return res;
}

//取消订单
export async function cancelOrderCloud(orderId,cancelReason){
  if (!(await CanI("order"))) {
    console.log("无操作权限");
    return;
  }
  let updateInfo = {
    orderId: orderId,
    updateType: -1,
    cancelReason:cancelReason
  };
  const res = await wx.cloud.callFunction({
    name: "update_shop_order_status",
    data: {
      updateInfo: updateInfo,
    },
  });
  return res
}

//商家接单
export async function acceptOrderCloud(orderId, openid){
  if (!(await CanI("order"))) {
    console.log("无操作权限");
    return;
  }
  console.log(app.globalData.shopInfo);
  
  let updateInfo = {
    orderId: orderId,
    updateType: 1,
  };
  const res = await wx.cloud.callFunction({
    name: "update_shop_order_status",
    data: {
      updateInfo: updateInfo,
    },
  });
  if(res){
    console.log("accept res",res);
    
    await wx.cloud.callFunction({
      name: "send_user_message",
      data: {
        openid: openid,
        orderId: orderId,
        shopName: app.globalData.shopInfo.shopName,
        phoneNumber: app.globalData.shopInfo.shopPhoneNumber,
        handleTime:res.result.handleTime,
        action: "sendAcceptMessage",
      },
    });
  }
  return res
}

//商家完成捡货并开始配送
export async function deliverOrderCloud(orderId, openid){
  if (!(await CanI("order"))) {
    console.log("无操作权限");
    return;
  }
  let updateInfo = {
    orderId: orderId,
    updateType: 2,
  };
  const res = await wx.cloud.callFunction({
    name: "update_shop_order_status",
    data: {
      updateInfo: updateInfo,
    },
  });
  if(res){
    await wx.cloud.callFunction({
      name: "send_user_message",
      data: {
        openid: openid,
        orderId: orderId,
        deliverTime:res.result.deliverTime,
        action: "sendFinishPickGoodsMessage",
      },
    });
  }
  return res
}

//订单已送达
export async function completeOrderCloud(orderId, openid){
  if (!(await CanI("order"))) {
    console.log("无操作权限");
    return;
  }
  let updateInfo = {
    orderId: orderId,
    updateType: 3,
  };
  const res = await wx.cloud.callFunction({
    name: "update_shop_order_status",
    data: {
      updateInfo: updateInfo,
    },
  });
  if(res){
    await wx.cloud.callFunction({
      name: "send_user_message",
      data: {
        openid: openid,
        orderId: orderId,
        completeTime:res.result.completeTime,
        action: "sendArrivedMessage",
      },
    });
  }
  return res
}

//开始监听新订单
export async function startWatchOrder(user2shop){
  let accessInfo = {
    access:user2shop.access, // 用户的权限
    role:user2shop.role,     // 用户的角色
    shopId:user2shop.shopId, // 用户所在的商店
    _id:user2shop._id,
  }
  console.log("accessinfo",accessInfo);
  
  const watcher = db.collection('order').where(
    {
      shopId:accessInfo.shopId,
      status: 0,
    }).watch({
    onChange: async function(snapshot) {
      console.log('snapshot_order', snapshot)
      let orderChange = snapshot.docChanges[0];
      if (!!orderChange && orderChange.dataType === "update" && orderChange.updatedFields.status === 0){
        console.log("有新订单");
        //TODO新订单来的时候的具体操作
        let pages = getCurrentPages(); // 获取页面栈
        let curPage = pages[pages.length - 1];//获取当前页面
        if (curPage.data.newOrder != undefined){        
          let newOrder= curPage.data.newOrder
          console.log("neworder",orderChange.doc);
          newOrder.push(orderChange.doc)
          newOrder.sort(function(v1,v2){
            if (v1.selDeliverTime!== v2.selDeliver){
              return v1.selDeliverTime-v2.selDeliverTime
            }
            else{
              return v1.payTime - v2.payTime
            }
          })
          curPage.setData({newOrder:newOrder})
          //curPage.refreshOrder()
        }
        else{
          app.globalData.refreshFlag.orderProcess = true
          //TODO加上小红点
        }
      }
    },
    onError: function(err) {
      console.error('the watch closed because of error', err)
    }
  })
}