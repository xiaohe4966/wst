// pages/u_stores/u_stores.js
var app = getApp()
var get_ask_order_look_ltd;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var aid = wx.getStorageSync('uid');
    get_ask_order_look_ltd = app.data.ask_order+'get_ask_order_look_ltd';
    wx.request({
      url: get_ask_order_look_ltd,
      data: {
        uid:aid,
        ask_id:id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        if(res.data.code == 1){
          var list = res.data.data;
          var img_url = app.data.img_url;
          if(list.length != 0){
            for(var i=0;i<list.length;i++){
              list[i].ltd.logo_image = img_url+list[i].ltd.logo_image;
            }
          }
          that.setData({
            list:list
          })
        }
      }
    })
  },
  wechat:function(e){
    var id = e.currentTarget.dataset.id;
    var headimgS = e.currentTarget.dataset.headimg;
    var nicknameS = e.currentTarget.dataset.nickname;
    wx.navigateTo({
      url: '/pages/u_wechat/u_wechat?id='+id+'&headimgS='+headimgS+'&nicknameS='+nicknameS+'&stores=0',
    })
  },
  pricetap:function(e){
    var askid = e.currentTarget.dataset.askid;
    var ltd_id = e.currentTarget.dataset.ltd_id;
    wx.navigateTo({
      url: '/pages/u_storesXJprice/u_storesXJprice?askid='+askid+'&ltd_id='+ltd_id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})