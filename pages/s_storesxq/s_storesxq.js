// pages/s_storesxq/s_storesxq.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var demo = new QQMapWX({
  key: 'ZOKBZ-3YZK3-IBW34-YKATO-EPPYO-D7BR2' // 必填 。
});
var app = getApp()
var get_ltd_data;var update_star_ltd;var get_comment_list;var add_ask_order_chat;

var loadPj = function(that){
  wx.request({
    url: get_comment_list,
    data: {
      ltd_id:that.data.info.id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success (res) {
      console.log(res.data);
      var list = res.data.data;
      if(list.length != 0){
        for(var i=0;i<list.length;i++){
          list[i].level = Number(list[i].level);
        }
        that.setData({
          pj:list
        })
      }
    }
  })
};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls:[],
    indicatorDots: false,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 800,
    sel:[
      {name:'样品'},
      {name:'评价'}
    ],
    selindex:0,
    info:'',
    id:'',
    image:[],
    pj:[],
    wst_code:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var aid = wx.getStorageSync('uid');
    var wst_code = app.data.wst_code;
    that.setData({
      wst_code:wst_code
    })
    get_ltd_data = app.data.ltd+'get_ltd_data';
    get_comment_list = app.data.ltd+'get_comment_list';
    update_star_ltd = app.data.ltd+'update_star_ltd';
    add_ask_order_chat = app.data.ask_order+'add_ask_order_chat';
    wx.request({
      url: get_ltd_data,
      data: {
        uid:aid,
        ltd_id:id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        var img_url = app.data.img_url;
        if(res.data.code == 1){
          var info = res.data.data;
          info.qrimage = img_url+info.qrimage;
          var banner_image = info.banner_image.split(',');
          for(var i=0;i<banner_image.length;i++){
            banner_image[i] = img_url+banner_image[i];
          }
          wx.setNavigationBarTitle({
            title: info.ltd_name
          })
          var image = [];
          var goods = info.images.split(',');
          for(var i=0;i<goods.length;i++){
            goods[i] = img_url+goods[i];
            image.push(goods[i]);
          }
          that.setData({
            info:info,
            id:id,
            image:image,
            imgUrls:banner_image
          })
        }
      }
    })
    
  },
  wechat:function(e){
    var that = this;
    var aid = wx.getStorageSync('uid');
    var info = that.data.info;
    var img_url = app.data.img_url;
    var id = info.id;
    var uid = info.uid;
    // app.data.ltd_id = id;
    // wx.switchTab({
    //   url: '/pages/index/index',
    // })
    var headimgS = img_url + info.logo_image;
    var nicknameS =info.ltd_name;
    wx.request({
      url: add_ask_order_chat,
      data: {
        uid:aid,
        ltd_id:id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        var ask_id = res.data.data.ask_id;
        wx.navigateTo({
          url: '/pages/u_wechat/u_wechat?id='+uid+'&ltd_id='+id+'&askid='+ask_id+'&headimgS='+headimgS+'&nicknameS='+nicknameS+'&stores=0',
        })
      }
    })
  },
  gztap:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var info = that.data.info;
    var aid = wx.getStorageSync('uid');
    wx.request({
      url: update_star_ltd,
      data: {
        uid:aid,
        ltd_id:id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        if(res.data.code == 1){
          info.star = !info.star;
          that.setData({
            info:info
          })
        }
      }
    })
  },
  seltap:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    if(index == 1){
      that.setData({
        pj:[],
        selindex:index
      })
      loadPj(that);
    }else{
      that.setData({
        selindex:index
      })
    }
  },
  previewImgxc: function (e) {
    var that = this;
    var src = e.currentTarget.dataset.src;
    var imgUrls = [];
    imgUrls.push(src);
    wx.previewImage({
      current: imgUrls[0],     //当前图片地址
      urls: imgUrls               //所有要预览的图片的地址集合 数组形式
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
  dhtap:function(e){
    var that = this;
    var area = app.data.area;
    var name = e.currentTarget.dataset.name;
    var addr = area+e.currentTarget.dataset.addr;
    demo.geocoder({
      address: addr, //地址参数
      success: function (res) {
        console.log(res);
        var res = res.result;
        var lat = res.location.lat;
        var lng = res.location.lng;
        wx.openLocation({
          latitude: lat,
          longitude: lng,
          scale: 18,
          name: name,
          address: addr
        })
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