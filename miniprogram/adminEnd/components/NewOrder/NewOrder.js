// components/order/Order.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderSetting: {
      type: Object,
      value: {
        // 订单右上角显示已完成或者已取消标签
        hasStatus: false,

        // 订单是否要显示右上角的“取消订单”按钮
        hasTopRightCancelOrderButton: false,

        // 订单是否要显示接单按钮
        hasAcceptOrderButton: false,

        // 订单是否要显示完成订单按钮
        hasCompleteOrderButton: false,

        // 是否展示右箭头
        hasRightArror: false,
      },
    },
    // 订单详情
    orderDetail: {
      type: Object,
      value: {
        // 今日订单号 例如#2
        shopId: "FbAIRZz5Nc0wax",

        shopName: "Hanna&Tiger Asian Mart 小卖部",

        // 送货街道地址
        street: "6005 SW 78TH ST",

        // 送货城市
        city: "New York",

        // 送货地址所在州份
        state: "FL",

        // 送货地址的zipcode
        zipcode: "66524",

        // 收货人姓名
        receiverName: "Tony Stark",

        // 收货人电话
        phoneNumber: "7865412369",

        // 购买物品
        validGoods: [
          {
            goodsId: 123456789,
            goodsName: "短名字商品",
            num: 1,
            goodsPrice: 1,
            goodsPicUrl:
              "https://hannatiger.com/wp-content/uploads/2020/06/bourbon-every-buger-cookies.jpg",
          },
          {
            goodsId: 123312529,
            goodsName:
              "名字中等长名字中等长名字中等长名字中等长名字中等长名字中等长名字中等长",
            num: 99,
            goodsPrice: 99,
            goodsPicUrl:
              "https://hannatiger.com/wp-content/uploads/2020/06/丰科Finc蟹味菇BrownBeechMushroom150g.jpg",
          },
          {
            goodsId: 123321239,
            goodsName:
              "名字超长的商品名字超长的商品名字超长的商品名字超长的商品名字超长的商品名字超长的商品名字超长的商品名字超长的商品名字超长的商品名字超长的商品名字超长的商品",
            num: 9999,
            goodsPrice: 9999,
            goodsPicUrl:
              "https://hannatiger.com/wp-content/uploads/2020/06/Edit-剁椒排骨袋1.jpg",
          },
          {
            goodsId: 321312529,
            goodsName: "饭扫光FSG/香脆金针菇/Szchuan Pepper Pickles/380g",
            num: 3,
            goodsPrice: 12,
            goodsPicUrl:
              "https://hannatiger.com/wp-content/uploads/2020/07/芋头.jpg",
          },
        ],

        // 运费
        deliverFee: 2.99,

        // 总价
        totalPrice: 201.54,

        // 备注信息
        note: "辣子鸡少放鸡辣子鸡少放鸡辣子",

        // 创建时间
        createTime: 1609153085979,

        // 下单时间
        payTime: 1600653085979,

        // 接单时间
        handleTime: 1600663085979,

        // 预定配送时间
        selDeliverTime: 1601653085979,

        // 配送时间
        deliverTime: 1602653085979,

        // 到货时间
        completeTime: 1603653085979,

        // 订单编号（订单在后台的全局唯一ID）
        orderId: "798546132564977",

        // 订单状态 0:已下单等待接单 1:已接单等待完成拣货 2:已完成拣货开始配送 3:已送达
        status: 0,

        // 商店电话号码
        shopPhoneNumber: "7864579512",

        // 订单取消理由 若订单没有被取消则为空字符串
        cancelReason: "手滑下错单了",
      },
    },
  },
  data: {
    // 是否显示商品详情
    isShowGoodsDetail: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击预览图片
    handleTapImg(e) {
      const img = e.currentTarget.dataset.src;
      wx.previewImage({
        current: img,
        urls: [img],
      });
    },

    // 点击联系顾客时触发事件
    handleTapTel(e) {
      wx.makePhoneCall({
        phoneNumber: this.data.orderDetail.phoneNumber,
      });
    },

    // 点击商品详情时触发事件
    handleTapGoodsDetail(e) {
      this.setData({
        hasDownArror: !this.data.hasDownArror,
        hasUpArror: !this.data.hasUpArror,
        isShowGoodsDetail: !this.data.isShowGoodsDetail,
      });
    },

    // 点击取消订单时触发父组件事件
    handleTapCancelOrder(e) {
      this.triggerEvent("tapCancelOrder");
    },

    // 点击接单时触发父组件事件
    handleTapAcceptOrder(e) {
      this.triggerEvent("tapAcceptOrder");
    },
  },
});