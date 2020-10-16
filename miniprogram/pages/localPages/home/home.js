import { showLoading, hideLoading, showToast } from "../../../utils/asyncWX.js";

// 测试用
import { setShopCart } from "../../../lib/cart/operation.js";
const db = wx.cloud.database();
const shopRef = db.collection("shop");
const ugShopRef = db.collection("ugShop");
// ===========

Page({
  data: {
    // 轮播图数组
    swiperList: [
      {
        image_src:
          "https://hannatiger.com/wp-content/uploads/2020/07/海底捞-品牌专区.jpg",
        open_type: "navigate",
        goods_id: "",
        navigator_url: "",
      },
      {
        image_src: "https://hannatiger.com/wp-content/uploads/2020/06/糖果.jpg",
        open_type: "navigate",
        goods_id: "",
        navigator_url: "",
      },
      {
        image_src:
          "https://hannatiger.com/wp-content/uploads/2020/06/腌菜泡菜.jpg",
        open_type: "navigate",
        goods_id: "",
        navigator_url: "",
      },
      {
        image_src:
          "https://hannatiger.com/wp-content/uploads/2020/06/速食饭菜-1.jpg",
        open_type: "navigate",
        goods_id: "",
        navigator_url: "",
      },
      {
        image_src: "https://hannatiger.com/wp-content/uploads/2020/06/挂面.jpg",
        open_type: "navigate",
        goods_id: "",
        navigator_url: "",
      },
    ],
    // 推荐店铺数组
    recommendShopList: [],

    // 自营店数组
    selfRunShopList: [],
  },

  /*============= 方法 =========================*/

  // 获取轮播图数据
  getSwiperList() {
    request({
      url: "/home/swiperdata",
    }).then((result) => {
      this.setData({
        swiperList: result,
      });
    });
  },

  async onPullDownRefresh() {
    // TODO 获取真正的数据时将代码释放即可，注意修改获取方法中的url
    await showLoading();
    // this.getSwiperList();
    await this.getRecommendShopList();
    await hideLoading();
    await showToast("已刷新");
    wx.stopPullDownRefresh();
  },

  // 获取自营店数组
  async getSelfRunShopList() {
    let res = await ugShopRef
      .where({
        isActivated: true,
        isExist: true,
        shopCate: 2,
      })
      .get();
    console.log("res", res);
    this.setData({
      selfRunShopList: res.data,
    });
  },

  // 获取推荐店铺数据
  async getRecommendShopList() {
    // TODO 需要专门建立一个推荐店铺数据库 目前就先返回所有的店铺 记得处理云数据库的返回数据量限制

    let res = await shopRef
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
      .get();
    this.setData({
      recommendShopList: res.data,
    });
  },

  /*==================== 页面生命周期函数 ===========================*/
  // 页面开始加载 就会触发
  async onLoad(options) {
    let a = aaa + 3;
    await showLoading();
    // TODO 获取真正的数据时将代码释放即可，注意修改获取方法中的url
    // this.getSwiperList();
    await this.getSelfRunShopList();
    await this.getRecommendShopList();
    await hideLoading();

    /* 测试用
    const shopCart = {
      "shopId": "FbAIRZz5Nc0wax",
      "shopName": "Hanna&Tiger Asian Mart 小卖部",
      "minConsumption": 700,
      "totalPrice": 9999.99,
      "totalNum": 99,
      "goods": [{
          "_id": "3ad8d6305f34b781006c5bff7905b5c2",
          "goodsId": "nUEr6f8bVTJzC",
          "goodsName": "测试商品95",
          "goodsPicUrl": "https://hannatiger.com/wp-content/uploads/2020/06/红叶梅菜干.jpg",
          "goodsPrice": 40.86,
          "goodsBuyLimit": 89,
          "goodsStock": 15,
          "goodsAvailable": true,
          "goodsDetail": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, minus suscipit facilis doloremque nisi necessitatibus. Iste soluta commodi eaque. Fuga vero, nisi officiis omnis alias voluptatem tempore asperiores soluta velit",
          "goodsOrder": 45,
          "shopId": "itoy7Q3q2AmzNYckO041FuTasX8f",
          "cateId": "oZqpXGvNHOE84",
          "isExist": true,
          "num": 25
        },
        {
          "_id": "3ad8d6305f34b781006c64c33102d688",
          "goodsId": "m3VWnxYePhupK",
          "goodsName": "2测试商品332",
          "goodsPicUrl": "https://hannatiger.com/wp-content/uploads/2020/06/cqua麒麟果.jpg",
          "goodsPrice": 35.92,
          "goodsBuyLimit": 66,
          "goodsStock": 906,
          "goodsAvailable": true,
          "goodsDetail": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, minus suscipit facilis doloremque nisi necessitatibus. Iste soluta commodi eaque. Fuga vero, nisi officiis omnis alias voluptatem tempore asperiores soluta velit",
          "goodsOrder": 32,
          "shopId": "ZI7oUs8LuiFB0lkPSQWMhe6gDfm5",
          "cateId": "ke4VmKHaL9TF3",
          "isExist": "true",
          "num": 1
        },
        {
          "_id": "3ad8d6305f34b781006c66d9312a6868",
          "goodsId": "QvxNLfIem7UOD",
          "goodsName": "2测试商品866",
          "goodsPicUrl": "https://hannatiger.com/wp-content/uploads/2020/06/cqua麒麟果.jpg",
          "goodsPrice": 5.13,
          "goodsBuyLimit": 3,
          "goodsStock": 589,
          "goodsAvailable": true,
          "goodsDetail": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, minus suscipit facilis doloremque nisi necessitatibus. Iste soluta commodi eaque. Fuga vero, nisi officiis omnis alias voluptatem tempore asperiores soluta velit",
          "goodsOrder": 16,
          "shopId": "DehKQdxPmq7oCtzUnXJy8YL1bH53",
          "cateId": "oZqpXGvNHOE84",
          "isExist": "true",
          "num": 1
        },
        {
          "_id": "3ad8d6305f34b781006c699b59fc8a76",
          "goodsId": "E4lc5jhaovCRI",
          "goodsName": "2测试商品1572",
          "goodsPicUrl": "https://hannatiger.com/wp-content/uploads/2020/06/Edit-爆炒金針菇280g4.jpg",
          "goodsPrice": 100.21,
          "goodsBuyLimit": 14,
          "goodsStock": 513,
          "goodsAvailable": true,
          "goodsDetail": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, minus suscipit facilis doloremque nisi necessitatibus. Iste soluta commodi eaque. Fuga vero, nisi officiis omnis alias voluptatem tempore asperiores soluta velit",
          "goodsOrder": 22,
          "shopId": "itoy7Q3q2AmzNYckO041FuTasX8f",
          "cateId": "I9Ja3bfKl6VYt",
          "isExist": false,
          "num": 15
        },
        {
          "_id": "3ad8d6305f34b781006c62e346960b48",
          "goodsId": "jC1beWRX9PNw8",
          "goodsName": "测试商品1852",
          "goodsPicUrl": "https://hannatiger.com/wp-content/uploads/2020/06/cqua麒麟果.jpg",
          "goodsPrice": 39.74,
          "goodsBuyLimit": 63,
          "goodsStock": 735,
          "goodsAvailable": true,
          "goodsDetail": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, minus suscipit facilis doloremque nisi necessitatibus. Iste soluta commodi eaque. Fuga vero, nisi officiis omnis alias voluptatem tempore asperiores soluta velit",
          "goodsOrder": 2,
          "shopId": "yufdX2i5lCJzHrFWxjA8tqVZpLSN",
          "cateId": "1NdDcq5nCRfp9",
          "isExist": false,
          "num": 13
        },
        {
          "_id": "3ad8d6305f34b781006c5ed26a9b5bb5",
          "goodsId": "WFtafgml7iRGL",
          "goodsName": "测试商品818",
          "goodsPicUrl": "https://hannatiger.com/wp-content/uploads/2020/06/李婆婆私房酸辣粉.jpg",
          "goodsPrice": 19.26,
          "goodsBuyLimit": 15,
          "goodsStock": 845,
          "goodsAvailable": true,
          "goodsDetail": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, minus suscipit facilis doloremque nisi necessitatibus. Iste soluta commodi eaque. Fuga vero, nisi officiis omnis alias voluptatem tempore asperiores soluta velit",
          "goodsOrder": 18,
          "shopId": "8xFuKIi7djRUfhW9Vl4HOJgPqLt2",
          "cateId": "5MZDz9Y0KI8gV",
          "isExist": false,
          "num": 1
        },
        {
          "_id": "3ad8d6305f34b781006c611a16541373",
          "goodsId": "J9GQ5TaF2LgNi",
          "goodsName": "测试商品1400",
          "goodsPicUrl": "https://hannatiger.com/wp-content/uploads/2020/07/麻辣烫-edit.jpg",
          "goodsPrice": 85.16,
          "goodsBuyLimit": 32,
          "goodsStock": 799,
          "goodsAvailable": true,
          "goodsDetail": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, minus suscipit facilis doloremque nisi necessitatibus. Iste soluta commodi eaque. Fuga vero, nisi officiis omnis alias voluptatem tempore asperiores soluta velit",
          "goodsOrder": 0,
          "shopId": "yufdX2i5lCJzHrFWxjA8tqVZpLSN",
          "cateId": "5MZDz9Y0KI8gV",
          "isExist": false,
          "num": 1
        },
        {
          "_id": "3ad8d6305f34b781006c68577eb85e11",
          "goodsId": "1DdCf5jGu23Z6",
          "goodsName": "2测试商品1248",
          "goodsPicUrl": "https://hannatiger.com/wp-content/uploads/2020/07/Edit-東之味蕨根粉條-360328104.jpg",
          "goodsPrice": 20.72,
          "goodsBuyLimit": 74,
          "goodsStock": 263,
          "goodsAvailable": true,
          "goodsDetail": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, minus suscipit facilis doloremque nisi necessitatibus. Iste soluta commodi eaque. Fuga vero, nisi officiis omnis alias voluptatem tempore asperiores soluta velit",
          "goodsOrder": 48,
          "shopId": "yufdX2i5lCJzHrFWxjA8tqVZpLSN",
          "cateId": "5MZDz9Y0KI8gV",
          "isExist": "true",
          "num": 1
        },
        {
          "_id": "3ad8d6305f34b781006c5be826507287",
          "goodsId": "o0FEeMT6ZlkgN",
          "goodsName": "测试商品72",
          "goodsPicUrl": "https://hannatiger.com/wp-content/uploads/2020/07/宏源天天维C草莓味果糖.jpg",
          "goodsPrice": 95.93,
          "goodsBuyLimit": 96,
          "goodsStock": 908,
          "goodsAvailable": true,
          "goodsDetail": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, minus suscipit facilis doloremque nisi necessitatibus. Iste soluta commodi eaque. Fuga vero, nisi officiis omnis alias voluptatem tempore asperiores soluta velit",
          "goodsOrder": 22,
          "shopId": "DehKQdxPmq7oCtzUnXJy8YL1bH53",
          "cateId": "pUKTLFOjyWm7P",
          "isExist": false,
          "num": 6
        },
        {
          "_id": "3ad8d6305f34b781006c5baa15df9b40",
          "goodsId": "pK5j7NQzFImJ4",
          "goodsName": "测试商品10",
          "goodsPicUrl": "https://hannatiger.com/wp-content/uploads/2020/07/川知味黄山贡菊.jpg",
          "goodsPrice": 27.31,
          "goodsBuyLimit": 6,
          "goodsStock": 156,
          "goodsAvailable": true,
          "goodsDetail": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, minus suscipit facilis doloremque nisi necessitatibus. Iste soluta commodi eaque. Fuga vero, nisi officiis omnis alias voluptatem tempore asperiores soluta velit",
          "goodsOrder": 10,
          "shopId": "flmcGqVZ5Bkrwiyevh6FStKN1jgU",
          "cateId": "5MZDz9Y0KI8gV",
          "isExist": true,
          "num": 5
        }
      ]
    }
    setShopCart(shopCart)
*/
  },
});
