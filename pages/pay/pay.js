//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
  },
  onLoad: function () {
    console.log(app.globalData.userInfo)
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
     //console.log(app.globalData.userInfo.openId)
  },
  onPayment:function(){
    //console.log(app.globalData.userInfo)
    wx.request({
      url:app.globalData.apiUrl+'Pay/MeterRecharge',
      data: {
        oid: app.globalData.userInfo.openId,
        orderId:"201812190001",
        totalAmount:1
      },
      method: 'Post',
      success: function (res) {
        console.log(res)
        // wx.requestPayment({
        //   timeStamp: '',
        //   nonceStr: '',
        //   package: '',
        //   signType: '',
        //   paySign: '',
        // })
      }
    })
  }
})