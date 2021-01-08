// pages/stores/stores.js
var app = getApp()
var get_user_mobile;var che_user;var get_ltd_list;var page = 1;var get_goods_type;

var loadMore = function(that){
  // that.setData({
  //   hidden: false,
  //   stopdowning: true
  // });
  wx.request({
    url: get_ltd_list,
    data: {
      // page: page,
      uid: that.data.uid,
      typeid: that.data.typeid,
      // limit: that.data.limit
    },
    success: function (res) {
      console.log(res.data.data);
      if ( res.data.code == 1) {
        var goods = that.data.goods;
        var list = res.data.data;
        var img_url = app.data.img_url;
        for(var i=0;i<list.length;i++){
          if(list[i].ltd != null){
            for(var j=0;j<list[i].ltd.length;j++){
              list[i].ltd[j].logo_image = img_url+list[i].ltd[j].logo_image;
            }
            goods.push(list[i]);
          }
        }
        that.setData({
          goods:goods
        })
      }
      // page++;
      // if (res.data.code == -1) {
      //   that.setData({
      //     hidden: true,
      //     stopdowning: true
      //   });
      // } else {
      //   that.setData({
      //     hidden: false
      //   });
      // }
    }
  });
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0,
    stopdowning: false,
    hidden: false,
    cate:[],
    goods:[],
    headindex:0,
    typeid:'',
    limit:20,
    uid:'',
    headurl:'',//用户头像
    mobile:'',//用户手机号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var aid = wx.getStorageSync('uid');
    get_user_mobile = app.data.shop_url+'get_user_mobile';
    che_user = app.data.shop_url+'che_user';
    get_ltd_list = app.data.ltd + 'get_ltd_list';
    get_goods_type = app.data.index_url + 'get_goods_type';
    wx.request({
      url: get_goods_type,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        if(res.data.code == 1){
          var list = res.data.data;
          page = 1;
          that.setData({
            cate:list,
            goods:[],
            uid:aid,
            typeid:list[0].id
          })
          loadMore(that);
        }
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    }) 
  },
  headtap:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    page = 1;
    that.setData({
      headindex:index,
      goods:[],
      typeid:id
    })
    loadMore(that);
  },
  soutap:function(e){
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/s_search/s_search?name='+name,
    })
  },
  searchtap:function(e){
    wx.navigateTo({
      url: '/pages/s_search/s_search',
    })
  },
  xqtap:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/s_storesxq/s_storesxq?id='+id,
    })
  },
  getUserInfo: function(e) {
    var that = this;
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorageSync('userInfo', e.detail.userInfo);//存储userInfo
      var aid = wx.getStorageSync('uid');
      var name = e.detail.userInfo.nickName;
      var img = e.detail.userInfo.avatarUrl;
      app.data.headurl = img;
      wx.request({
        url: che_user,
        data: {
          uid: aid,
          img: img,
          nickname: name
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data);
          
        }
      });
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        headurl:img
      })
    }
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getPhoneNumber: function (e) {
    var that = this;
    if (e.detail.encryptedData){
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res.code);
          wx.request({
            url: get_user_mobile,
            data: {
              code: res.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data);
              var mobile = res.data;
              app.data.mobile = mobile;
              that.setData({
                mobile: mobile
              })
            }
          })
        }
      })
    }
  },
  // bindDownLoad: function () {
  //   var that = this;
  //   console.log(that.data.stopdowning);
  //   if (!that.data.stopdowning) {
  //     loadMore(that);
  //   } else {
  //     console.log('gg');
  //     return;
  //   }
  // },
  // scroll: function (event) {
  //   this.setData({
  //     scrollTop: event.detail.scrollTop
  //   });
  // },
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