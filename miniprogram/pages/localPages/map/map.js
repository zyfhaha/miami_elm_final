var QQMapWX = require("../../../lib/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js");
var qqmapsdk;
Page({
  data: {
    // === 搜索框相关数据 ===
    goods:[],
    // 取消 按钮 是否显示
    isFocus:false,
    // 输入框的值
    inpValue:"",

    // ==== 地图显示相关数据 ===
    latitude: 23.099994,
    longitude: -80.32452,
    // markers: [
    //   {
    //     id: 1,
    //     latitude: 23.099994,
    //     longitude: 113.32452,
    //     name: "T.I.T 创意园",
    //   },
    // ],
    // covers: [
    //   {
    //     latitude: 23.099994,
    //     longitude: 113.34452,
    //     iconPath: "/image/location.png",
    //   },
    //   {
    //     latitude: 23.099994,
    //     longitude: 113.30452,
    //     iconPath: "/image/location.png",
    //   },
    // ],
  },
  TimeId:-1,

  /* =============== 页面事务处理函数 =========== */
  // 输入框的值改变 就会触发的事件
  handleInput(e){
    // 1 获取输入框的值
    const {value}=e.detail;
    // 2 检测合法性
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
      // 值不合法
      return;
    }
    // 3 准备发送请求获取数据
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  // 发送请求获取搜索建议 数据
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}});
    console.log(res);
    this.setData({
      goods:res
    })
  },
  // 点击 取消按钮
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  },
  
  /* =============== 页面生命周期函数 =========== */
  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: "I7MBZ-GGG32-4UCUA-CMPEQ-7SD52-AMFI5",
    });
  },
  onShow: function () {
    // 调用接口
    qqmapsdk.search({
      keyword: "university of miami",
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      },
    });
    wx.getLocation({
      type: "wgs84",
      success: (res) => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        const accuracy = res.accuracy;

        console.log("latitude", latitude);
        console.log("longitude", longitude);
        console.log("accuracy", accuracy);

        this.setData({
          latitude,
          longitude,
        });
      },
    });
  },
});
