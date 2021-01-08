// pages/s_search/s_search.js
var app = getApp()
var search_ltd;

var loadMore = function(that){
  wx.request({
    url: search_ltd,
    data: {
      uid: that.data.uid,
      key: that.data.name
    },
    success: function (res) {
      console.log(res.data.data);
      if ( res.data.code == 1) {
        var goods = that.data.goods;
        var list = res.data.data;
        var img_url = app.data.img_url;
        for(var i=0;i<list.length;i++){
          list[i].logo_image = img_url+list[i].logo_image;
          goods.push(list[i]);
        }
        that.setData({
          goods:goods
        })
      }
    }
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    name:'',
    uid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var name = options.name;
    console.log(name);
    if(name == undefined){
      name = '';
    }
    var aid = wx.getStorageSync('uid');
    search_ltd = app.data.ltd+'search_ltd';
    that.setData({
      uid:aid,
      name:name,
      goods:[]
    })
    if(name != ''){
      loadMore(that);
    }
  },
  searchtap:function(e){
    var that = this;
    var val = e.detail.value;
    that.setData({
      name:val,
      goods:[]
    })
    loadMore(that);
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