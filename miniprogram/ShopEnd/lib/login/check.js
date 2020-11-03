// 验证开门关门时间是否合法
export function validateOpenCloseTime(openTime, closeTime, message = "") {
  let openTimeHour = Number(openTime.slice(0, 2));
  let openTimeMinute = Number(openTime.slice(-2));
  let closeTimeHour = Number(closeTime.slice(0, 2));
  let closeTimeMinute = Number(closeTime.slice(-2));

  if (openTimeHour * 60 + openTimeMinute >= closeTimeHour * 60 + closeTimeMinute) {
    return { isValid: false, message: "关门时间需晚于开门时间" };
  }
  return { isValid: true, message: "开关门时间校验无误" };
}

// 检验配送时间
export function validateDeliverTimeList(form, field) {
  const deliverTimeList = form[field];
  for (let i = 0; i < deliverTimeList.length; i++) {
    // 如果用户漏填了某个配送时间则报错
    if (!deliverTimeList[i]) {
      return { isValid: false, message: "未填写配送时间" + (i + 1) };
    }
  }
  return { isValid: true, message: "配送时间校验无误" };
}

// =================================================
// =================================================
// ================= 总的检验函数 ===================
// =================================================
// =================================================

export function validateInitShopSetting(formData, formText) {
  console.log("formData", formData);
  //校验商店头像
  if (!formData.logoUrl) {
    return { isValid: false, message: "未上传商店logo" };
  }

  // 校验商店名称
  if (!formData.shopName) {
    return { isValid: false, message: "未填写商店名称" };
  }
  // 校验营业类型
  if (formData.shopCate === -1) {
    return { isValid: false, message: "未选择营业类型" };
  }
  // 校验联系电话
  if (!/^[\d]{10}$/.test(formData.shopPhoneNumber)) {
    return { isValid: false, message: "无效联系电话" };
  }
  // 校验Address
  if (!formData.shopAddress) {
    return { isValid: false, message: "未填写Address" };
  }
  // 校验City
  if (!formData.city) {
    return { isValid: false, message: "未填写City" };
  }
  // 校验State
  if (!formData.state) {
    return { isValid: false, message: "未填写State" };
  }
  // 校验Postal
  if (!/^\d{5}(?:[-\s]\d{4})?$/.test(formData.zipcode)) {
    return { isValid: false, message: "无效Postal" };
  }
  // 校验营业日
  const openDay = formData.openDay;
  let sum = 0;
  openDay.forEach((v) => {
    sum += v;
  });
  if (sum === 0) {
    return { isValid: false, message: "未选择营业日" };
  }
  // 校验开门时间
  if (!formData.openTime) {
    return { isValid: false, message: "未填写开门时间" };
  }
  // 校验开门时间
  if (!formData.closeTime) {
    return { isValid: false, message: "未填写关门时间" };
  }
  // 联合检验开关门时间
  let valiOpenCloseTime = validateOpenCloseTime(formData.openTime, formData.closeTime);
  if (!valiOpenCloseTime.isValid) {
    return valiOpenCloseTime;
  }

  // 检验起送消费
  if (!/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(formData.minConsumption)) {
    return { isValid: false, message: "无效的起送消费" };
  }
  // 检验配送时间
  let valideliverTimeList = validateDeliverTimeList(formData, "deliverTimeList");
  if (!valideliverTimeList.isValid) {
    return valideliverTimeList;
  }


  // 检验截单时间
  if (formData.cutOrderTime === -1) {
    return { isValid: false, message: "未填写截单时间" };
  }

  // 检验服务费百分比
  if (formData.serviceFeePercent === -1) {
    return { isValid: false, message: "未填写服务费百分比" };
  }

  // 检验运费百分比
  if (formData.deliverFeePercent === -1) {
    return { isValid: false, message: "未填写运费百分比" };
  }

  // 校验商店公告
  if (!formData.shopAnnounce) {
    return { isValid: false, message: "未填写商店公告" };
  }

  return { isValid: true, message: formText + "校验通过" };
}
