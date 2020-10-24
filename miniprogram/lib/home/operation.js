const db = wx.cloud.database();
const advertiseSwiperRef = db.collection("advertiseSwiper");
const ugShopRef = db.collection("ugShop");
const shopRef = db.collection("shop");

// 获取首页顶端swiper数据
export async function getSwiperListCloud() {
  const swiperRes = await advertiseSwiperRef.where({ isExist: true }).orderBy("order", "asc").get();
  return swiperRes.data;
}

// 获取自营店数据
export async function getSelfRunShopListCloud() {
  const ugShopRes = await ugShopRef
    .where({
      isActivated: true,
      isExist: true,
      shopCate: 2,
    })
    .get();
  return ugShopRes.data;
}

// 获取推荐商店数据
export async function getRecommendShopListCloud() {
  //TODO
  const recommendShopRes = await shopRef
    .where({
      isActivated: true,
      isExist: true,
    })
    .field({
      // 只返回下列字段
      shopId: true,
      shopName: true,
      logoUrl: true,
      shopStatus: true,
      minConsumption: true,
    })
    .orderBy("order", "asc")
    .get();
  return recommendShopRes.data;
}
