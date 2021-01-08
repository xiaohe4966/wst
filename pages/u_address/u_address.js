// pages/u_address/u_address.js
var app = getApp()
var add_score_goods_order;var get_last_addr;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['', '请选择所在地区', ''],
    name:'',
    mobile:'',
    addr:'',
    id:'',
    jf:'',
    dh_name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var jf = options.jf;
    var name = options.name;
    add_score_goods_order = app.data.score_goods+'add_score_goods_order';
    get_last_addr = app.data.score_goods+'get_last_addr';
    that.setData({
      id:id,
      jf:jf,
      dh_name:name
    })
    var aid = wx.getStorageSync('uid');
    wx.request({
      url: get_last_addr,
      data: {
        uid:aid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        if(res.data.code == 1){
          var info = res.data.data;
          var region = that.data.region;
          region[1] = info.area;
          that.setData({
            name:info.name,
            mobile:info.tel,
            addr:info.addr,
            region:region
          })
        }
      }
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  submit:function(e){
    var that = this;
    var id = that.data.id;
    var name = that.data.name;
    var mobile = that.data.mobile;
    var region = that.data.region;
    var addr = that.data.addr;
    var aid = wx.getStorageSync('uid');
    if(name == ''){
      wx.showModal({
        title: '提示',
        content: '请输入收货人姓名',
        showCancel: false
      })
    }else if(mobile == ''){
      wx.showModal({
        title: '提示',
        content: '请输入收货人电话',
        showCancel: false
      })
    }else if(region[1] == '请选择所在地区'){
      wx.showModal({
        title: '提示',
        content: '请选择所在地区',
        showCancel: false
      })
    }else if(addr == ''){
      wx.showModal({
        title: '提示',
        content: '请填写街道、楼牌号等',
        showCancel: false
      })
    }else{
      var area = region[0]+region[1]+region[2];
      wx.showLoading();
      wx.request({
        url: add_score_goods_order,
        data: {
          uid:aid,
          goods_id:id,
          name:name,
          tel:mobile,
          area:area,
          addr:addr,
          gbook:'',
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
              content: '兑换成功！',
              showCancel: false,
              success:function(e){
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
  name:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  mobile:function(e){
    this.setData({
      mobile:e.detail.value
    })
  },
  addr:function(e){
    this.setData({
      addr:e.detail.value
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