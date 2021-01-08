// pages/u_kf/u_kf.js
var app = getApp()
var add_kefu;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    mobile:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    add_kefu = app.data.index_url+'add_kefu';
  },
  mobile:function(e){
    this.setData({
      mobile:e.detail.value
    })
  },
  content:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  submit:function(e){
    var that = this;
    var aid = wx.getStorageSync('uid');
    var mobile = that.data.mobile;
    var content = that.data.content;
    if(mobile == ''){
      wx.showModal({
        title: '提示',
        content: '请输入您的手机号码',
        showCancel: false
      })
    }else if(content == ''){
      wx.showModal({
        title: '提示',
        content: '请输入您的留言',
        showCancel: false
      })
    }else{
      wx.showLoading();
      wx.request({
        url: add_kefu,
        data: {
          uid:aid,
          mobile:mobile,
          content:content
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          console.log(res.data);
          if(res.data.code == 1){
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '信息提交成功！',
              showCancel: false,
              success:function(e){
                wx.switchTab({
                  url: '/pages/ucenter/ucenter',
                })
              }
            })
          }
        }
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