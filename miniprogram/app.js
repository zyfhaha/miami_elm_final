import { createGlobalCart } from "./lib/cart/operation.js";
import { createGlobalAddress } from "./lib/address/operation.js";
App({
  onLaunch() {
    wx.cloud.init({
      env: "env-miamielm-p3buy",
      traceUer: true,
    });
    // 监听网络状态变化
    (this.globalData = {}),
      wx.getNetworkType({
        success: (res) => {
          this.globalData.isConnected = res.networkType !== "none";
        },
      });
    wx.onNetworkStatusChange((res) => {
      this.globalData.isConnected = res.isConnected;
    });
    this.globalData.refreshFlag = {
      myGoods: true,
    };
  },

  onShow() {
    // 检查用户是否有全局购物车数据 为空的话就新建一个
    if (!wx.getStorageSync("cart")) {
      createGlobalCart();
    }
    // 检查用户是否有全局地址数据 为空的话就新建一个
    if (!wx.getStorageSync("address")) {
      createGlobalAddress();
    }
  },

  onError(e) {
    console.log(e);
  },
});
