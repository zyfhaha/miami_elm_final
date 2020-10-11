import {openSetting} from "../../../utils/asyncWX.js"

Page({
  data: {
    // 用户信息
    userinfo:{},
  },

  // 用户点击登出客户端
  handleLogOut(){
    wx.reLaunch({
      url: '../selAppEnd/selAppEnd',
    })
  },

  // 用户点击权限管理
  async handleManageAuth(){
    const res = await openSetting()
  },

  onShow(){
    //获取用户信息
    const userinfo=wx.getStorageSync("userinfo");
    //储存用户信息到data的userinfo内
    this.setData({userinfo});
  }
})