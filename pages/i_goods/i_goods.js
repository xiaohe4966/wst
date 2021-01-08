// pages/i_goods/i_goods.js
var app = getApp()
var get_all_goods;var page = 1;var get_goods_type;

var loadMore = function(that){
  that.setData({
    hidden: false,
    stopdowning: true
  });
  wx.request({
    url: get_all_goods,
    data: {
      page: page,
      typeid: that.data.typeid,
      limit: that.data.limit
    },
    success: function (res) {
      console.log(res.data.data);
      if ( res.data.code == 1) {
        var goods = that.data.goods;
        var cun_goods = app.data.cun_goods;
        var list = res.data.data;
        for(var i=0;i<list.length;i++){
          list[i].select = false;
          goods.push(list[i]);
        }
        for(var i=0;i<cun_goods.length;i++){
          for(var j=0;j<goods.length;j++){
            if(cun_goods[i].id == goods[j].id){
              goods[j].select = true;
            }
          }
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
    scrollHeight: 0,
    stopdowning: false,
    hidden: false,
    cate:[],
    goods:[],
    headindex:0,
    typeid:'',
    limit:20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    get_all_goods = app.data.index_url + 'get_all_goods';
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
  xztap:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var goods = that.data.goods;
    var cun_goods = app.data.cun_goods;
    if(goods[index].select == false){
      goods[index].select = true;
      cun_goods.push(goods[index]);
    }else{
      goods[index].select = false;
      for(var i=0;i<cun_goods.length;i++){
        if(id == cun_goods[i].id){
          cun_goods.splice(i,1);
        }
      }
    }
    app.data.cun_goods = cun_goods;
    that.setData({
      goods:goods
    })
  },
  backtap:function(e){
    wx.navigateBack({
      delta: 1
    })
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