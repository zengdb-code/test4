//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: resCode => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //console.log("code="+resCode.code)
        var app = getApp()
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  //console.log("code=" + resCode.code + ", encryptedData="+res.encryptedData+", iv="+res.iv);
                  //console.log(res);
                  // 可以将 res 发送给后台解码出 unionId
                  wx.request({
                    url: app.globalData.apiUrl + 'WeChatCheck/GetUserInfo',
                    data: {
                      code: resCode.code,
                      encryptedData: res.encryptedData,
                      iv: res.iv
                    },
                    method: 'GET',
                    success: function (res) {
                      if (res.data.Status == 0) {
                        app.globalData.userInfo = res.data.Data
                        var unid = res.data.Data.unionId;
                        //wx.setStorageSync('unionId', unid)
                        //console.log(wx.getStorageSync('unionId'))
                        //console.log("app.globalData.userInfo")
                        // wx.reLaunch	({
                        //   url: '../index/index'
                        // })
                      }
                    }
                  })
                  //this.globalData.userInfo = res.userInfo
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                   if (this.userInfoReadyCallback) {
                      this.userInfoReadyCallback(res)
                   }
                }
              })
            }else{
              //未授权
              console.log("未授权")
            }
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    apiUrl: "https://ht.pkt-data.com/",
    unit:100, //单位 ：分
    isShow:true
  }
})