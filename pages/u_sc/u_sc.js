// pages/u_sc/u_sc.js
var app = getApp()
var get_my_star;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var aid = wx.getStorageSync('uid');
    get_my_star = app.data.ltd+'get_my_star';
    wx.request({
      url: get_my_star,
      data: {
        uid:aid
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
              list[i].logo_image = img_url+list[i].logo_image;
            }
            that.setData({
              list:list
            })
          }
        }
      }
    })
  },
  xqtap:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/s_storesxq/s_storesxq?id='+id,
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