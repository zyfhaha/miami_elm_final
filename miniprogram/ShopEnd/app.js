 
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
      shopInfo: {},
    };
  },
});
