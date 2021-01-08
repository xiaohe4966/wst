// pages/u_jfmx/u_jfmx.js
var app = getApp()
var get_my_score_list;var page = 1;

var loadMore = function(that){
  that.setData({
    hidden: false,
    stopdowning: true
  });
  wx.request({
    url: get_my_score_list,
    data: {
      page: page,
      uid: that.data.uid,
      limit: that.data.limit
    },
    success: function (res) {
      console.log(res.data.data);
      if ( res.data.code == 1) {
        var vip = that.data.vip;
        var goods = that.data.goods;
        var list = res.data.data.ltd;
        var user = res.data.data.user;
        if(vip == 1){
          for(var i=0;i<user.length;i++){
            goods.push(user[i]);
          }
        }else{
          for(var i=0;i<list.length;i++){
            goods.push(list[i]);
          }
        }
        that.setData({
          goods:goods
        })
      }
      page++;
      if (res.data.code == -1) {
        that.setData({
          hidden: true,
          stopdowning: true
        });
      } else {
        that.setData({
          hidden: false
        });
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
    limit:20,
    vip:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var vip = options.vip;
    var aid = wx.getStorageSync('uid');
    get_my_score_list = app.data.score_url+'get_my_score_list';
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
          uid:aid,
          vip:vip,
          goods:[]
        });
      }
    }) 
    page = 1;
    loadMore(that);
  },
  bindDownLoad: function () {
    var that = this;
    console.log(that.data.stopdowning);
    if (!that.data.stopdowning) {
      loadMore(that);
    } else {
      console.log('gg');
      return;
    }
  },
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
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