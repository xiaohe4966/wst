//index.js
//获取应用实例
var app = getApp()
var upload;var get_openid;var get_user;var che_user;var get_user_mobile;var add_ask_order;var flag = 1;var get_rmb_bili;var update_pid;

var load = function(that,tempFilePaths,type){
  wx.uploadFile({
    url: upload,
    filePath: tempFilePaths[0],
    name: 'file',
    success(res) {
      console.log(res);
      var js=JSON.parse(res.data);
      console.log(js);
      var url = js.data.url;
      if(type == 1){
        that.setData({
          photo1:url
        })
      }else if(type == 2){
        that.setData({
          photo2:url
        })
      }else if(type == 3){
        that.setData({
          photo3:url
        })
      }else if(type == 4){
        that.setData({
          photo4:url
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
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tempFilePaths1:['../../image/i_upload.png'],
    tempFilePaths2:['../../image/i_upload.png'],
    tempFilePaths3:['../../image/i_upload.png'],
    tempFilePaths4:'../../image/i_upload.png',
    photo1:'',
    photo2:'',
    photo3:'',
    photo4:'',
    fix:false,
    headurl:'',//用户头像
    mobile:'',//用户手机号
    content:'',//文字留言
    video:'',//语言留言
    cun_goods:[],
  },
  hidetap:function(e){
    var that = this;
    app.data.content = '';
    app.data.video = '';
    app.data.cun_goods = [];
    that.setData({
      fix:false,
      content:'',
      video:'',
      cun_goods:[],
      tempFilePaths1:['../../image/i_upload.png'],
      tempFilePaths2:['../../image/i_upload.png'],
      tempFilePaths3:['../../image/i_upload.png'],
      tempFilePaths4:'../../image/i_upload.png',
      photo1:'',
      photo2:'',
      photo3:'',
      photo4:'',
      ltd_id:'',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pid = options.pid;
    console.log(pid);
    get_openid = app.data.shop_url + 'get_openid';
    get_user = app.data.shop_url+'get_user';
    get_user_mobile = app.data.shop_url+'get_user_mobile';
    che_user = app.data.shop_url+'che_user';
    upload = app.data.common_url + 'upload';
    add_ask_order = app.data.ask_order + 'add_ask_order';
    get_rmb_bili = app.data.order_url + 'get_rmb_bili';
    update_pid = app.data.user + 'update_pid';
    if(pid != undefined){
      setTimeout(function(e){
        var aid = wx.getStorageSync('uid');
        wx.request({
          url: update_pid,
          data: {
            uid:aid,
            pid:pid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success (res) {
            console.log(res.data);
          }
        })
      },1000);
    }
    wx.request({
      url: get_rmb_bili,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        app.data.look_wan = res.data.look_wan;
        app.data.area = res.data.area;
        app.data.price_score = res.data.price_score;
      }
    })
  },
  deltap:function(e){
    var that = this;
    var cun_goods = that.data.cun_goods;
    var index = e.currentTarget.dataset.index;
    cun_goods.splice(index,1);
    app.data.cun_goods = cun_goods;
    that.setData({
      cun_goods:cun_goods
    })
  },
  chooseimage1:function(e){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        load(that,res.tempFilePaths,1);
        that.setData({
          tempFilePaths1: res.tempFilePaths
        })
      }
    })
  },
  chooseimage2:function(e){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        load(that,res.tempFilePaths,2);
        that.setData({
          tempFilePaths2: res.tempFilePaths
        })
      }
    })
  },
  chooseimage3:function(e){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        load(that,res.tempFilePaths,3);
        that.setData({
          tempFilePaths3: res.tempFilePaths
        })
      }
    })
  },
  uploadWord:function(e){
    var that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success (res) {
        console.log(res);
        var tempFiles = [];
        var path = res.tempFiles[0].path;
        tempFiles.push(path);
        load(that,tempFiles,4);
        that.setData({
          tempFilePaths4:'../../image/word.png'
        })
        // const tempFilePaths = res.tempFiles;
      }
    })
  },
  goodstap:function(e){
    wx.navigateTo({
      url: '/pages/i_goods/i_goods',
    })
  },
  yintap:function(e){
    wx.navigateTo({
      url: '/pages/i_yin/i_yin',
    })
  },
  contap:function(e){
    wx.navigateTo({
      url: '/pages/i_con/i_con',
    })
  },
  submit:function(e){
    var that = this;
    var aid = wx.getStorageSync('uid');
    if(flag == 1){
      flag = 0;
      var cun_goods = that.data.cun_goods;
      var goods_ids = '';
      if(cun_goods.length == 0){
        wx.showModal({
          title: '提示',
          content: '请选择产品',
          showCancel: false
        })
        flag = 1;
        return false;
      }
      for(var i=0;i<cun_goods.length;i++){
        goods_ids+=cun_goods[i].id+',';
      }
      goods_ids = goods_ids.substring(0,goods_ids.length-1);
      var content = that.data.content;
      var video = that.data.video;
      var photo1 = that.data.photo1;//图片
      var photo2 = that.data.photo2;
      var photo3 = that.data.photo3;
      var photo4 = that.data.photo4;//文件
      var images = '';
      if(photo1 != ''){
        images+=photo1+',';
      }
      if(photo2 != ''){
        images+=photo2+',';
      }
      if(photo3 != ''){
        images+=photo3+',';
      }
      images = images.substring(0,images.length-1);
      var ltd_id = that.data.ltd_id;
      
      wx.request({
        url: add_ask_order,
        data: {
          uid:aid,
          goods_ids:goods_ids,
          voice:video,
          text:content,
          images:images,
          files:photo4,
          ltd_id:ltd_id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          console.log(res.data);
          if(res.data.code == 1){
            app.data.ltd_id = '';
            that.setData({
              fix:true,
              ltd_id:ltd_id
            })
            flag = 1;
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
            flag = 1;
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
    var that = this;
    var ltd_id = app.data.ltd_id;
    var content = app.data.content;
    var video = app.data.video;
    var cun_goods = app.data.cun_goods;
    var headurl = app.data.headurl;
    that.setData({
      cun_goods:cun_goods,
      content:content,
      video:video,
      ltd_id:ltd_id
    })
    if(headurl == null){
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res.code);
          wx.showLoading();
          wx.request({
            url: get_openid,
            data: {
              code: res.code,
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data);
              wx.hideLoading();
              var obj = res.data.openid;
              var aid = res.data.uid;
              wx.setStorageSync('user', obj);//存储openid 
              wx.setStorageSync('uid', aid);//存储uid
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
                  var info = res.data.user;
                  var mobile = info.mobile;
                  app.data.mobile = mobile;
                  app.data.headurl = info.headurl;
                  that.setData({
                    headurl:info.headurl,
                    mobile:mobile
                  })
                }
              })
            }
          });
        }
      })
    }
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

})