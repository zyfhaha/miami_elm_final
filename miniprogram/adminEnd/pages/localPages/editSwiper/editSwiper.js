import { showActionSheet } from "../../../utils/asyncWX.js";
import { getSwiperCloud,getEmptySwiper, verifySwiperList } from "../../../lib/editSwiper/operation.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 图片
    _img: "",
    // 轮播图数组
    swiperList: [
      {
        swiperId: "fahwifjhoi",
        shopName: "测试商品名字1",
        order: 0,
        goodsCate: "测试类别",
        goodsName: "测试名字",
        detail: "测试详情",
        picUrl: "https://hannatiger.com/wp-content/uploads/2020/06/bourbon-every-buger-cookies.jpg",
      },
      {
        swiperId: "fahwi2fjhoi",
        shopName: "测试商品名字2",
        order: 1,
        goodsCate: "测试类别",
        goodsName: "测试名字",
        detail: "测试详情",
        picUrl: "cloud://env-miamielm-p3buy.656e-env-miamielm-p3buy-1302562420/scj2R7eL6r2Oi/logo1601681870420.jpg",
      },
      {
        swiperId: "fahwi3fjhoi",
        shopName: "测试商品名字3",
        order: 2,
        goodsCate: "测试类别",
        goodsName: "测试名字",
        detail: "测试详情",
        picUrl: "https://hannatiger.com/wp-content/uploads/2020/06/Edit-香菇拌饭酱1.jpg",
      },
    ],
  },

  // 点击预览商品大图
  handlePreviewImg(e) {
    const img = e.currentTarget.dataset.src;
    wx.previewImage({
      current: img,
      urls: [img],
    });
  },

  // 点击上传图片
  handleUploadImage(e) {
    const index = e.currentTarget.dataset.index;

    // 开启对img的监听
    this.watchImgChange((img) => {
      let swiperList = this.data.swiperList;
      swiperList[index].picUrl = this.data.img;
      this.setData({ swiperList });
    });
    console.log("index", index);
    wx.navigateTo({
      url: "../editGoodsPic/editGoodsPic",
    });
  },
  // 点击删除图片
  handleRemoveImg(e) {
    const index = e.currentTarget.dataset.index;
    console.log("index", index);
    let swiperList = this.data.swiperList;
    swiperList[index].picUrl = "";
    this.setData({ swiperList });
  },
  // 输入商店ID
  handleInputShopId(e) {
    const index = e.currentTarget.dataset.index;
    console.log("index", index);
    let swiperList = this.data.swiperList;
    swiperList[index].shopId = e.detail.value;
    this.setData({ swiperList });
  },
  // 输入商店名
  handleInputShopName(e) {
    const index = e.currentTarget.dataset.index;
    console.log("index", index);
    let swiperList = this.data.swiperList;
    swiperList[index].shopName = e.detail.value;
    this.setData({ swiperList });
  },
  // 改变轮播顺序
  async handleChangeOrder(e) {
    const index = e.currentTarget.dataset.index;
    console.log("index", index);
    let swiperList = this.data.swiperList;

    let itemList = [];
    for (let i = 0; i < swiperList.length; i++) {
      if (i !== index) {
        itemList.push(String(i + 1));
      }
    }

    let tapIndex = await showActionSheet(itemList);
    tapIndex = tapIndex === 0 ? 0 : "";
    console.log("tapIndex", tapIndex);

    if (tapIndex === "") {
      return;
    }
    const newOrder = Number(itemList[tapIndex]) - 1;
    console.log("newOrder", newOrder);
    swiperList[index].order = newOrder;

    if (index < newOrder) {
      console.log("下");

      for (let i = index + 1; i < newOrder + 1; i++) {
        swiperList[i].order -= 1;
      }
    } else {
      console.log("上");
      for (let i = newOrder; i < index; i++) {
        swiperList[i].order += 1;
      }
    }
    swiperList.sort((v1, v2) => {
      return v1.order - v2.order;
    });
    this.setData({ swiperList });
  },
  // 输入商品类别名称
  handleInputGoodsCate(e) {
    const index = e.currentTarget.dataset.index;
    console.log("index", index);
    let swiperList = this.data.swiperList;
    swiperList[index].cateName = e.detail.value;
    this.setData({ swiperList });
  },
  // 输入商品名字
  handleInputGoodsName(e) {
    const index = e.currentTarget.dataset.index;
    console.log("index", index);
    let swiperList = this.data.swiperList;
    swiperList[index].goodsName = e.detail.value;
    this.setData({ swiperList });
  },
  // 输入轮播图简要介绍
  handleInputDetail(e) {
    const index = e.currentTarget.dataset.index;
    console.log("index", index);
    let swiperList = this.data.swiperList;
    swiperList[index].detail = e.detail.value;
    this.setData({ swiperList });
  },

  // 增加轮播图
  handleAddSwiper(e) {
    const index = e.currentTarget.dataset.index;
    console.log("index", index);

    let swiperList = this.data.swiperList;
    for (let i = index + 1; i < swiperList.length; i++) {
      swiperList[i].order += 1;
    }
    swiperList.splice(index + 1, 0, getEmptySwiper(index));
    this.setData({ swiperList });
  },

  // 删除轮播图
  handleDeleteSwiper(e) {
    const index = e.currentTarget.dataset.index;
    console.log("index", index);

    let swiperList = this.data.swiperList;
    for (let i = index + 1; i < swiperList.length; i++) {
      swiperList[i].order -= 1;
    }
    swiperList.splice(index, 1);
    this.setData({ swiperList });
  },

  // 保存轮播图数据
  async handleSaveSwiper(e) {
    const newSwiperList = this.data.swiperList;

    // 检查swiperList合法性
    if(!verifySwiperList(newSwiperList)){
      return
    }

    const oldSwiperList = this.swiperList

    // 更新swiperList
    await updateSwiperListCloud(newSwiperList, oldSwiperList)
    await this.refreshEditSwiper()
  },

  async refreshEditSwiper(){
    const swiperList = await getSwiperCloud()
    this.swiperList = swiperList
    this.setData({swiperList})
  },

  // =========  监听img是否被修改 ==============
  watchImgChange(method) {
    //method是一个函数
    let obj = this.data;
    Object.defineProperty(obj, "img", {
      configurable: true,
      enumerable: true,
      get: function () {
        return this._img;
      },
      set: function (value) {
        this._img = value;
        method(value);
      },
    });
  },

  async onPullDownRefresh(){
    await this.refreshEditSwiper()
    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await this.refreshEditSwiper()
  },
});
