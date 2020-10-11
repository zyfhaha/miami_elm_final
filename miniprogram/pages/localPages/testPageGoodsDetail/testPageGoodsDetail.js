const db = wx.cloud.database();
const goods_col = db.collection("goods");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
  },

  /* ================ 页面事务处理函数 ============== */
  async LoadDetailData(id) {
    id = parseInt(id);


    // 拿到数据库的商品
    let ins = goods_col.doc(id)

    // 访问量 +1 操作 
    await ins.update({
      data:{
        goodsBuyLimit:db.command.inc(1)
      }
    })

    // 获取
    let res = await ins.get()

    // 赋值
    this.setData({detail:res.data})

    // 这段代码发送了两次访问数据库的请求 不够优化
    // try {
    //   // 每访问一次该商品的goodsBuyLimit就 +1 （实际上这个是用来做商品浏览量统计的）
    //   await goods_col.doc(id).update({
    //     data: {
    //       goodsBuyLimit: db.command.incs(1),
    //     },
    //   });

    //   // 通过商品在数据库中的_id获取商品
    //   let res = await goods_col.doc(id).get();
    //   console.log("商品信息", res);
    //   this.setData({ detail: res.data });
    // } catch (error) { 
    //   console.log(error); 
    // }
    
  },

  /* =============== 页面生命周期函数 ================ */
  onLoad: function (options) {
    let { id } = options;
    // console.log(goodsId);
    this.LoadDetailData(id);
  },
});
