//app.js
App({
  data: {
    shop_url: 'https://wssct.midukj.com/api/user/',
    index_url: 'https://wssct.midukj.com/api/index/',
    common_url: 'https://wssct.midukj.com/addons/aliossapiupload/index/',
    ask_order:'https://wssct.midukj.com/api/ask_order/',
    ltd:'https://wssct.midukj.com/api/ltd/',
    order_url: 'https://wssct.midukj.com/api/order/',
    score_url: 'https://wssct.midukj.com/api/score/',
    ask_answer: 'https://wssct.midukj.com/api/ask_answer/',
    send_user: 'https://wssct.midukj.com/api/send_user/',
    chat: 'https://wssct.midukj.com/api/chat/',
    share: 'https://wssct.midukj.com/api/share/',
    user: 'https://wssct.midukj.com/api/user/',
    score_goods: 'https://wssct.midukj.com/api/score_goods/',
    img_url:'https://wssct.midukj.com',
    img_src: 'https://shicaitong-upload.oss-cn-beijing.aliyuncs.com',
    wst_code:'https://wssct.midukj.com/assets/img/wst.jpg',
    headurl:null,//用户头像
    mobile:'',//电话
    cun_goods:[],//存放选择的产品
    content:'',//文字留言
    video:'',//语言留言
    look_wan:'',//查看聊天和订单需要多少金币
    ltd_id:'',//商家ID
    area:'',//地址前缀
    vip:'',//判断角色
    price_score:'',//计算积分的比例
  },
  onLaunch: function () {
    
  },
  globalData: {
    userInfo: null
  }
})