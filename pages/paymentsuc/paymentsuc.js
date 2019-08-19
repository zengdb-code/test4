// pages/paymentsuc/paymentsuc.js
const util = require('../../utils/util.js')
const app= getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    orderNo:'',
    unid:'',
    isJump:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.suc == 1) {
      var title = "支付成功"
    } else {
      var title = "支付失败"
    }
    // var time =options.timestamp
    // var n = time * 1000;
    // var date = new Date(n);
    this.setData({
      title: title,
      amount: options.amount,  /// app.globalData.unit,
      orderNo:options.orderNo,
      date: util.formatTime(new Date()),
      unid: options.unid
    })
    this.data.orderNo = options.orderNo
    this.data.unid = options.unid
    wx.setNavigationBarTitle({
      title: this.data.title//页面标题为路由参数
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

  },
  setPlain:function(){
    this.setData({ isJump:true })
    this.setData({ viewUrl: 'https://www.wwmojing.com/customer/index.html#/OrderDetail?OrderId=' + this.data.orderNo +'&Unid='+this.data.unid})
  }

})