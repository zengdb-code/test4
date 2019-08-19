// pages/myorder/myorder.js
//获取应用实例
const app = getApp()
const common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    orderId: "",
    pid: 0 ,
    commission:0,
    hideModal:true,
    num:0,
    typeId:0,
    price:0,
    productNum: 1,
    unid:'',
    tounid:'',
    openType:"getUserInfo",
    isShare:null,
    unit:0,
    swiperH:"",
    scroll:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "商品详情" //this.data.title//页面标题为路由参数
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          swiperH: res.windowHeight+"px"
        })
      }
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    if(!app.globalData.userInfo){
      common.wxLogin()
    }
    this.data.pid = options.pid;
    //this.data.unid = options.unid;
    this.data.tounid = options.tounid
    this.getProductDetails()
    common.productSta(options.tounid, options.pid,0)
    if(app.globalData.userInfo){
      this.setData({
        openType: "share",
        isShare: null,
        unit: app.globalData.unit
      })
    }
  },
  getProductDetails: function () {
    var _this = this
    wx.request({
      url: app.globalData.apiUrl + 'Product/GetProductDetails',
      data: {
        pid: _this.data.pid,
      },
      method: 'GET',
      success: function (res) {
        _this.setData({ productDetails: res.data, amount: res.data.Data.Price / app.globalData.unit})
        _this.data.commission = res.data.Data.Commission
        _this.data.typeId = res.data.Data.TypeId
        _this.data.price = res.data.Data.Price
      }
    })
  },
  onBuyNow: function (e) {
    var that = this;
    that.setData({ isShow: false })
    if (e.detail.errMsg == "getUserInfo:fail auth deny"){return}
    //console.log(app.globalData.userInfo)
    if(!app.globalData.userInfo){
      common.getUserInfoByServer(e.detail.encryptedData, e.detail.iv)
    }
    if (app.globalData.userInfo) {
      //获取用户收件信息 
      this.getUserCollectAddressInfo()
    }
    that.setData({
      hideModal: false
    })

    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    this.fadeIn();
    // setTimeout(function () {
    //   that.fadeIn();//调用显示动画
    // }, 200)
  },

  // 隐藏遮罩层
  hideModal: function () {
    this.fadeDown()
  },
  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(500).step()
    this.setData({
      animationData: this.animation.export(),
    })
    setTimeout(()=>{
      this.setData({
        hideModal: true
      })
    },300)
  },
  getUserCollectAddressInfo:function(){
    var _this = this
    wx.request({
      url: app.globalData.apiUrl + 'Product/GetUserCollectAddressInfo',
      data: {
        unid: app.globalData.userInfo.unionId
      },
      method: 'GET',
      success: function (res) {
        _this.setData({ collectAddressInfo: res.data })
      }
    })
  },
  //提交订单
  onPlaceOrder:function(e){
    var _this = this
    var number = e.detail.value.number
    var addres = e.detail.value.address
    var name = e.detail.value.name
    var phone = e.detail.value.phone
    if (number<=0){
      wx.showToast({
        title: "购买数量必须大于0",
        icon: 'none',
        duration: 2000
      })
      return
    }  
    if (!addres || !name || !phone){
      wx.showToast({
        title: "收件信息不完整",
        icon: 'none',
        duration: 2000
      })
      return
    } 
    var totalAmount = _this.data.price * number;
    wx.request({
      url: app.globalData.apiUrl + 'Order/PlaceOrder',
      data: {
        unid: app.globalData.userInfo.unionId,
        totalAmount: totalAmount,
        oid: app.globalData.userInfo.openId,
        address: addres,
        addressee: name,
        phone: phone,
        shareId:_this.data.tounid,
        data: [{ pid: _this.data.pid, type: _this.data.typeId, price: _this.data.price, num: number}]
      },
      method: 'POST',
      success: function (res) {
        if (res.data.Status == 0){
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 2000//持续的时间
          })
          wx.navigateTo({
            url: '../confirm-order/confirm-order?orderId=' + res.data.Data.OrderId + "&oid=" + app.globalData.userInfo.openId + "&unid=" + app.globalData.userInfo.unionId + "&title=确认订单&totalAmount=" + totalAmount,
            })
        }else{
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 2000//持续的时间
          })
        }
      }
    })
  },
  //数量减去
  onSubtract:function(){
    if (this.data.productNum > 1 )
        this.setData({ productNum: this.data.productNum -= 1 })
  },
  //数量累加
  onAddition: function () {
    var num = this.data.productNum;
    if (num < 100)
      this.setData({ productNum: num += 1})
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    console.log(ops)
    if (ops.from === 'button'){
      common.productSta(app.globalData.userInfo.unionId, this.data.pid, 1)
      return {
        title: '买了这个，感觉你也喜欢',//分享内容
        path: '/pages/goods-detail/goods-detail?pid=' + this.data.pid + "&tounid=" + app.globalData.userInfo.unionId, //分享地址
        success: function (res) {
          // 转发成功
          //console.log("转发成功:" + JSON.stringify(res))
          //console.log(res)
          // if (res.errMsg == 'shareAppMessage:ok') {//判断分享是否成功
          //   if (res.shareTickets == undefined) {//判断分享结果是否有群信息
          //     //分享到好友操作...
          //   }else{
          //     console.log("res")
          //   } 
          // }
        },
        fail: function (res) {
          // 转发失败
        },
        complete: function (res) {
          // 不管成功失败都会执行
        }
      }
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    common.getUserInfoByServer(e.detail.encryptedData, e.detail.iv)
    if (e.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        openType: "share",
        isShare: null
      })
    }
  }, 
  onShow: function (options) {
    // let self = this;
    // let show = app.globalData.isShow;
    // if (show) {
    //   this.setData({ isShow: true})
    // }
  }, touch:function(e){
    return true;
  }
})