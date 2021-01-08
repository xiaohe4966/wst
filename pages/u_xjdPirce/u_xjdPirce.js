// pages/u_xjd/u_xjd.js
var app = getApp()
var look_ask_order;var get_rmb_bili;var agree_score_end;var get_money_change_to_score;var agree_apply_score;var pay_ask_answer;

var load = function(that){
  wx.request({
    url: look_ask_order,
    data: {
      uid:that.data.uid,
      ask_id:that.data.askid
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
        if(info.price == null){
          info.price = '';
          that.setData({
            jf:'??'
          })
        }else{
          that.setData({
            jf:info.score
          })
        }
        that.setData({
          info:info,
          image:image,
          status:info.status,
          score_status:info.score_status,
          price:info.price,
          score:info.score
        })
      }else{
        that.setData({
          fix:true
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
    info:'',
    image:[],
    uid:'',
    askid:'',
    price_score:'',
    jf:'??',
    sj_jf:'0',
    status:0,
    score_status:0,
    price:'',
    score:'',
    look_wan:'',
    fix:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var look_wan = app.data.look_wan;
    var askid = options.askid;
    var aid = wx.getStorageSync('uid');
    that.setData({
      look_wan:look_wan,
      uid:aid,
      askid:askid
    })
    
    look_ask_order = app.data.ltd+'look_ask_order';
    get_rmb_bili = app.data.order_url+'get_rmb_bili';
    agree_score_end = app.data.ask_answer+'agree_score_end';
    get_money_change_to_score = app.data.index_url+'get_money_change_to_score';
    agree_apply_score = app.data.ask_answer+'agree_apply_score';
    pay_ask_answer = app.data.ltd+'pay_ask_answer';
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
    load(that);
     
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
    // wx.request({
    //   url: get_money_change_to_score,
    //   data: {
    //     money:price
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success (res) {
    //     console.log(res.data);
    //     that.setData({
    //       jf:res.data
    //     })
    //   }
    // })
  },
  submit:function(e){
    var that = this;
    var aid = wx.getStorageSync('uid');
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
        url: agree_score_end,
        data: {
          uid:aid,
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
              content: '金额确认成功！',
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
    }
  },  
  submitJF:function(e){
    var that = this;
    var aid = wx.getStorageSync('uid');
    var askid = that.data.askid;
    wx.showLoading()
    wx.request({
      url: agree_apply_score,
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
            content: '积分确认成功！',
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
  cztap:function(e){
    var that = this;
    var aid = wx.getStorageSync('uid');
    wx.request({
      url: pay_ask_answer,
      data: {
        uid:aid,
        ask_id:that.data.askid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        if(res.data.code == 1){
          that.setData({
            fix:false
          })
          load(that);
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success:function(e){
              wx.navigateTo({
                url: '/pages/u_jfcz/u_jfcz?type=2',
              })
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