import { verifyAddressInfo, addAddressItem, getAddressItem, updateAddressItem, removeAddressItem } from "../../../lib/address/operation.js";
import { showToast, showModal } from "../../../utils/asyncWX.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 地址信息
    addressInfo: {},
    // 具体的收获地址信息
    address: {},
  },

  /*============== 事件处理函数 ===============*/
  // 用户点击收货地址
  handleTapAddress() {
    let current_address = encodeURIComponent(JSON.stringify(this.data.address));
    wx.navigateTo({
      url: "../map/map?current_address=" + current_address,
    });
  },

  // 用户点击删除（能点击删除则说明addressId必然是存在的，不然删除按钮根本不会显示）
  async handleDeleteAddressInfo() {
    const modalRes = await showModal("确认删除？");
    if (modalRes.cancel) {
      return;
    }
    const addressId = this.data.addressInfo.addressId;
    let removeRes = removeAddressItem(addressId);
    if (removeRes) {
      wx.navigateBack({
        delta: 1,
        success: () => {
          showToast("删除成功");
        },
      });
    }
  },

  // 用户点击保存
  async handleSaveAddressInfo(e) {
    let newAddressInfo = e.detail.value;
    console.log("newAddressInfo", newAddressInfo);
    // 校验addressInfo
    const verifyRes = await verifyAddressInfo(newAddressInfo);
    if (!verifyRes) {
      return;
    }
    // 保存到本地缓存
    // 通过this.data.addressInfo的Id是否为空来判断是增加一个地址还是修改已有的地址
    const addressId = this.data.addressInfo.addressId || "";

    let saveRes;
    if (!addressId) {
      // 增加一个地址
      saveRes = addAddressItem(newAddressInfo);
    } else {
      // 修改一个地址
      newAddressInfo.addressId = addressId;
      saveRes = updateAddressItem(newAddressInfo);
    }
    if (saveRes !== -1) {
      wx.navigateBack({
        delta: 1,
        success: () => {
          showToast("保存成功");
        },
      });
    }
  },


  /*============== 页面生命周期函数 ===============*/

  onLoad: function (options) {
    let addressId = options.addressId || "";
    if (!addressId) {
      return;
    }
    let addressInfo = getAddressItem(addressId);
    this.setData({
      addressInfo,
    });
  },
});
