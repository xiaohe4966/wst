// pages/u_wechat/u_wechat.js
var app = getApp()
var get_my_user_chat_record;var get_user;var page = 1;var pay_ask_answer;var look_ask_order;var upload;var user_apply_price;var agree_score_end;var user_get_ask_order_data;var look_ask_order;


var loadRen = function(that){
  var aid = wx.getStorageSync('uid');
  var reuid = that.data.reuid;
  var stores = that.data.stores;
  var uid = '';
  if(stores == 0){
    uid = aid;
  }else{
    uid = reuid;
  }
  wx.request({
    url: user_get_ask_order_data,
    data: {
      uid:uid,
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
        that.setData({
          ren_price:info.money,
          ren_score:info.score,
          chat_status:info.chat_status
        })
      }
    }
  })
}

var loadSj = function(that){
  var aid = wx.getStorageSync('uid');
  var reuid = that.data.reuid;
  var stores = that.data.stores;
  var uid = '';
  if(stores == 0){
    uid = reuid;
  }else{
    uid = aid;
  }
  wx.request({
    url: look_ask_order,
    data: {
      uid:uid,
      ask_id:that.data.askid
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success (res) {
      console.log(res.data);
      if(res.data.code == 1){
        var info = res.data.data;
        that.setData({
          sj_price:info.money,
          sj_score:info.score,
          score_status:info.score_status
        })
        console.log(that.data.score_status);
      }else{
        var info = res.data.data;
        that.setData({
          score_status:info.score_status
        })
        console.log(that.data.score_status);
      }
    }
  })
};

const recorderManager = wx.getRecorderManager()
let innerAudioContext = wx.createInnerAudioContext(); //创建音频实例
let socketOpen = false;
let socketMsgQueue = []
var wsUrl = 'wss://wssct.midukj.com:8080/ws'; // 修改为你的地址
var login = function(that){
    var message = 'login';
      // 发送
      var data = {
        action: 'login',
        uid: that.data.uid,
        re_uid: that.data.reuid,
        ask_id: that.data.askid,
        type: 1,
        message: message
      };
      wx.connectSocket({ url: wsUrl });
    wx.onSocketOpen(function(res) {
      console.log(res);
      socketOpen = true;
      var v = JSON.stringify(data);
      sendSocketMessage(v);
      socketMsgQueue = []
    })
    wx.onSocketMessage(function(res){
      var list = that.data.list;
      var con = decodeUnicode(res.data);
      var data = JSON.parse(con);
      console.log(data);
      var json = {
        content:data.msg,date:data.date,send_uid:data.send_uid,re_uid:data.reuid,type:data.type
      };
      list.push(json);
      loadRen(that);
      loadSj(that);
      that.setData({
        list:list,
        content:''
      })
    })

    function sendSocketMessage(msg) {
      if (socketOpen) {
        wx.sendSocketMessage({
          data:msg
        })
      } else {
        socketMsgQueue.push(msg);
        console.log(msg);
      }
    }
}

// 解码  
function decodeUnicode(str) {  
  str = str.replace(/\\/g, "%");
  //转换中文
  str = unescape(str);
    //将其他受影响的转换回原来
  str = str.replace(/%/g, "\\");
    //对网址的链接进行处理
  str = str.replace(/\\/g, "");
  return str;
}

var load = function(that,tempFilePaths,type){
  wx.uploadFile({
    url: upload,
    filePath: tempFilePaths[0],
    name: 'file',
    success(res) {
      var js=JSON.parse(res.data);
      console.log(js);
      var url = js.data.fullurl;
      
      var data = {
        action: 'send_user',
        uid: that.data.uid,
        re_uid: that.data.reuid,
        ask_id: that.data.askid,
        type: type,
        message: url
      };
      wx.connectSocket({url: wsUrl});
      var v = JSON.stringify(data);
      sendSocketMessage(v);
      socketMsgQueue = [];
      wx.onSocketMessage(function(res){
        var list = that.data.list;
        var con = decodeUnicode(res.data);
        var data = JSON.parse(con);
        console.log(data);
        var json = {
          content:data.msg,date:data.date,send_uid:data.send_uid,re_uid:data.re_uid,type:data.type
        };
        list.push(json);
        that.setData({
          list:list,
          add:false,
          content:''
        })
        wx.createSelectorQuery().select('#scrollpage').boundingClientRect(function(rect){
          console.log(rect.height);
          that.setData({
            scrollHeight:rect.height
          })
          wx.pageScrollTo({
            scrollTop: rect.height
          });
        }).exec()
      })
      function sendSocketMessage(msg) {
        if (socketOpen) {
          wx.sendSocketMessage({
            data:msg
          })
        } else {
          socketMsgQueue.push(msg);
        }
      }
    }
  })
}


var loadMore = function(that){
  that.setData({
    hidden: false,
    stopdowning: true
  });
  wx.request({
    url: get_my_user_chat_record,
    data: {
      page: page,
      uid: that.data.uid,
      ask_id: that.data.askid,
      re_uid: that.data.reuid
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success (res) {
      console.log(res.data);
      var all = res.data.all;
      var list = that.data.list;
      if(all.length != 0){
        for(var i=0;i<all.length;i++){
          list.unshift(all[i]);
        }
        loadRen(that);
        loadSj(that);
        that.setData({
          list:list
        })
        if(that.data.gun){
          wx.createSelectorQuery().select('#scrollpage').boundingClientRect(function(rect){
            console.log(rect.height);
            that.setData({
              scrollHeight:rect.height
            })
            wx.pageScrollTo({
              scrollTop: rect.height
            });
          }).exec()
        }
      }else{
        that.setData({
          scrollHeight:that.data.scrollHeight
        })
      }
      page++;
      if(all.length == 0){
        that.setData({
          hidden: true,
          stopdowning: true
        });
      }else{
        that.setData({
          hidden: false,
          stopdowning: false
        });
      }
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],//聊天记录
    scrollHeight: 0,
    stopdowning: false,
    hidden: false,
    content:'',
    uid:'',//自己的ID
    reuid:'',//对方的ID
    headimgS:'',//接受人的头像
    nicknameS:'',//接受人的昵称
    headurl:'',//自己的头像
    nickname:'',//自己的昵称
    gun:true,
    fix:false,
    look_wan:'',
    askid:'',
    ltd_id:'',
    stores:0,//是否为商家
    ask:false,
    add:false,
    is_clock:false,
    fix2:false,
    jf:'??',
    price:'',
    ren_price:'',//用户发布确认金额
    ren_score:'',//用户发布确认金额
    sj_price:'',//商家确认金额
    sj_score:'',
    chat_status:'1',//判断是否为直接聊天
    score_status:0,//是否确认价格
  },
  price:function(e){
    var that = this;
    var price_score = app.data.price_score;
    var price = e.detail.value;
    var jf = (Number(price)/Number(price_score)).toFixed(0);
    that.setData({
      price:e.detail.value,
      jf:jf
    })
  },
  xjtap:function(e){
    var that = this;
    that.setData({
      price:'',
      add:false,
      jf:'??',
      fix2:true
    })
  },
  hidetap:function(e){
    this.setData({
      fix2:false
    })
  },
  addxztap:function(e){
    this.setData({
      add:!this.data.add
    })
  },
  askxztap:function(e){
    this.setData({
      ask:!this.data.ask
    })
  },
  onPageScroll: function(e) {
    var that = this;
    console.log(that.data.stopdowning);
    var scrollTop = e.scrollTop;
    if(scrollTop == 0){
      that.setData({
        gun:false
      })
      if (!that.data.stopdowning) {
        loadMore(that);
      } else {
        console.log('gg');
        return;
      }
    }else{
      that.setData({
        gun:true
      })
    }
    // 页面滚动时执行
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var aid = wx.getStorageSync('uid');
    var stores = options.stores;
    var look_wan = app.data.look_wan;
    var askid = options.askid;
    if(askid == undefined){
      askid = '';
    }
    var reuid = options.id;
    var headimgS = options.headimgS;
    var nicknameS = options.nicknameS;
    var ltd_id = options.ltd_id;
    if(ltd_id == undefined){
      ltd_id = '';
    }
    console.log(askid);
    that.setData({
      stores:stores,
      uid:aid,
      reuid:reuid,
      headimgS:headimgS,
      nicknameS:nicknameS,
      look_wan:look_wan,
      askid:askid,
      ltd_id:ltd_id
    })
    login(that);
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    }) 
    look_ask_order = app.data.ltd+'look_ask_order';
    pay_ask_answer = app.data.ltd+'pay_ask_answer';
    get_my_user_chat_record = app.data.chat + 'get_my_user_chat_record';
    get_user = app.data.shop_url+'get_user';
    upload = app.data.common_url + 'upload';
    user_apply_price = app.data.ask_order+'user_apply_price';
    agree_score_end = app.data.ask_answer+'agree_score_end';
    user_get_ask_order_data = app.data.ask_order+'user_get_ask_order_data';
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
        var headurl = info.headurl;
        var nickname = info.nickname;
        that.setData({
          headurl:headurl,
          nickname:nickname
        })
      }
    })
    page = 1;
    loadMore(that);
    wx.request({
      url: look_ask_order,
      data: {
        uid:aid,
        ask_id:askid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        if(res.data.code == 1){
          var chat_status = res.data.data.chat_status;
          that.setData({
            chat_status:chat_status
          })
        }else{
          that.setData({
            fix:true
          })
        }
      }
    })
  },
  asktap:function(e){
    var that = this;
    var askid = that.data.askid;
    var aid = '';
    var stores = that.data.stores;
    if(stores == 0){
      aid = that.data.uid;
    }else{
      aid = that.data.reuid;
    }
    wx.navigateTo({
      url: '/pages/u_xjd/u_xjd?id='+askid+'&aid='+aid,
    })
  },
  content:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  send:function(e){
    var that = this;
    var list = that.data.list;
    var content = e.detail.value;
    if(content == ''){
      wx.showModal({
        title: '提示',
        content: '请输入内容',
        showCancel: false
      })
    }else{
      var message =content;
      if(message === ''){return;}
      var data = {
        action:'send_user',
        uid: that.data.uid,
        re_uid: that.data.reuid,
        ask_id: that.data.askid,
        type: 1,
        message: message,
      };
      wx.connectSocket({url: wsUrl});
      var v = JSON.stringify(data);
      sendSocketMessage(v);
      socketMsgQueue = [];
      wx.onSocketMessage(function(res){
        var con = decodeUnicode(res.data);
        var data = JSON.parse(con);
        console.log(data);
        var json = {
          content:data.msg,date:data.date,send_uid:data.send_uid,re_uid:data.reuid,type:'1'
        };
        list.push(json);
        loadRen(that);
        loadSj(that);
        that.setData({
          list:list,
          content:''
        })
        wx.createSelectorQuery().select('#scrollpage').boundingClientRect(function(rect){
          console.log(rect.height);
          that.setData({
            scrollHeight: rect.height
          })
          wx.pageScrollTo({
              scrollTop: rect.height,
          });
        }).exec()
      })
      function sendSocketMessage(msg) {
        if (socketOpen) {
          wx.sendSocketMessage({
            data:msg
          })
        } else {
          socketMsgQueue.push(msg)
          console.log(msg);
        }
      }
    }
  },
  chooseimage1:function(e){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        load(that,res.tempFilePaths,11);
      }
    })
  },
  chooseimage2:function(e){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: function (res) {
        load(that,res.tempFilePaths,11);
      }
    })
  },
  chooseimage3:function(e){
    var that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success (res) {
        console.log(res);
        var tempFiles = [];
        var path = res.tempFiles[0].path;
        tempFiles.push(path);
        load(that,tempFiles,12);
      }
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
  previewImg: function (e) {
    var that = this;
    var src = e.currentTarget.dataset.src;
    var imgUrls = [];
    imgUrls.push(src);
    wx.previewImage({
      current: imgUrls[0],     //当前图片地址
      urls: imgUrls               //所有要预览的图片的地址集合 数组形式
    })
  },
  opentap:function(e){
    var that = this;
    var files = e.currentTarget.dataset.files;
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
  handleRecordStart:function(e){
    var that = this;
    this.setData({
      is_clock:true,//长按时应设置为true，为可发送状态
      startPoint: e.touches[0],//记录触摸点的坐标信息
    })
    //设置录音参数
    const options = {
      duration: 10000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'mp3'
    }
    //开始录音
    recorderManager.start(options);
  },
  handleRecordStop:function(e){
    recorderManager.stop()//结束录音
     //此时先判断是否需要发送录音
      if (this.data.is_clock == true) {
        var that = this
		//对停止录音进行监控
        recorderManager.onStop((res) => {
			//对录音时长进行判断，少于2s的不进行发送，并做出提示
			if(res.duration<2000){
        wx.showToast({
          title: '录音时间太短，请长按录音',
          icon: 'none',
          duration: 1000
        })
        }else{
          //进行语音发送
          const {
                tempFilePath
              } = res;
              var temp = [];
              temp.push(tempFilePath);
              console.log(tempFilePath);
              load(that,temp,10);
            }
        })
      }    
  },
  playtap:function(e){
    var that = this;
    var tempFilePath = e.currentTarget.dataset.yin;
    innerAudioContext.src = tempFilePath; 
    innerAudioContext.play();
  },
  clicktap:function(e){
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
                that.setData({
                  fix2:false
                })
                loadRen(that);
                var data = {
                          action:'send_user',
                          uid: that.data.uid,
                          re_uid: that.data.reuid,
                          ask_id: that.data.askid,
                          type: 4,
                          message:askid,
                        };
                        wx.connectSocket({url: wsUrl});
                        var v = JSON.stringify(data);
                        sendSocketMessage(v);
                        socketMsgQueue = [];
                        wx.onSocketMessage(function(res){
                          var list = that.data.list;
                          var con = decodeUnicode(res.data);
                          var data = JSON.parse(con);
                          console.log(data);
                          var json = {
                            content:data.msg,date:data.date,send_uid:data.send_uid,re_uid:data.reuid,type:data.type
                          };
                          list.push(json);
                          loadRen(that);
                          loadSj(that);
                          that.setData({
                            list:list,
                            content:''
                          })
                          wx.createSelectorQuery().select('#scrollpage').boundingClientRect(function(rect){
                            console.log(rect.height);
                            that.setData({
                              scrollHeight: rect.height
                            })
                            wx.pageScrollTo({
                                scrollTop: rect.height,
                            });
                          }).exec()
                        })
                        function sendSocketMessage(msg) {
                          if (socketOpen) {
                            wx.sendSocketMessage({
                              data:msg
                            })
                          } else {
                            socketMsgQueue.push(msg)
                            console.log(msg);
                          }
                        }
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
  submit:function(e){
    var that = this;
    var aid = wx.getStorageSync('uid');
    var price = e.currentTarget.dataset.price;
    var askid = that.data.askid;
    wx.showModal({
      title: '提示',
      content: '是否确认该金额？',
      showCancel: true,
      success:function(e){
        if(e.confirm){
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
                    loadSj(that);
                    var data = {
                              action:'send_user',
                              uid: that.data.uid,
                              re_uid: that.data.reuid,
                              ask_id: that.data.askid,
                              type: 5,
                              message:askid,
                            };
                            wx.connectSocket({url: wsUrl});
                            var v = JSON.stringify(data);
                            sendSocketMessage(v);
                            socketMsgQueue = [];
                            wx.onSocketMessage(function(res){
                              var list = that.data.list;
                              var con = decodeUnicode(res.data);
                              var data = JSON.parse(con);
                              console.log(data);
                              var json = {
                                content:data.msg,date:data.date,send_uid:data.send_uid,re_uid:data.reuid,type:data.type
                              };
                              list.push(json);
                              loadRen(that);
                              loadSj(that);
                              that.setData({
                                list:list,
                                content:''
                              })
                              wx.createSelectorQuery().select('#scrollpage').boundingClientRect(function(rect){
                                console.log(rect.height);
                                that.setData({
                                  scrollHeight: rect.height
                                })
                                wx.pageScrollTo({
                                    scrollTop: rect.height,
                                });
                              }).exec()
                            })
                            function sendSocketMessage(msg) {
                              if (socketOpen) {
                                wx.sendSocketMessage({
                                  data:msg
                                })
                              } else {
                                socketMsgQueue.push(msg)
                                console.log(msg);
                              }
                            }
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
      }
    })
    
  },  
  // bindUpLoad: function () {
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
  //   //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
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
    var that = this;
    wx.closeSocket();
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