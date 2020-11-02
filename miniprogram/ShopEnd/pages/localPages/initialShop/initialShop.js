import { validateInitShopSetting } from "../../../lib/login/check.js";
import { showToast, showModal } from "../../../utils/asyncWX.js";
import { initialiShop } from "../../../lib/login/operation.js";
import { setLoginRecord } from "../../../lib/loginRecord/operation.js";
let app = getApp();
Page({
  data: {
    showTopTips: false,

    // 商店编号
    shopId: "",
    // 商店头像
    img: "",
    // 可供选择的营业类型
    selShopCateItems: ["超市", "餐厅"],
    // 展示营业类型选择结果
    shopCateText: "请选择营业类型",

    // 可供选择的州份
    selStateItems: ["FL"],
    // 展示选择的州份
    state: "请选择State",

    // 开门时间
    openTime: "请选择开门时间",
    // 关门时间
    closeTime: "请选择关门时间",

    // 门店公告 主要用这个属性来实时显示输入的字数
    shopAnnounce: "",

    // 选择营业日对话框是否打开
    openSelectOpenDayDialog: false,
    // 可供选择的营业日
    selOpenDayItems: [
      { text: "周一", value: 1 },
      { text: "周二", value: 2 },
      { text: "周三", value: 3 },
      { text: "周四", value: 4 },
      { text: "周五", value: 5 },
      { text: "周六", value: 6 },
      { text: "周日", value: 0 },
    ],
    // 用于展示用户选择了哪些天作为营业天
    selOpenDayText: "请选择营业日",
    // 选择营业日对话框按钮
    buttons: [{ text: "取消" }, { text: "确定" }],

    // 配送时段数组
    deliverTimeList: [""],

    // 最终提交的表单数据
    formData: {},
  },

  // 删除上传的商店头像
  handleRemoveImg() {
    this.setData({
      img: "",
    });
  },

  // 点击预览头像大图
  handlePreviewImg() {
    const img = this.data.img;
    wx.previewImage({
      current: img,
      urls: [img],
    });
  },

  // 上传
  handleUploadImage() {
    wx.navigateTo({
      url: "../editGoodsPic/editGoodsPic",
    });
  },

  // 处理所有的输入框输入值变动事件
  handleInputChange(e) {
    const { field } = e.currentTarget.dataset;
    // console.log("检测到", field, "发生变化: ", e.detail.value);
    this.setData({
      [`formData.${field}`]: e.detail.value,
    });
  },
  // 商店公告输入框变动事件
  handleShopAnnounceChange(e) {
    const shopAnnounce = e.detail.value;
    this.setData({ shopAnnounce, [`formData.shopAnnounce`]: shopAnnounce });
  },

  // 营业类型输入值变动
  handleChangeShopCate(e) {
    this.setData({
      shopCate: e.detail.value,
      [`formData.shopCate`]: e.detail.value,
      shopCateText: this.data.selShopCateItems[e.detail.value],
    });
  },

  // 所在州份变动
  handleChangeState(e) {
    // console.log("检测到State变化");
    const state = this.data.selStateItems[e.detail.value];
    this.setData({
      state: state,
      [`formData.state`]: state,
    });
  },

  // 点击打开选择营业日对话框
  handleChangeOpenDay(e) {
    // console.log("点击修改营业日");
    this.setData({ openSelectOpenDayDialog: true });
  },
  // 用户更改营业日
  handleOpenDayChange(e) {
    let openDayIndex = e.detail.value;
    // 将携带的value值转为int并排序
    let openDay = [0, 0, 0, 0, 0, 0, 0];
    openDayIndex = openDayIndex
      .map((v) => {
        openDay[v] = 1;
        return Number(v);
      })
      .sort();

    this.setData({
      [`formData.openDay`]: openDay,
    });

    // 准备展示文本
    if (openDayIndex.length === 7) {
      this.setData({ selOpenDayText: "每天" });
    } else if (
      openDayIndex.length === 5 &&
      !openDayIndex.includes(0) &&
      !openDayIndex.includes(6)
    ) {
      this.setData({ selOpenDayText: "工作日" });
    } else {
      const tempDic = {
        0: "周日",
        1: "周一",
        2: "周二",
        3: "周三",
        4: "周四",
        5: "周五",
        6: "周六",
      };
      let openDayTextList = openDayIndex.map((v) => {
        return tempDic[v];
      });
      // 如果有周日 则为了习惯把周日放最后
      if (openDayTextList.includes("周日")) {
        openDayTextList.splice(0, 1);
        openDayTextList.push("周日");
      }
      this.setData({
        selOpenDayText: openDayTextList.join(" ") || "请选择营业日",
      });
    }
  },
  // 点击选择营业日对话框按钮
  async hadnleTapSelectOpenDayButton(e) {
    const selOpenDayText = this.data.selOpenDayText;
    this.setData({ openSelectOpenDayDialog: false });
  },

  // 开门时间变动
  handleChangeOpenTime(e) {
    const openTime = e.detail.value;
    // console.log("检测到开门时间变化", openTime);
    this.setData({
      openTime: openTime,
      [`formData.openTime`]: openTime,
    });
  },

  // 关门时间变动
  handleChangeCloseTime(e) {
    const closeTime = e.detail.value;
    // console.log("检测到关门时间变化", closeTime);
    this.setData({
      closeTime: closeTime,
      [`formData.closeTime`]: closeTime,
    });
  },

  // 用户点击增加配送时间
  async handleTapAddDeliverTIme() {
    let deliverTimeList = this.data.deliverTimeList;
    if(deliverTimeList.length === 12){
      await showToast("配送时间不能超过12个")
      return
    }
    deliverTimeList.push("");
    this.setData({ deliverTimeList });
  },

  // 用户删除配送时间
  handleTapDeleteDeliverTIme(e) {
    const index = e.currentTarget.dataset.index;
    let deliverTimeList = this.data.deliverTimeList;
    deliverTimeList.splice(index, 1);
    this.setData({ deliverTimeList });
  },

  // 用户改变配送时间
  async handleChangeDeliverTime(e) {
    const time = e.detail.value;
    const index = e.currentTarget.dataset.index;
    let deliverTimeList = this.data.deliverTimeList;
    if((deliverTimeList.findIndex((v)=>v === time)) !== -1){
      await showToast("该配送时间已存在")
      return
    }
    deliverTimeList[index] = time;
    this.setData({deliverTimeList})
  },

  // 对配送时间按照从早到晚排序并只返回时间
  getSortedDeliverTime(deliverTimeList){
    let sortedDeliverTimeList = deliverTimeList.sort(function(v1,v2){
      return parseInt(v1.slice(0,2)) * 60 + parseInt(v1.slice(-2)) - parseInt(v2.slice(0,2)) * 60 - parseInt(v2.slice(-2))
    })
    return sortedDeliverTimeList
  },

  // 此处对表单各个单项进行单个校验
  // TODO 太不优美了 到时候考虑使用专门的表单校验插件
  // 2020-8-26 官方提供的表单校验bug太严重并且功能较为局限

  async submitForm() {
    let formData = this.data.formData;

    // =========== 测试用 ==============
      // formData.city= "LA";
      // formData.shopName= "yysh测试商店";
      // formData.closeTime= "16:00";
      // formData.geoPoint= [];
      // formData.isExist= true;
      // formData.logoUrl= "";
      // formData.minConsumption= "29.99";
      // formData.openDay= [1, 1, 1, 1, 0, 0, 1];
      // formData.openTime= "07:00";
      // formData.shopAddress= "6234 SW 78TH ST";
      // formData.shopAnnounce= "每天08:00-20:00营业 ↵每天12:00 14:00 18:00送货";
      // formData.shopCate= "0";
      // formData.shopPhoneNumber= "7863204598";
      // formData.state= "FL";
      // formData.zipcode= "33888";
    //  =================================

    formData.logoUrl = this.data.img;
    formData.shopId = this.data.shopId;
    formData.deliverTimeList = this.getSortedDeliverTime(this.data.deliverTimeList)
    const validateRes = validateInitShopSetting(formData, "商店初始信息");
    // console.log("validateRes",validateRes);
    if (!validateRes.isValid) {
      await showToast(validateRes.message);
      return;
    }
    // 校验通过
    const initRes = await initialiShop(formData);
    if(!initRes){
      return;
    }
    const initResData = initRes.result;

    // const initRes = true;
    if (initResData.errCode === 200) {
      // errCode === 200 初始化成功
      // 将商店信息和权限信息绑定到全局
      app.globalData.shopInfo = initResData.data.shopInfo;
      app.globalData.accessInfo = initResData.data.accessInfo;

      // 打包登录信息
      const loginInfo = {
        shopInfo: app.globalData.shopInfo,
        accessInfo: app.globalData.accessInfo,
      };
      // 4 将登录信息缓存
      setLoginRecord(loginInfo);
      // 5 跳转到商品管理页面
      wx.reLaunch({
        url: "../goodsManage/goodsManage",
        success: (result) => {
          wx.showModal({
            title: "商店初始化成功",
            content:
              "恭喜！您的商店已经初始化成功。即将跳转到商品管理页面。当您的商品数量为0时，顾客端将无法正常显示您的商店详情数据，请尽快添加商品吧~",
          });
          // 在此设置用户的类型为店主
          const loginInfo = {
            shopInfo: {
              shopId: formData.shopId,
              shopName: formData.shopName,
            },
            accessInfo: {},
          };
          app.loginInfo = loginInfo;
        },
        fail: (res) => {
          console.log(res);
        },
      });
    }
  },
  onLoad: function (options) {
    const shopId = options.shopId;
    this.setData({
      shopId: shopId,
      [`formData.shopId`]: shopId,
    });
  },
});
