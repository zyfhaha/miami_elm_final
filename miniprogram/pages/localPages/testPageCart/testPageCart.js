import {
  ml_showLoading,
  ml_hideLoading,
  ml_showToast,
  ml_payment
} from "../testPage/utils/asyncWx.js";
const db = wx.cloud.database();
const carts_col = db.collection("cart"); 

Page({  
  data: { 
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  }, 
  /* ================ 页面事务处理函数 ============== */
  // 加载购物车数据
  async loadCartsData() {
    let res = await carts_col.get();
    this.setData({
      cart: res.data,
    });

    // 统计总价格和总数量
    this.setCart(res.data);
  },

  // 更新页面数据
  setCart(cart) {
    let totalNum = 0;
    let totalPrice = 0;

    cart.forEach((v) => {
      totalNum += v.num;
      totalPrice += v.num * v.goodsPrice;
    });

    this.setData({
      totalNum: totalNum,
      totalPrice,
    });
  },

  // 点击增加商品数量
  async handleAddGoodsNum(e) {
    let id = e.currentTarget.dataset.goodsInfo._id;
    await carts_col.doc(id).update({
      data: {
        num: db.command.inc(1),
      },
    });
    await ml_showToast("添加成功");
    // 成功后再次加载数据
    this.loadCartsData();
  },

  async handlePay(){
    console.log("开始支付");
    // 1 发起订单 => 获取订单号 => 未支付
    let res1 = await wx.cloud.callFunction({
      name:"makeOrder",
      data:{
        carts:this.data.carts
      }
    })
    await ml_showToast("发起订单成功")
    const {order_number} = res1.result
    console.log("发起订单",order_number)

    // // 2 预支付 => 获取支付所需要的5个参数
    // let res2 = await wx.cloud.callFunction({
    //   name:"pay",
    //   data:{
    //     order_number
    //   }
    // })
    // console.log("预支付",res2);

    // // 3 发起支付 模拟器会弹出一个二维码 真机上直接跳转到支付界面等待用户输入密码
    // await ml_payment(res2.result)

    // // 4 更新支付状态 => 已支付
    // let res3 = wx.cloud.callFunction({
    //   name:"updateStatus",
    //   data:{
    //     order_num
    //   }
    // })
    // console.log("更新支付状态",res3);



    // 5 清空购物车(清空cart里面的数据)
    let res4 = await wx.cloud.callFunction({
      name:"clearCarts"
    }) 
    console.log("清空购物车",res4);
    

    

    
  },

  /* =============== 页面生命周期函数 ================ */
  onLoad: function (options) {
    this.loadCartsData();
  },
});
