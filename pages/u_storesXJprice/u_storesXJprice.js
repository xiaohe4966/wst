// pages/u_xjd/u_xjd.js
var app = getApp()
var user_get_ask_order_data;var get_rmb_bili;var user_apply_price;var apply_score;

var loadMore = function(that){
  wx.request({
    url: user_get_ask_order_data,
    data: {
      uid:that.data.aid,
      id:that.data.askid,
      ltd_id:that.data.ltd_id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success (res) {
      console.log(res.data);
      if(res.data.code == 1){
        var info = res.data.data;
        var img_url = app.data.img_url;
        if(info.files != ''){
          info.files = img_url+info.files;
        }
        if(info.images != ''){
          var image = info.images.split(',');
          for(var i=0;i<image.length;i++){
            image[i] = img_url+image[i];
          }
        }
        if(info.price == '0.00'){
          info.price = '';
        }
        that.setData({
          info:info,
          image:image,
          status:info.status,
          score_status:info.score_status,
          price:info.price,
          score:info.score,
          comment_status:info.comment_status
        })
      }
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:'',
    image:[],
    aid:'',
    askid:'',
    ltd_id:'',
    price_score:'',
    jf:'??',
    sj_jf:'0',
    status:0,
    score_status:0,
    price:'',
    score:'',
    comment_status:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var askid = options.askid;
    var ltd_id = options.ltd_id;
    var aid = wx.getStorageSync('uid');
    that.setData({
      askid:askid,
      ltd_id:ltd_id,
      aid:aid
    })
    user_get_ask_order_data = app.data.ask_order+'user_get_ask_order_data';
    get_rmb_bili = app.data.order_url+'get_rmb_bili';
    user_apply_price = app.data.ask_order+'user_apply_price';
    apply_score = app.data.ask_order+'apply_score';
    wx.request({
      url: get_rmb_bili,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        var price_score = res.data.price_score;
        that.setData({
          price_score:price_score
        })
      }
    })
    loadMore(that);
  },
  pjtap:function(e){
    var that = this;
    var askid = that.data.askid;
    var ltd_id = that.data.ltd_id;
    wx.navigateTo({
      url: '/pages/u_pj/u_pj?ltd_id='+ltd_id+'&askid='+askid,
    })
  },
  price:function(e){
    var that = this;
    var price_score = that.data.price_score;
    var price = e.detail.value;
    var jf = (Number(price)/Number(price_score)).toFixed(0);
    that.setData({
      price:price,
      jf:jf
    })
  },
  submit:function(e){
    var that = this;
    var aid = wx.getStorageSync('uid');
    var ltd_id = that.data.ltd_id;
    var price = that.data.price;
    var askid = that.data.askid;
    if(price == ''){
      wx.showModal({
        title: '提示',
        content: '请输入金额',
        showCancel: false
      })
    }else{
      wx.showLoading();
      wx.request({
        url: user_apply_price,
        data: {
          uid:aid,
          ltd_id:ltd_id,
          ask_id:askid,
          price:price
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
              content: '金额提交成功，请等待商家确认！',
              showCancel: false,
              success:function(e){
                // loadMore(that);
                wx.navigateBack({
                  delta: 1,
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
  submitJF:function(e){
    var that = this;
    var aid = wx.getStorageSync('uid');
    var askid = that.data.askid;
    wx.showLoading();
    wx.request({
      url: apply_score,
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
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '申请积分中，请等待商家确认！',
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
  },
  playtap:function(e){
    var that = this;
    var info = that.data.info;
    var tempFilePath = info.voice;
    wx.playVoice({
      filePath: tempFilePath
    })
  },
  opentap:function(e){
    var that = this;
    var info = that.data.info;
    var files = info.files;
    wx.showLoading();
    wx.downloadFile({
      url: files,
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            wx.hideLoading();
            console.log('打开文档成功')
          }
        })
      }
    })
  },
  previewImg: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var imgUrls = that.data.image;
    wx.previewImage({
      current: imgUrls[index],     //当前图片地址
      urls: imgUrls               //所有要预览的图片的地址集合 数组形式
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