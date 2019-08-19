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
    unid: "",
    oid:"",
    totalAmount:0,
    unit:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    //
    this.setData({
      title: options.title//options为页面路由过程中传递的参数
    })
    wx.setNavigationBarTitle({
      title: this.data.title//页面标题为路由参数
    })
    this.data.orderId = options.orderId
    this.data.unid = options.unid
    this.data.oid = options.oid
    this.data.totalAmount = options.totalAmount
    this.getOrderDetails()
    this.setData({
      unit: app.globalData.unit
    })
  },
  onPay: function () {
    var _this = this;
    wx.request({
      url: app.globalData.apiUrl + 'Pay/MeterRecharge',
      data: {
        orderId: _this.data.orderId,
        totalAmount: _this.data.totalAmount,
        oid: _this.data.oid,
        unid: _this.data.unid
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.Status == 0) {
          //_this.data.timeStamp = res.data.Data.TimeStamp
          wx.requestPayment({
            timeStamp: res.data.Data.TimeStamp,
            nonceStr: res.data.Data.NonceStr,
            package: res.data.Data.PackageValue,
            signType: res.data.Data.SignType,
            paySign: res.data.Data.PaySign,
            success: function (res) {
              console.log(_this.data.totalAmount)
              console.log(res);
              if (res.errMsg == "requestPayment:ok"){ //支付成功
                wx.reLaunch({
                  url: '../paymentsuc/paymentsuc?suc=1&orderNo=' + _this.data.orderId + "&amount=" + _this.data.totalAmount + "&unid=" + _this.data.unid
                })
              }
            },
            fail: function (res) {
              if (res.errMsg == "requestPayment:fail cancel"){return}
              wx.reLaunch({
                url: '../paymentsuc/paymentsuc?suc=0&orderNo=' + _this.data.orderId + "&amount=" + _this.data.totalAmount + "&unid=" + _this.data.unid 
              })
            },
            complete: function (res) {
              //console.log(res)
              if (res.errMsg == "requestPayment:ok") { //成功

              } 
            }
          })
        }
      }
    })
  },
  getOrderDetails:function(){
    var _this = this
     wx.request({
       url: app.globalData.apiUrl + 'Order/GetOrderDetails',
       data: {
         unId: _this.data.unid, //app.globalData.userInfo.unionId,
         orderId: _this.data.orderId
       },
       method: 'GET',
       success: function (res) {
         //console.log(res)
         _this.setData({ orderInfo: res.data, totalAmount: res.data.Data.TotalAmount / app.globalData.unit, actualAmount: res.data.Data.ActualAmount / app.globalData.unit})
       }
     })
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (ops) {},
  onShow() {
    app.globalData.isShow = true
  },
  onHide() {
    app.globalData.isShow = false
  },
})