// pages/u_jfdhjl/u_jfdhjl.js
var app = getApp()
var get_my_score_order_list;var confirm;

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
    var aid = wx.getStorageSync('uid');
    get_my_score_order_list = app.data.score_goods+'get_my_score_order_list';
    confirm = app.data.score_goods+'confirm';
    wx.request({
      url: get_my_score_order_list,
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
          for(var i=0;i<list.length;i++){
            list[i].goods.image = img_url + list[i].goods.image;
          }
          that.setData({
            list:list
          })
        }
      }
    })
  },
  submit:function(e){
    var that = this;
    var list = that.data.list;
    var aid = wx.getStorageSync('uid');
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否确认已收货？',
      showCancel: true,
      success:function(e){
        if(e.confirm){
          wx.request({
            url: confirm,
            data: {
              uid:aid,
              id:id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success (res) {
              console.log(res.data);
              if(res.data.code == 1){
                wx.showModal({
                  title: '提示',
                  content: '已确认收货！',
                  showCancel: false,
                  success:function(e){
                    list[index].status = 4;
                    that.setData({
                      list:list
                    })
                  }
                })
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