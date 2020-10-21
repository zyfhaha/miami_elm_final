import { showLoading, hideLoading, showToast } from "../../../utils/asyncWX.js";
import { getSwiperListCloud, getSelfRunShopListCloud, getRecommendShopListCloud } from "../../../lib/home/operation.js";

Page({
  data: {
    // 轮播图数据
    swiperList: [],
    // 推荐店铺数组
    recommendShopList: [],
    // 自营店数组
    selfRunShopList: [],
  },

  /*============= 方法 =========================*/

  // 刷新首页
  async refreshHomePage() {
    const res = await Promise.all([getSwiperListCloud(), getSelfRunShopListCloud(), getRecommendShopListCloud()]);
    const swiperList = res[0];
    console.log("swiperList", swiperList);

    const selfRunShopList = res[1];
    const recommendShopList = res[2];

    this.setData({ swiperList, selfRunShopList, recommendShopList });
  },

  // 用户点击首页swiper
  handleTapSwiper(e) {
    const index = e.currentTarget.dataset.index;
    const swiper = this.data.swiperList[index];
    console.log("用户点击轮播图", index);

    wx.navigateTo({
      url: swiper.navigatorUrl,
    });
  },

  async onPullDownRefresh() {
    await showLoading();
    await this.refreshHomePage();
    await showToast("已刷新");
    wx.stopPullDownRefresh();
  },

  /*==================== 页面生命周期函数 ===========================*/
  // 页面开始加载 就会触发
  async onLoad(options) {
    await showLoading();
    await this.refreshHomePage();
    await hideLoading();
  },
});
