export const ml_showLoading = () => {
  return new Promise((resolve) => {
    wx.showLoading({
      title: "加载中",
      mask: true,
      success: resolve,
    });
  });
};

export const ml_hideLoading = () => {
  return new Promise((resolve) => {
    wx.hideLoading({
      success: resolve,
    });
  });
};

export const ml_showToast = (title) => {
  return new Promise((resolve) => {
    wx.showToast({
      title: title,
      icon: "none",
      success: resolve,
    });
  });
};

export const ml_payment = (pay) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: resolve,
      fail: reject,
    });
  });
};
