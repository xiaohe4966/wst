// pages/u_jfcz/u_jfcz.js
var app = getApp()
var new_order;var get_rmb_bili;var query_order;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:'',
    jf:'???',
    type:0,
    score:0,
    wan:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var type = options.type;
    if(type == 1){
      wx.setNavigationBarTitle({
        title: '积分充值' 
      })
    }else{
      wx.setNavigationBarTitle({
        title: '金币充值' 
      })
    }
    new_order = app.data.order_url+'new_order';
    get_rmb_bili = app.data.order_url+'get_rmb_bili';
    query_order = app.data.order_url+'query_order';
    wx.request({
      url: get_rmb_bili,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        var score = res.data.score;
        var wan = res.data.wan;
        that.setData({
          score:score,
          wan:wan,
          type:type
        })
      }
    })
  },
  price:function(e){
    var that = this;
    var type = that.data.type;
    var score = that.data.score;
    var wan = that.data.wan;
    if(type == 1){
      var jf = Number(e.detail.value)*Number(score);
      that.setData({
        price:e.detail.value,
        jf:jf
      })
    }else{
      var jf = Number(e.detail.value)*Number(wan);
      that.setData({
        price:e.detail.value,
        jf:jf
      })
    }
  },
  submit:function(e){
    var that = this;
    var aid = wx.getStorageSync('uid');
    var type = that.data.type;
    var price = that.data.price;
    if(price == ''){
      wx.showModal({
        title: '提示',
        content: '请输入充值金额',
        showCancel: false
      })
    }else{
      wx.showLoading();
      wx.request({
        url: new_order,
        data: {
          uid:aid,
          type:type,
          money:price
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          console.log(res.data);
          if(res.data.code == 1){
            var order = res.data.data.order;
              wx.requestPayment({
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': 'MD5',
              'paySign': res.data.data.paySign,
              'success': function (res) {
                console.log(res);
                wx.hideLoading();
                wx.request({
                  url: query_order,
                  data: {
                    order:order
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success (res) {
                    console.log(res.data);
                  }
                })
                wx.showModal({
                  title: '提示',
                  content: '支付成功!',
                  showCancel: false,
                  success: function () {
                    wx.switchTab({
                      url: '/pages/ucenter/ucenter',
                    })
                  }
                })
              },
              'fail': function (res) {
                console.log(res);
                wx.hideLoading();
                wx.request({
                  url: query_order,
                  data: {
                    order:order
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success (res) {
                    console.log(res.data);
                  }
                })
                wx.showModal({
                  title: '提示',
                  content: '支付失败!',
                  showCancel: false
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