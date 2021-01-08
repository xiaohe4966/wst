// pages/i_yin/i_yin.js
var app = getApp()
var upload;

const recorderManager = wx.getRecorderManager()
let innerAudioContext = wx.createInnerAudioContext(); //创建音频实例
var load = function(that,tempFilePaths,type){
  wx.uploadFile({
    url: upload,
    filePath: tempFilePaths[0],
    name: 'file',
    success(res) {
      var js=JSON.parse(res.data);
      console.log(js);
      var url = js.data.url;
      app.data.video = url;
      that.setData({
        url:js.data.fullurl
      })
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight:0,
    select:false,
    num:10,
    setInter:'',
    url:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    upload = app.data.common_url + 'upload';
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    }) 
  },
  botap:function(e){
    var that = this;
    var url = that.data.url;
    innerAudioContext.src = url; 
    innerAudioContext.play();
  },
  yintap:function(e){
    var that = this;
    var num = Number(that.data.num);
    app.data.video = '';
    that.setData({
      select:true,
      url:''
    })


    // wx.startRecord({
    //   success (res) {
    //     const tempFilePath = res.tempFilePath
    //     console.log(tempFilePath);
    //     that.setData({
    //       url:tempFilePath
    //     })
    //     var temp = [];
    //     temp.push(tempFilePath);
    //     load(that,temp,1);
    //   }
    // })

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


    that.data.setInter = setInterval(function(e){
      num--;
      if(num == 0){
        that.endSetInter();
      }else{
        that.setData({
          num:num
        })
      }
    },1000)
  },
  stoptap:function(e){
    var that = this;
    clearInterval(that.data.setInter);
    // wx.stopRecord();
    recorderManager.stop()//结束录音
    recorderManager.onStop((res) => {
      if(res.duration<2000){
        wx.showToast({
          title: '录音时间太短，请重新录制',
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
    that.setData({
      num:10,
      select:false
    })
  },
  endSetInter:function(e){
    var that = this;
      clearInterval(that.data.setInter);
      wx.stopRecord();
      that.setData({
        num:10,
        select:false
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