import { showToast, showModal } from "../../../utils/asyncWX.js";
import {
  updateAppShopInfo,
  updateDeliverSetting,
} from "../../../lib/setting/operation.js";
import {
  validateDeliverTimeList,
  validatePrice,
  validateCutOrderTime,
} from "../../../lib/login/check.js";

let app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 是否可编辑
    editable: false,

    // 起送起送消费
    minConsumption: 0,

    // 截单时间
    cutOrderTime: 0,

    // 配送时段数组
    deliverTimeList: [""],
  },

  shopInfo: {},

  // 用户点击增加配送时间
  async handleTapAddDeliverTIme() {
    let deliverTimeList = this.data.deliverTimeList;
    if (deliverTimeList.length >= 12) {
      await showToast("配送时间不能超过12个");
      return;
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
    if (deliverTimeList.findIndex((v) => v === time) !== -1) {
      await showToast("该配送时间已存在");
      return;
    }
    deliverTimeList[index] = time;
    this.setData({ deliverTimeList });
  },

  // 对配送时间按照从早到晚排序并只返回时间
  getSortedDeliverTime(deliverTimeList) {
    let sortedDeliverTimeList = deliverTimeList.sort(function (v1, v2) {
      return (
        parseInt(v1.slice(0, 2)) * 60 + parseInt(v1.slice(-2)) - parseInt(v2.slice(0, 2)) * 60 - parseInt(v2.slice(-2))
      );
    });
    return sortedDeliverTimeList;
  },

  // 用户对input输入框进行了修改
  handleInputChange(e) {
    const field = e.currentTarget.dataset.field;
    let temp = {};
    const value = e.detail.value;
    temp[field] = value;
    this.setData({
      ...temp,
    });
  },

  // 用户点击放弃修改
  handleTapDiscard() {
    // console.log("用户点击放弃修改");
    this.refreshEditDeliver(this.shopInfo);
    this.setData({
      editable: false,
    });
  },

  // 用户点击修改
  handleTapEdit() {
    // console.log("用户点击修改");
    this.setData({
      editable: true,
    });
  },

  // 用户点击保存
  async handleTapSave(e) {
    let newDeliverSetting = e.detail.value;
    newDeliverSetting.deliverTimeList = this.getSortedDeliverTime(this.data.deliverTimeList.slice()); //.slice()也是为了浅拷贝

    // 先比较一下用户有没有真的修改内容
    const newMinConsumption = newDeliverSetting.minConsumption;
    const newCutOrderTime = newDeliverSetting.cutOrderTime;
    const newDeliverTimeList = newDeliverSetting.deliverTimeList;

    const oldMinConsumption = String(this.shopInfo.minConsumption);
    const oldCutOrderTime = String(this.shopInfo.cutOrderTime);
    const oldDeliverTimeList = this.shopInfo.deliverTimeList;

    if (
      newMinConsumption === oldMinConsumption &&
      newCutOrderTime === oldCutOrderTime &&
      newDeliverTimeList.every((v, i) => v === oldDeliverTimeList[i])
    ) {
      showToast("未进行修改");
      return;
    }

    // 检验输入合法性
    const valiMinconsupmtionRes = validatePrice(
      newDeliverSetting,
      "minConsumption",
      "起送消费"
    );
    if (!valiMinconsupmtionRes.isValid) {
      showToast(valiMinconsupmtionRes.message);
      return;
    }

    const valiDeliverTimeListRes = validateDeliverTimeList(
      newDeliverSetting,
      "deliverTimeList"
    );
    if (!valiDeliverTimeListRes.isValid) {
      showToast(valiDeliverTimeListRes.message);
      return;
    }

    const valiCutOrderTime = validateCutOrderTime(
      newDeliverSetting,
      "cutOrderTime"
    );
    if (!valiCutOrderTime.isValid) {
      showToast(valiCutOrderTime.message);
      return;
    }

    const modalRes = await showModal("确定保存？");
    if (modalRes.cancel) {
      return;
    }

    // 运行到此说明输入数据无误 先做一下数据转换
    newDeliverSetting.minConsumption = Number(newDeliverSetting.minConsumption);
    newDeliverSetting.cutOrderTime = parseInt(newDeliverSetting.cutOrderTime);

    // 开始上传修改
    const updateRes = await updateDeliverSetting(
      this.shopInfo,
      newDeliverSetting
    );
    if (updateRes) {
      // 重新从云端拉取一遍shopInfo
      await updateAppShopInfo(this.shopInfo.shopId);
      showToast("修改成功");
    }
    this.refreshEditDeliver(app.globalData.shopInfo);
    this.handleTapDiscard();
  },

  // 刷新页面
  refreshEditDeliver(shopInfo) {
    this.shopInfo = shopInfo;
    const { cutOrderTime, deliverTimeList, minConsumption } = shopInfo;
    // 注意这里需要对数组进行一个浅拷贝 不然this.data中的deliverTimeList与shopInfo中的deliverTimeList是同一个引用
    let deliverTimeListCopy = deliverTimeList.slice();
    
    this.setData({
      cutOrderTime,
      deliverTimeList:deliverTimeListCopy,
      minConsumption,
    });
  },
  // ==============================================
  // ============== 页面生命周期函数 ================
  // ==============================================
  onLoad(options) {
    this.refreshEditDeliver(app.globalData.shopInfo);
  },
});
