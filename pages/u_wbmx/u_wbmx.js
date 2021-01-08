// pages/u_jfmx/u_jfmx.js
var app = getApp()
var get_my_wanbi_list;

var loadMore = function(that){
  wx.request({
    url: get_my_wanbi_list,
    data: {
      uid: that.data.uid
    },
    success: function (res) {
      console.log(res.data.data);
      if (res.data.code == 1) {
        var goods = that.data.goods;
        var list = res.data.data;
        for(var i=0;i<list.length;i++){
          goods.push(list[i]);
        }
        that.setData({
          goods:goods
        })
      }
    }
  });
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    stopdowning: false,
    hidden: false,
    goods:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var aid = wx.getStorageSync('uid');
    get_my_wanbi_list = app.data.score_url+'get_my_wanbi_list';
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
          uid:aid,
          goods:[]
        });
      }
    }) 
    loadMore(that);
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