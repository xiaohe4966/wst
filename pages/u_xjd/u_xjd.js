// pages/u_xjd/u_xjd.js
var app = getApp()
var user_get_ask_order_data;

let innerAudioContext = wx.createInnerAudioContext(); //创建音频实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:'',
    image:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var aid = options.aid;
    user_get_ask_order_data = app.data.ask_order+'user_get_ask_order_data';
    wx.request({
      url: user_get_ask_order_data,
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
          var info = res.data.data;
          var img_url = app.data.img_src;
          if(info.files != ''){
            info.files = img_url+info.files;
          }
          if(info.images != ''){
            var image = info.images.split(',');
            for(var i=0;i<image.length;i++){
              image[i] = img_url+image[i];
            }
          }
          that.setData({
            info:info,
            image:image
          })
        }
      }
    })
     
  },
  playtap:function(e){
    var that = this;
    var info = that.data.info;
    var img_url = app.data.img_url;
    var tempFilePath = img_url + info.voice;
    innerAudioContext.src = tempFilePath; 
    innerAudioContext.play();
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