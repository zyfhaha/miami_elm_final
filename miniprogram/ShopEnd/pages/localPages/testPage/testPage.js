//Page Object
Page({
  data: {
    text:"aegseh",
    show:false,
  },

  onTap(){
    this.setData({show:true})
  },

  handleDialogRes(e){
    console.log(e);
    this.setData({show:false})
  },
  //options(Object)
  onLoad: function(options){
    
  },
  onReady: function(){
    
  },
  onShow: function(){
  },
  onHide: function(){

  },
  onUnload: function(){

  },
  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

  },
  onShareAppMessage: function(){

  },
  onPageScroll: function(){

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item){

  }
});