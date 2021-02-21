import { showModal, showToast } from "../../utils/asyncWX.js";
import { getId } from "../id/operation.js";
// 本文将集成了用户对其收货地址的操作

/* 收货地址数据结构
 
address = {
        userId: "110011010",      //    用户ID (目前为空)
        totalNum: 3,             //    保存的地址数量
        addressItem:[
            {
                addressId: "asfeglkngin";          // 地址的id
                receiverName: "小明";              // 收货人姓名(注意，收货人和当前的app小程序用户可能不是一个人)
                phoneNumber: "1234567";            // 收货人手机
                uniteNumber:"A384"              // 门牌号
                address:{
                  id:15103389097764433256       // 当前位置的唯一poi id
                  title: "天安门";              // 当前位置的名称
                  addr:"北京市东城区东长安街"    // 当前位置的街道地址
                  latitude:39.908823          // 纬度
                  longitude: 116.39747        // 经度
                }
            },

            // 另一个地址
            {
                addressId: "asfegl2415kngi
                receiverName: "小红"; 
                ...... 同上
            }

        ]
}
 */

//  创建一个全局地址管理的缓存
export function createGlobalAddress(userId = "") {
  console.log("createGlobalAddress");
  if (typeof userId === "string") {
    let address = {
      userId: userId,
      totalNum: 0,
      addressItem: [],
    };
    wx.setStorageSync("address", address);
  } else {
    console.error("UserId has to be string");
  }
}

// 更新地址信息的元信息（如：有多少条具体的地址信息）
function updateAddressBasicInfo() {
  let address = wx.getStorageSync("address");
  let totalNum = 0;
  let addressItem = address.addressItem;
  totalNum = addressItem.length;
  address.totalNum = totalNum;
  wx.setStorageSync("address", address);
}

// 检查当前的全局地址管理是否有某个id为addressId的地址
function hasAddressItem(addressId) {
  let address = wx.getStorageSync("address");
  if (address.addressItem.length === 0) {
    return -1;
  }
  return address.addressItem.findIndex((v) => v.addressId === addressId);
}

// 向当前的全局地址管理中添加一个新的地址 并返回它在总地址中的索引
export function addAddressItem(addressInfo) {
  let address = wx.getStorageSync("address");
  const addressId = getId();
  address.addressItem.push({ addressId: addressId, ...addressInfo });
  wx.setStorageSync("address", address);
  updateAddressBasicInfo();
  return address.addressItem.length - 1;
}

// 向当前的全局地址管理中删除一个地址
export function removeAddressItem(addressId) {
  let address = wx.getStorageSync("address");
  let addressItemIndex = hasAddressItem(addressId);
  if (addressItemIndex !== -1) {
    address.addressItem.splice(addressItemIndex, 1);
    wx.setStorageSync("address", address);
    updateAddressBasicInfo();
    return true;
  }
}

// 返回当前全局地址管理中的某个地址
export function getAddressItem(addressId) {
  let address = wx.getStorageSync("address");
  let addressItemIndex = hasAddressItem(addressId);
  if (addressItemIndex === -1) {
    console.error("No address item found for current address");
  } else {
    return address.addressItem[addressItemIndex];
  }
}

// 将所有的地址项目返回
export function getAllAddressItem() {
  let address = wx.getStorageSync("address");
  return address.addressItem;
}

// 修改某一个地址项目
// 不支持只修改某个具体的小项目 必须整体更新
export function updateAddressItem(addressInfo) {
  let address = wx.getStorageSync("address");
  let addressItemIndex = hasAddressItem(addressInfo.addressId);
  address.addressItem[addressItemIndex] = { ...addressInfo };
  wx.setStorageSync("address", address);
  return addressItemIndex;
}

// 检验输入的地址信息的合法性
export async function verifyAddressInfo(addressInfo) {
  // ========== 联系人检验 =============
  if (!addressInfo.receiverName.trim()) {
    await showToast("无效收货人姓名");
    return;
  }

  // ========== 联系电话检验 =============
  if (!addressInfo.phoneNumber) {
    await showToast("未输入收货人电话");
    return;
  }

  if (!addressInfo.phoneNumber.match(/^[+]?[\d]{10,13}$/)) {
    await showToast("无效手机号");
    return;
  }

  // ========== 收获地址检验 =============
  if (!addressInfo.address.addr) {
    await showToast("未填写收获地址");
    return;
  }

  // ========== 门牌号检验 =============
  // 门牌号为选填项

  // ========== 检验通过 ============
  return true;
}
