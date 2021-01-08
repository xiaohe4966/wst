// pages/u_pj/u_pj.js
var app = getApp()
var add_comment;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    one_2: 0,
    two_2: 5,
    askid:'',
    ltd_id:'',
    content:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var ltd_id = options.ltd_id;
    var askid = options.askid;
    add_comment = app.data.ask_order+'add_comment';
    that.setData({
      ltd_id:ltd_id,
      askid:askid
    })
  },
  in_xin: function (e) {
    var in_xin = e.currentTarget.dataset.in;
    console.log(e.currentTarget.dataset.in);
    var one_2;
    if (in_xin == 'use_sc2') {
      one_2 = Number(e.currentTarget.id)
    } else {
      one_2 = Number(e.currentTarget.id) + this.data.one_2
    }
    this.setData({
      one_2: one_2,
      two_2: 5 - one_2
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
    var ltd_id = that.data.ltd_id;
    var askid = that.data.askid;
    var two_2 = that.data.two_2;
    var content = that.data.content;
    if(content == ''){
      wx.showModal({
        title: '提示',
        content: '请输入评价内容',
        showCancel: false
      })
    }else{
      wx.showLoading();
      wx.request({
        url: add_comment,
        data: {
          uid:aid,
          ltd_id:ltd_id,
          ask_id:askid,
          level:two_2,
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
              content: '评价成功！',
              showCancel: false,
              success:function(e){
                wx.switchTab({
                  url: '/pages/ucenter/ucenter',
                })
              }
            })
          }else{
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
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