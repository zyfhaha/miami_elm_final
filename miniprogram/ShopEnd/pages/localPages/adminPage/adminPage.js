import { showToast, showLoading, hideLoading, showModal } from "../../../utils/asyncWX.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showInputDialog: false,
  },

  // 生成商店注册码
  handleGenerateOwnerRegistCode() {
    this.setData({ showInputDialog: true });
  },

  async handleInputResult(e) {
    const dialogRes = e.detail;
    if (dialogRes.cancel) {
      this.setData({ showInputDialog: false });
      return;
    }

    if (dialogRes.confirm) {
      const code = dialogRes.dialogInput.trim();
      console.log("code", code);
      /^\d{7,}$/;
      if (!/^\d+$/.test(code)) {
        showToast("商店注册码需为7位数字");
        return;
      }
      this.setData({ showInputDialog: false });
      showLoading();
      const res = await wx.cloud.callFunction({
        name: "admin_operation",
        data: {
          type: "addShopRegistCode",
          code: code,
        },
      });
      console.log("res", res);
      hideLoading();
      if (res) {
        wx.setClipboardData({
          data: "嗨！~这是您在微信小程序「小鳄鱼跑腿」的商店注册码\n\n" + code + "\n\n请在小程序内点击进入商家端，点击「新商入驻」后输入此注册码即可！",
          success(res) {
            wx.hideToast();
          },
        });

        await showModal("操作提示", "成功生成商店邀请码：\n\n" + code + "\n\n邀请码已复制到剪贴版");
        return;
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
