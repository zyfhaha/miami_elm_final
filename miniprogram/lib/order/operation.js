import { showLoading, hideLoading } from "../../utils/asyncWX.js";

// 获取未完成的订单
export async function getUncompleteOrderCloud(pageNum) {
  // await new Promise((resolve,reject)=>{
  //   setTimeout(()=>{resolve()},5000)
  // })
  const res = await wx.cloud.callFunction({
    name: "get_order_user",
    data:{
      type:"uncomplete",
      pageNum:pageNum
    }
  });
  return res;
}

// 获取完成的订单
export async function getCompleteOrderCloud(pageNum) {
  const res = await wx.cloud.callFunction({
    name: "get_order_user",
    data:{
      type:"complete",
      pageNum:pageNum
    }
  });
  return res;
}

// 取消订单
export async function cancelOrderCloud(orderId, cancelReason) {
  //
  console.log("用户取消订单");
  await showLoading();
  let updateInfo = {
    orderId: orderId,
    updateType: -1,
    cancelReason:cancelReason
  };
  const res = await wx.cloud.callFunction({
    name: "update_user_order_status",
    data: {
      updateInfo: updateInfo,
    },
  });
  await hideLoading();
  console.log(res);

  return res.result;
}
