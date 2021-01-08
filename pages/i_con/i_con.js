// pages/i_con/i_con.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var content = app.data.content;
    that.setData({
      content:content
    })
  },
  content:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  submit:function(e){
    var that = this;
    var content = that.data.content;
    console.log(content);
    if(content == ''){
      wx.showModal({
        title: '提示',
        content: '请输入留言内容',
        showCancel: false
      })
    }else{
      app.data.content = content;
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
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