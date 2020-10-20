import { showLoading, hideLoading, showToast, showModal } from "../../utils/asyncWX";
import { getId } from "../id/operation";

const db = wx.cloud.database();
const advertiseSwiperRef = db.collection("advertiseSwiper");
const goodsCateRef = db.collection("goodsCate");
const goods = db.collection("goods");

// 获取轮播图数据
export async function getSwiperCloud() {
  showLoading();
  const swiperListRef = await advertiseSwiperRef.where({ location: "home" }).field({ _id: false }).get();
  hideLoading();
  return swiperListRef.data;
}

// 返回一个空的swiper数据
export function getEmptySwiper(index) {
  let emptySwiper = {
    swiperId: getId(),
    order: index + 1,
    detail: "",
    picUrl: "",
    location: "home",
    shopName: "",
    shopId: "",
    cateName: "",
    cateId: "",
    goodsName: "",
    goodsId: "",
    destination: "",
    navigatorUrl: "",
  };
  return emptySwiper;
}

// 检查提交轮播图数据的合法性
export function verifySwiperList(swiperList) {
  for (let i = 0; i < swiperList.length; i++) {
    let hasPicUrl = swiperList[i].picUrl !== "";
    let hasShopId = swiperList[i].shopId !== "";
    let hasShopName = swiperList[i].shopName !== "";
    let hasCateName = swiperList[i].cateName !== "";
    let hasGoodsName = swiperList[i].goodsName !== "";

    if (!hasPicUrl) {
      showModal("错误", "轮播图" + String(i + 1) + "没有图片");
      return false;
    }

    if (!hasShopId) {
      showModal("错误", "轮播图" + String(i + 1) + "没有商店ID");
      return false;
    }

    if (!hasShopName) {
      showModal("错误", "轮播图" + String(i + 1) + "没有商店名称");
      return false;
    }

    if (hasGoodsName === true && hasCateName === false) {
      showModal("错误", "轮播图" + String(i + 1) + "未填写类别名称");
      return false;
    }
  }

  return true;
}

// 将商品图片上传到云端
async function uploadSwiperPicCloud(swipter) {
  // 将商品图片上传到云端并拿到云端的地址 云端的图片的命名为swipter的Id
  const res = await wx.cloud.uploadFile({
    cloudPath: "swipter" + "/" + swipter.location + "/" + swipter.swiperId + ".jpg",
    filePath: swipter.picUrl, // 文件路径
  });
  return res;
}

// 向swiper中添加相关的ID 并修改图片地址为云端ID
async function addRelevantInfo(swiper) {
  let cateId = "";
  if (swiper.cateName !== "" && swiper.cateId == "") {
    const cateIdRef = await goodsCateRef
      .where({
        shopId: swiper.shopId,
        cateName: swiper.cateName,
        isExist: true,
      })
      .get();
    if (cateIdRef.data.length !== 1) {
      await showModal("错误", swiper.cateName + "\n找不到对应的商品类别ID或ID不唯一");
      return;
    }
    cateId = cateIdRef.data[0].cateId;
  }

  let goodsId = "";
  if (swiper.goodsName !== "" && swiper.goodsId == "") {
    const goodsIdRef = await goodsRef.where({
      shopId: swiper.shopId,
      cateId: cateId,
      goodsName: swiper.goodsName,
      isExist: true,
    });

    if (goodsIdRef.data.length !== 1) {
      await showModal("错误", swiper.goodsName + "\n找不到对应的商品ID或ID不唯一");
      return;
    }

    goodsId = goodsIdRef.data[0].goodsId;
  }
  swiper.cateId = cateId;
  swiper.goodsId = goodsId;

  return swiper;
}

// 检查两个swiper是否完全一样
function isSameSwiper(swiperA, swiperB) {
  const swiperAItem = Object.keys(swiperA);
  const swiperBItem = Object.keys(swiperB);
  if (swiperAItem.length !== swiperB.length) {
    return false;
  }
  for (let i = 0; i < swiperA.length; i++) {
    if (swiperAItem[i] !== swiperBItem[i]) {
      return false;
    }
  }
  return true;
}

// 更新云端的轮播图数据
export async function updateSwiperListCloud(newSwiperList, oldSwiperList) {
  await showLoading("保存中");
  let taskList = [];
  // 对新老swiperList比较 没有变的就不要update
  for (i = 0; i < newSwiperList.length; i++) {
    let idx = oldSwiperList.findIndex((v) => {
      v.swiperId === newSwiperList[i].swiperId;
    });

    // 完全一样 则直接跳过当前循环
    if (idx !== -1 && isSameSwiper(newSwiperList[i], oldSwiperList[idx])) {
      continue;
    }

    // id一样 但图片不一样 则重新上传图片并删除旧图片
    if (idx !== -1 && newSwiperList[i].picUrl !== oldSwiperList[idx].picUrl) {
      const res1 = await uploadSwiperPicCloud(newSwiperList[i]);
      newSwiperList[i].picUrl = res1.fileID;

      const updateTask = advertiseSwiperRef
        .where({
          swiperId: newSwiperList[i].swiperId,
        })
        .update({
          data: { ...newSwiperList[i] },
        });
      const deleteOldSwiperPicTask = wx.cloud.deleteFile({
        fileList: [oldSwiperList[idx].picUrl],
      });
      taskList.push(updateTask);
      taskList.push(deleteOldSwiperPicTask);
    }

    // 这是一个新的swiper
    if (idx === -1) {
      newSwiperList[i] = await addRelevantInfo(newSwiperList[i]);
      if (!newSwiperList[i]) {
        return;
      }
      const res2 = await uploadSwiperPicCloud(newSwiperList[i]);
      newSwiperList[i].picUrl = res2.fileID;
      const addTask = advertiseSwiperRef.add({ data: { ...newSwiperList[i] } });
      taskList.push(addTask);
    }
  }
  const resAll = await Promise.all(taskList);
  await hideLoading()

}
