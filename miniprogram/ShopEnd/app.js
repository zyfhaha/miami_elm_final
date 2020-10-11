 
App({
  onLaunch: function () {
    wx.cloud.init({
      env: "env-miamielm-p3buy",
      traceUer: true,
    });

    // TODO 记得删除这里
    this.globalData = {
      refreshFlag:{
        orderProcess: true
      },
      accessInfo:{role:"owner",access:0x3FFFFFFF},
      shopInfo: {closeTime: "23:00",
                  cutOrderTime:30,
                  city:"Miami",
                  deliverTimeList:["12:00","18:00"],
                  geoPoint: {},
                  isActivated: true,
                  isExist: true,
                  logoUrl: "https://s1.ax1x.com/2020/07/30/aninvq.png",
                  minConsumption: 700,
                  openDay: [1, 1, 0, 1, 1, 1, 0],
                  openTime: "08:30",
                  shopAddress: "7650 NW 42TH ST",
                  shopAnnounce: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                  shopCate: 0,
                  shopId: "FbAIRZz5Nc0wax",
                  shopName: "Hanna&Tiger Asian Mart 小卖部",
                  shopPhoneNumber: "7863024589",
                  shopStatus: 1,
                  shopTimezoneOffset: 240,
                  startDate: "2020-08-10T04:11:14.130Z",
                  state: "FL",
                  zipcode: "33567"},
    };
  },
});
