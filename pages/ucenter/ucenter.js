// pages/ucenter/ucenter.js
var app = getApp()
var get_user_mobile;var che_user;var get_user;var bind_ltd;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    info:"",
    headurl:'',
    nickname:'',
    stores:null,//是否为商家
    fix:false,
    tell:'',
    vip:1,
  },
  hidetap:function(e){
    this.setData({
      fix:false
    })
  },
  showtap:function(e){
    this.setData({
      fix:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    get_user_mobile = app.data.shop_url+'get_user_mobile';
    che_user = app.data.shop_url+'che_user';
    get_user = app.data.shop_url+'get_user';
    bind_ltd = app.data.ltd+'bind_ltd';
  },
  fixtap:function(e){
    var that = this;
    var tell = that.data.tell;
    if(tell == ''){
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
        showCancel: false
      })
    }else{
      var aid = wx.getStorageSync('uid');
      wx.request({
        url: bind_ltd,
        data: {
          uid:aid,
          mobile:tell
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          console.log(res.data);
          if(res.data.code == 1){
            that.setData({
              fix:false,
              tell:''
            })
            wx.showModal({
              title: '提示',
              content: '店铺绑定成功',
              showCancel: false,
              success:function(e){
                that.onShow();
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
  },
  codetap:function(e){
    var that = this;
    var info = that.data.info;
    var tx_switch = info.tx_switch;
    if(tx_switch == 1){
      wx.navigateTo({
        url: '/pages/u_map/u_map',
      })
    }
  },
  tell:function(e){
    this.setData({
      tell:e.detail.value
    })
  },
  xqtap:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/s_storesxq/s_storesxq?id='+id,
    })
  },
  xjdtap:function(e){
    wx.navigateTo({
      url: '/pages/u_xjdF/u_xjdF',
    })
  },
  sctap:function(e){
    wx.navigateTo({
      url: '/pages/u_sc/u_sc',
    })
  },
  xjdStap:function(e){
    wx.navigateTo({
      url: '/pages/u_xjdS/u_xjdS',
    })
  },
  storestap:function(e){
    wx.navigateTo({
      url: '/pages/u_stores/u_stores',
    })
  },
  jfdhtap:function(e){
    wx.navigateTo({
      url: '/pages/u_jfdh/u_jfdh',
    })
  },
  dhjltap:function(e){
    wx.navigateTo({
      url: '/pages/u_jfdhjl/u_jfdhjl',
    })
  },
  jfcztap:function(e){
    var that = this;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/u_jfcz/u_jfcz?type='+type,
    })
  },
  jfmxtap:function(e){
    var that = this;
    var vip = that.data.vip;
    wx.navigateTo({
      url: '/pages/u_jfmx/u_jfmx?vip='+vip,
    })
  },
  wbtap:function(e){
    wx.navigateTo({
      url: '/pages/u_wbmx/u_wbmx',
    })
  },
  kftap:function(e){
    wx.navigateTo({
      url: '/pages/u_kf/u_kf',
    })
  },
  viptap:function(e){
    var that = this;
    var vip = that.data.vip;
    if(vip == 2){
      app.data.vip = 1;
      that.setData({
        vip:1
      })
    }else{
      app.data.vip = 2;
      that.setData({
        vip:2
      })
    }
  },
  getUserInfo: function(e) {
    var that = this;
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
          that.onShow();
        }
      });
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
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
    var vip = app.data.vip;
    console.log(vip);
    wx.request({
      url: get_user,
      data: {
        uid:aid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        var stores = res.data.ltd;
        var img_url = app.data.img_url;
        if(stores != null){
          stores.logo_image = img_url+stores.logo_image;
        }
        if(vip == ''){
          if(stores != null){
            app.data.vip = 2;
            that.setData({
              vip:2
            })
          }else{
            app.data.vip = 1;
            that.setData({
              vip:1
            })
          }
        }
        var info = res.data.user;
        var mobile = info.mobile;
        app.data.mobile = mobile;
        var headurl = info.headurl;
        var nickname = info.nickname;
        that.setData({
          mobile:mobile,
          headurl:headurl,
          nickname:nickname,
          info:info,
          stores:stores
        })
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