
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    current: {
      type: Number,
      value: 0,
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 底部tabbar内容
    // 注意：iconPath如果写相对路径要相对于mp-tabbar组件所在目录的。

    tabbarList: [
      {
        text: "订单处理",
        iconPath: "../../icons/order_o.png",
        selectedIconPath: "../../icons/order.png",
        // dot: true,
      },
      {
        text: "商店管理",
        iconPath: "../../icons/shop_o.png",
        selectedIconPath: "../../icons/shop.png",
      },
      {
        text: "设置",
        iconPath: "../../icons/gear_o.png",
        selectedIconPath: "../../icons/gear.png",
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabChange(e) {
      const idx2PageName = {
        0: "orderProcess",
        1: "shopManage",
        2: "setting",
      };

      const PageName2route = {
        orderProcess: "../orderProcess/orderProcess",
        shopManage: "../shopManage/shopManage",
        setting: "../setting/setting",
      };
      let curPages = getCurrentPages();
      console.log("curPages", curPages);
      let curPagesList = curPages.map((v) => {
        let routeComponent = v.route.split("/");
        return routeComponent[routeComponent.length - 1];
      });
      console.log("curPagesList", curPagesList);
      // let curPageName = curPagesList[curPagesList.length - 1];
      const targetPageName = idx2PageName[e.detail.index];

      let targetPageIdx = curPagesList.findIndex((v) => v === targetPageName);

      if (targetPageIdx === -1) {
        wx.navigateTo({ url: PageName2route[targetPageName] });
      } else {
        let backNum = curPagesList.length - targetPageIdx - 1;
        wx.navigateBack({ delta: backNum });
      }
    },
  },
});
