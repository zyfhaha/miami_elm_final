![logo](README_FIG/logo.jpg)

# 概述 Overview

2020年，新冠病毒的肆虐大幅降低了消费者的出行频率，商家的线下营业因而遭受了重创。不少商家因此将营业重心转向线上，通过无接触配送的方式来缓解病毒带来的影响。在此特殊时期，商家和消费者对线上外卖软件的需求日益增强。

"小鳄鱼跑腿"项目成立于2020年7月，旨在搭建一个平台为美国迈阿密地区华人提供线上下单，线下送达的跑腿服务。

本项目基于微信小程序原生MINA框架进行开发，通过小程序云开发功能实现前后端连接。

项目实现了三个用户终端：顾客端（C端）、商家端（B端）、管理端（A端）。三端全部集成在一个小程序中，用户可在小程序内进行切换。所有小程序用户都可以无条件进入顾客端，而只有在后台注册过商店的店主或店员才能进入商家端。则管理端需要通过特殊的方式由在册的管理员输入专属密码才能够进入

三个终端的主要模块及其主要功能列举如下：

### 顾客端 Customer Side
* 外送服务模块 Delivery Service Module
  * 购物车 Cart
  * 下单 Placing Orders 

* 跳蚤市场模块 Flea Market Module
  * 上传商品 Upload Merchandise

### 商家端 Shop Side
* 订单管理模块 Order Management Module
  * 接单 Order Taking
  * 处理 Order Handling 
  * 派送 Order Delivery
  * 取消 Order Cancellation

* 商店管理模块 Shop Management Module
  * 商品管理 Merchandise Management
  * 店员管理 Shop Assistant Management
  * 费用设置 Fee Setting
  * 营业设置 Operation Setting

### 管理端 Administration Side
* 顾客端管理模块 Administration-of-cutomer-side Module
  * 首页广告 Ads at Home Page
  * 跳蚤市场管理 Management of Flea Market
* 商家端管理 Administration-of-shop-side Module
  * 商店注册 Shop Registration
  * 商店排名 Shop Ranking
  
* 客服模块 Customer Service Module 
  * 查看订单 Access Order Information

# 主要业务流程演示

## 顾客端
顾客端包括两条业务线：外送服务和跳蚤市场

### 外送服务流程：
浏览商品->添加商品至购物车->结算->选择收货地址->下单->等待送达。
![delivery_service](README_FIG/delivery_service.gif)

### 跳蚤市场业务流程
点击“发布商品”->填写商品信息->上传->等待审核->通过审核商品上架
未通过审核的商品顾客可以修改商品信息后再次提交审核，直至审核通过
![upload_second_hand_goods](README_FIG/upload_second_hand_goods.gif)

## 商家端
商家端的业务包括订单管理和商店管理

### 订单管理
收到新订单->接单->配货->派送
* 在商家未未接单前，顾客可以随时取消订单
* 商家接单后，商家可以取消订单。消费若想取消订单需与商家电话联系
![order_handling](README_FIG/order_handling.gif)

### 商店管理
店主对商店的管理主要分为商品管理，店员管理和营业设置。
商品管理即为店主对商品信息的增加、删减、修改、查询、排序。在此不做演示

同理，店主对店员的管理也可以概括为“增删改查”。其中，“改”指修改店员备注和权限。

店员的权限包括
* 处理订单 （接单-完成配货-完成派送）
* 修改商品信息 （商品名称，价格，起购数量等）
* 修改商店信息 （商店公告，是否开门等）

添加一个新店员的流程为：商店管理tab页->店员管理->点击“+添加店员”获取邀请码->发送邀请码给店员->店员在商家端登录界面点击"成为店员"->输入邀请码->店员注册成功

以下演示店主添加一个新店员的过程以及可以对店员进行的操作。
![add_assistant](README_FIG/add_assistant.gif)

## 管理端详情

管理端的业务包括对顾客端的管理和对商家端的管理。

管理端可以设置顾客端的首页轮播图广告，包括广告排序，广告语等。用户点击广告会自动跳转到广告所对应的商品详情页

管理端对跳蚤市场的管理为审核用户上传的商品。商品通过审核后即可在跳蚤市场上架，以让所有顾客可见。如商品不能过审，管理员必须写明理由才可拒绝商品商品发布。

管理端对商家端的管理主要为商店的注册和商店在顾客端首页“推荐商店”下的排名

商店的注册流程与商家端店主添加店员的流程类似。管理端生成商店注册码后发给店主，店主在商家端登录页面点击“新商入驻”后输入注册码即可完成注册

管理端可以修改商家的排名值。排名值越高则排名越靠前

以下演示管理端审核用户上传的二手商品流程
![review_customer_goods](README_FIG/review_customer_goods.gif)


