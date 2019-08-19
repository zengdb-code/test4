//index.js
//获取应用实例
const app = getApp()

//登陆
function wxLogin(){
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        wx.getUserInfo({
          success: function (res) {
            getUserInfoByServer(res.encryptedData, res.iv)
          }
        })
      }else{
        //console.log("5555555555")
      }
    }
  })
}

//获取用户信息
function getUserInfoByServer(encryptedData, iv){
  wx.login({
    success: res => {
      if (res.code) {
        wx.request({
          url: app.globalData.apiUrl + 'WeChatCheck/GetUserInfo',
          data: {
            code: res.code,
            encryptedData: encryptedData,
            iv: iv
          },
          method: 'GET',
          success: function (res) {
            console.log(res)
            if (res.data.Status == 0) {
              app.globalData.userInfo = res.data.Data;
              var unid = res.data.Data.unionId;
              //wx.setStorageSync('unionId', unid)
            }
          }
        })
      }
    }
  })
}

//商品统计
function productSta(unid,pid,ty){
  wx.request({
    url: app.globalData.apiUrl + 'Product/ProductSta',
    data: {
      unid: unid,
      pid: pid,
      type: ty
    },
    method: 'POST',
    success: function (res) { }
  })
}

module.exports = {
  wxLogin: wxLogin,
  getUserInfoByServer: getUserInfoByServer,
  productSta: productSta
}