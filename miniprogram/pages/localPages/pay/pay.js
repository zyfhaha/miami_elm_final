import { getShopCart, removeShopCart, removeGoods, clearShopCart, changeGoodsNum } from "../../../lib/cart/operation.js";
import { showLoading, hideLoading, showModal, showToast, requestSubscribeMessage, openSetting, isConnected } from "../../../utils/asyncWX.js";
import { isReceiveTimeValid, getReceiveTimeGroup, verifyOrderInfo, placeOrderCloud } from "../../../lib/pay/operation.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 地址信息
    addressInfo: {},
    // 收货时间
    receiveTime: -1,
    // 预订单信息
    preOrderInfo: {},

    /*******  选择预定送达时间用到的页面数据  *******/
    tabs: [{ title: "今天" }, { title: "明天" }], // 可以选择的tab
    activeTab: 0, // 默认的被选中的tab索引
    // 预定收货时间
    receiveTimeGroup: [],

    // 订单备注内容
    note: "",
  },

  // 商店信息
  shopInfo: {},
  // 预订单信息
  preOrderInfo: {},

  // ========================================================================
  // ========================================================================
  // ====================== 选择预定送达时间相关函数===========================
  // ========================================================================
  // ========================================================================

  // 生成预定收货时间选项
  setReceiveTimeGroup(shopInfo) {
    let { cutOrderTime, deliverTimeList } = shopInfo;

    // TODO 测试完后可以删
    // deliverTimeList = ["00:00","01:03","05:06","06:07","08:09"]

    let nowTimeStamp = new Date().getTime();
    let tomorrTimeStamp = nowTimeStamp + 1 * 24 * 60 * 60 * 1000;

    let now = new Date(nowTimeStamp);
    let tomorrow = new Date(tomorrTimeStamp);

    // 今天的月日
    let nowMonth = now.getMonth() + 1;
    let nowDay = now.getDate();
    //明天的月日
    let tomorrMonth = tomorrow.getMonth() + 1;
    let tomorrDay = tomorrow.getDate();

    let tabs = [{ title: ["今天 ", nowMonth, "月", nowDay, "日"].join("") }, { title: ["明天 ", tomorrMonth, "月", tomorrDay, "日"].join("") }];
    let receiveTimeGroup = getReceiveTimeGroup(deliverTimeList, cutOrderTime);
    this.setData({ tabs, receiveTimeGroup });
  },

  // 点击展开选择送到时间actionsheet
  handleShowReceiveTimePicker() {
    this.setReceiveTimeGroup(this.shopInfo);
    this.showReceiveTimePicker();
  },

  // 点击选择 “今天”或者“明天”的tab
  onTabCLick(e) {
    const index = e.detail.index;
    this.setData({ activeTab: index });
  },

  // 滑动选择 “今天”或者“明天”的tab
  onChange(e) {
    const index = e.detail.index;
    this.setData({ activeTab: index });
  },

  // 用户要选择收货时间
  handleSelReceiveTime(e) {
    const receiveTime = e.currentTarget.dataset.timestamp;
    this.setData({ receiveTime });
    this.closeReceiveTimePicker();
  },

  // ========================================================================
  // ========================================================================
  // =========================    购物相关函数  =============================
  // ========================================================================
  // ========================================================================

  // 打扫购物车--将购物车中的invalid unAvailable goods删掉 并将缺货商品的购买量改为当前库存量
  cleanShopCart(preOrderInfo) {
    console.log("开始清理");
    let { inValidGoods, unAvailableGoods, shortOfStockGoods, shopId } = preOrderInfo;
    let shopCart = getShopCart(shopId);

    console.log("inValidGoods", inValidGoods);
    inValidGoods.forEach((v) => {
      removeGoods(shopId, v, shopCart);
    });
    unAvailableGoods.forEach((v) => {
      removeGoods(shopId, v, shopCart);
    });

    shortOfStockGoods.forEach((v) => {
      changeGoodsNum(shopId, v, v.goodsStock, shopCart);
    });
  },

  // 用户点击下单
  async handlePay() {
    // 获取订单详情并对订单详情进行检查
    let orderInfo = {
      orderId: this.preOrderInfo.orderId,
      selDeliverTime: this.data.receiveTime,
      note: this.data.note || "顾客未填写",
      ...this.data.addressInfo,
    };

    let verifyRes = verifyOrderInfo(orderInfo);
    if (!verifyRes.isValid) {
      await showModal("下单失败", verifyRes.message);
      return;
    }

    // 用户对订阅消息进行设置前需要检查一下网络 不然api会卡很久才报网络错误
    if (!isConnected()) {
      showModal("下单失败", "请检查网络后重试");
      return;
    }
    const reqSubMsgRes = await requestSubscribeMessage("order");
    orderInfo.allowNotifyOrderComplete = reqSubMsgRes.COMPLETE_ORDER;

    // 下单时再次检测选择的配送时间是否合法来避免用户提前选择一个配送时间后长时间挂机直到截单后再下单
    if (!isReceiveTimeValid(new Date().getTime(), orderInfo.selDeliverTime, this.shopInfo.cutOrderTime)) {
      await showModal("下单失败", "当前选择的配送时间已截单\n请重新选择配送时间");
      return;
    }
    console.log("下单成功");
    

    // 用户对订阅消息进行设置后需要再次检查一下网络
    if (!isConnected()) {
      showModal("下单失败", "请检查网络后重试");
      return;
    }

    // 开始下单
    const res = await placeOrderCloud(orderInfo);
    if (res) {
      wx.redirectTo({
        url: "../confirmOrder/confirmOrder?reqSubMsgRes=" + JSON.stringify(reqSubMsgRes),
        success: () => {
          clearShopCart(this.preOrderInfo.shopId);
        },
      });
    }
  },

  // 用户要添加备注
  async handleTapNote() {
    const note = this.data.note;
    wx.navigateTo({
      url: "../editNote/editNote?note=" + encodeURIComponent(note),
    });
  },

  // TODO 订单页面应该展示商品的价格为 单价x数量 这个数据应该由后台控制 现在暂时用wxml内计算显示得到 记得删除wxml顶部的引用

  /* =============== 页面生命周期函数 ==================*/

  async onLoad(options) {
    /*
      1 在此将商家的shopId, 用户购买的商品信息(goods) 上传到后台
      2 后台通过shopId找到商店并确认商店现在处于可以接单的状态 否则返回数据说商店现在不接单
      3 若后台确认商家可以接单，则后台通过goods里的信息重新计算一遍总价 并检查商品的有效性
      4 后台将校验后的购物车数据发回给前端
        前端需要先对errCode进行判断
        if errCode === 100 说明商店已经不在平台 
          showModal告知用户 
          用户点击确定或取消后退回上一页面并消除用户关于这个商店的购物车数据缓存
        if errCode === 101 说明商店在平台 但是现在不营业 
          showModal告知用户 用户点击确定或取消后退回上一页面
        if errCode === 200 说明商店在平台 现在营业 
          用户确认订单无误后可以点击下单
      5 用户端展示订单
    */
    const shopId = options.shopId;
    const shopCart = getShopCart(shopId);

    if (!isConnected()) {
      await showModal("操作失败", "请检查网络后重试");
      wx.navigateBack({
        delta: 1,
      });
      return;
    }

    // 下预订单
    await showLoading();
    const res = await wx.cloud.callFunction({
      name: "make_pre_order",
      data: { shopCart: shopCart },
    });
    await hideLoading();

    console.log("res", res);
    const errCode = res.result.errCode;
    console.log("errCode", errCode);

    // 商店已经不在平台
    if (errCode === 100) {
      await showModal("该商店已不存在");
      removeShopCart(shopId);
      wx.navigateBack({
        delta: 1,
      });
      return;
    }

    // 说明商店在平台 但是现在不营业
    if (errCode === 101) {
      await showModal("商店暂停接单");
      wx.navigateBack({
        delta: 1,
      });
      return;
    }

    // 商店在平台 现在也营业 可以接单
    if (errCode === 200) {
      const { preOrderInfo, shopInfo } = res.result;
      this.shopInfo = shopInfo;
      this.preOrderInfo = preOrderInfo;
      console.log("preOrderInfo", preOrderInfo);
      this.setData({ preOrderInfo });
      // 清理购物车
      this.cleanShopCart(preOrderInfo);
    }
  },

  onReady() {
    // 指定组件 为定义showCart做准备
    this.popupActionsheet = this.selectComponent("#popupActionsheet"); //组件的id
  },

  // 定义一个与actionsheet组件里的__showMaster同名的函数方便页面调用
  showReceiveTimePicker() {
    console.log("showReceiveTimePicker");
    this.popupActionsheet.__showMaster(); //组件里里面定义的__showMaster方法
  },
  // 定义一个与actionsheet组件里的__closeMaster同名的函数方便页面调用
  closeReceiveTimePicker() {
    this.popupActionsheet.__closeMaster(); //组件里里面定义的__closeMaster方法
  },
});
