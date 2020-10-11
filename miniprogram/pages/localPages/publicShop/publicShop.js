import {
  add,
  subtract,
  times,
  divide
} from "../../../lib/calculate/calculate.js";
import {
  hasShopCart,
  addShopCart,
  getShopCart,
  addGoods,
  reduceGoods,
  clearShopCart
} from "../../../lib/cart/operation.js";
import {
  showLoading,
  hideLoading,
  showModal,
  showActionSheet
} from "../../../utils/asyncWX.js"

// 初始化云环境
const db = wx.cloud.database();
// 这里只获取shop和goodsCate的索引 goods通过云函数获得
const ugShopRef = db.collection("ugShop");

Page({
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0,
    // 刷新的flag
    refreshFlag: false,
  },
  // 分类数据
  cates: [],
  shopInfo: {},
  // ===========   公共商店特有的函数 ==================
  async handleTapAddBtn() {
    const actionSheetRes = await showActionSheet(["发布商品", "我的发布"])
    const {
      tapIndex
    } = actionSheetRes

    // 用户点击【发布商品】
    if (tapIndex === 0) {
      // 准备分类数据以备顾客选择要发布的商品类型
      let cateInfo = []
      this.cates.forEach(v => {
        let temp = {
          cateId: v.cateId,
          cateName: v.cateName
        }
        cateInfo.push(temp)
      })

      const cateInfoURI = encodeURIComponent(JSON.stringify(cateInfo))


      wx.navigateTo({
        url: '../addGoods/addGoods?shopId=' + this.shopInfo.shopId + "&cateInfoURI=" + cateInfoURI,
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      });
    }

    // 用户点击【我的发布】
    if (tapIndex === 1) {
      wx.navigateTo({
        url: '../myGoods/myGoods',
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      });
    }

  },

  /* ================  页面事务处理函数 ==============*/
  // 刷新页面
  async handleRefresh() {
    this.setData({
      refreshFlag: true
    });
    await this.getShopDetail(this.shopInfo.shopId);
    this.setData({
      refreshFlag: false,
      rightContent: this.cates[this.data.currentIndex].goods
    });
    wx.showToast({title: '已刷新'})
  },
  async getShopDetail(shopId) {

    // 首先获取商店信息详情
    const res1 = await ugShopRef.where({
      shopId: shopId
    }).field({
      shopId: true,
      shopName: true,
      minConsumption: true
    }).get()
    // console.log("res1",res1);

    this.shopInfo = res1.data[0] //小程序端调用数据库返回的数据即便只有一条也是封装在数组中的
    // console.log("shopInfo",this.shopInfo);

    // 获取商店的商品数据
    let res2 = await wx.cloud.callFunction({
      name: "get_shop_ugGoods",
      data: {
        shopId: shopId,
        requireType: "all"
      }
    })
    const {
      allGoods
    } = res2.result
    console.log("allGoods", allGoods)

    let cates = allGoods;
    this.cates = cates;
    //======================

    // 构造左侧的大菜单数据
    let leftMenuList = cates.map((v) => v.cateName);
    // 构造右侧的商品数据
    let rightContent = cates[0].goods;
    // 给页面数据赋值
    this.setData({
      leftMenuList,
      rightContent,
    });
  },


  // 左侧菜单的点击事件
  handleItemTap(e) {
    /* 
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值就可以了
    3 根据不同的索引来渲染右侧的商品内容
     */
    const {
      index
    } = e.currentTarget.dataset;

    let rightContent = this.cates[index].goods;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0,
    });
  },

  // 点击商品图片跳转到商品详情
  handleTapGoods(e) {
    let {
      index
    } = e.currentTarget.dataset;

    // 准备要传递给商品详情页面的数据
    let shopInfo = encodeURIComponent(JSON.stringify({...this.shopInfo}));
    let goodsInfo = encodeURIComponent(
      JSON.stringify({
        ...this.data.rightContent[index]
      })
    );
    wx.navigateTo({
      url: "../ugGoodsDetail/ugGoodsDetail?shopInfo=" + shopInfo + "&goodsInfo=" + goodsInfo
    });
  },

  /* ===================== 页面生命周期函数 ================== */

  async onLoad(options) {
    // 从购物车页面转来需要获取shopId
    // const {
    //   shopId
    // } = options;
    const shopId = "XauzkdyMJjf9qs"
    console.log(shopId);
    // 获取商店及其商品的数据
    try {
      await showLoading()
      await this.getShopDetail(shopId);
      //更改导航栏标题为商店名
      wx.setNavigationBarTitle({
        title: this.shopInfo.shopName
      });
    } catch (error) {
      console.log(error);
      showModal("网络错误")
    } finally {
      await hideLoading()
    }
  },
});