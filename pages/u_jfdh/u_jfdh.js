// pages/u_jfdh/u_jfdh.js
var app = getApp()
var get_score_goods_list;var add_score_goods_order;var page = 1;var get_user;

var loadMore = function(that){
  that.setData({
    hidden: false,
    stopdowning: true
  });
  wx.request({
    url: get_score_goods_list,
    data: {
      page: page
    },
    success: function (res) {
      console.log(res.data.data);
      if ( res.data.code == 1) {
        var goods = that.data.goods;
        var list = res.data.data;
        var img_url = app.data.img_url;
        for(var i=0;i<list.length;i++){
          list[i].image = img_url + list[i].image;
          goods.push(list[i]);
        }
        that.setData({
          goods:goods
        })
      }
      page++;
      if (res.data.code == -1) {
        that.setData({
          hidden: true,
          stopdowning: true
        });
      } else {
        that.setData({
          hidden: false
        });
      }
    }
  });
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    stopdowning: false,
    hidden: false,
    goods:[],
    limit:10,
    score:'0',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var aid = wx.getStorageSync('uid');
    get_score_goods_list = app.data.score_goods+'get_score_goods_list';
    add_score_goods_order = app.data.score_goods+'add_score_goods_order';
    get_user = app.data.shop_url+'get_user';
    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
          uid:aid,
          goods:[]
        });
      }
    }) 
    page = 1;
    loadMore(that);
  },
  dhtap:function(e){
    var that = this;
    var score = that.data.score;
    var id = e.currentTarget.dataset.id;
    var jf = e.currentTarget.dataset.jf;
    var name = e.currentTarget.dataset.name;
    // wx.navigateTo({
    //   url: '/pages/u_address/u_address?id='+id+'&jf='+jf+'&name='+name,
    // })
    if(Number(score) < Number(jf)){
      wx.showModal({
        title: '提示',
        content: '积分不足，不可兑换！',
        showCancel: false
      })
    }else{
      wx.navigateTo({
        url: '/pages/u_address/u_address?id='+id+'&jf='+jf+'&name='+name,
      })
    }
  },
  bindDownLoad: function () {
    var that = this;
    console.log(that.data.stopdowning);
    if (!that.data.stopdowning) {
      loadMore(that);
    } else {
      console.log('gg');
      return;
    }
  },
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
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
        var info = res.data.user;
        that.setData({
          score:info.score
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