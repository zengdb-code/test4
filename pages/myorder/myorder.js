//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    status: 0,
    unit:0
  },
  onLoad: function () {
    //console.log(app.globalData.userInfo)
    this.getOrderRecord()
    this.setData({
      unit:app.globalData.unit
    })
  },
  getOrderRecord: function () {
    //console.log(app.globalData.userInfo)
    var _this = this;
    wx.request({
      url: app.globalData.apiUrl + 'Order/GetOrderRecord',
      data: {
        unid: "o74Yd1IhrGE0MQLGbK7rTvHOkUa4", //app.globalData.userInfo.unionId,
        status: _this.data.status
      },
      method: 'Get',
      success: function (res) {
        _this.setData({ orderList: res.data, orderNum: res.data.Data.length})
      }
    })
  },
  getOrderStatusList:function(){
    var _this = this;
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) { }
})