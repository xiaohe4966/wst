// pages/u_xjdS/u_xjdS.js
var app = getApp()
var ltd_get_my_order;var hide_ask_answer;

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
    ltd_get_my_order = app.data.ask_answer+'ltd_get_my_order';
    hide_ask_answer = app.data.ask_answer+'hide_ask_answer';
  },
  wechat:function(e){
    var id = e.currentTarget.dataset.id;
    var askid = e.currentTarget.dataset.askid;
    var headimgS = e.currentTarget.dataset.headimg;
    var nicknameS = e.currentTarget.dataset.nickname;
    var ltd_id = e.currentTarget.dataset.ltd_id;
    // wx.showModal({
    //   title: '提示',
    //   content: '每日查看消息第一条和第二条免费，是否确认查看？',
    //   showCancel: true,
    //   success:function(e) {
    //     if(e.confirm){
    //       wx.navigateTo({
    //         url: '/pages/u_wechat/u_wechat?id='+id+'&headimgS='+headimgS+'&nicknameS='+nicknameS+'&askid='+askid+'&ltd_id='+ltd_id+'&stores=1',
    //       })
    //     }
    //   }
    // })
    wx.navigateTo({
      url: '/pages/u_wechat/u_wechat?id='+id+'&headimgS='+headimgS+'&nicknameS='+nicknameS+'&askid='+askid+'&ltd_id='+ltd_id+'&stores=1',
    })
  },
  pricetap:function(e){
    var that = this;
    var askid = e.currentTarget.dataset.askid;
    wx.navigateTo({
      url: '/pages/u_xjdPirce/u_xjdPirce?askid='+askid,
    })
  },
  deltap:function(e){
    var that = this;
    var askid = e.currentTarget.dataset.askid;
    var aid = wx.getStorageSync('uid');
    wx.showModal({
      title: '提示',
      content: '是否确认删除？',
      showCancel: true,
      success:function(e){
        if(e.confirm){
          wx.request({
            url: hide_ask_answer,
            data: {
              uid:aid,
              ask_id:askid
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success (res) {
              console.log(res.data);
              if(res.data.code == 1){
                that.setData({
                  list:[]
                })
                that.onShow();
              }else{
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: false
                })
              }
            }
          })
        }
      }
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
    var that = this;
    var aid = wx.getStorageSync('uid');
    wx.request({
      url: ltd_get_my_order,
      data: {
        uid:aid,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        if(res.data.code == 1){
          var list = res.data.data;
          var img_url = app.data.img_url;
          that.setData({
            list:list
          })
        }
      }
    })
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