// pages/share/share.js
const app = getApp()
const common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    acceptAuthorize:false,
    isShowAhturoizeWarning: true,
    //canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
	//"http://dm.wwmojing.com/upload/product/06eab6c418d344febcc4100450f1411c.jpg"
    //this.setData({ produntImgUrl: options.produntImgUrl})
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
  getUserInfo() {//同意授权，获取用户信息，encryptedData是加密字符串，里面包含unionid和openid信息
    wx.getUserInfo({
      withCredentials: true,//此处设为true，才会返回encryptedData等敏感信息
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        console.log(res)
        app.globalData.userInfo = res.userInfo;
        app.globalData.encryptedData = res.encryptedData;
        app.globalData.iv = res.iv;
        common.getUserInfoByServer(res.encryptedData, res.iv)
        
      }
    })
  },
  getAuthorize(e) {//弹出授权窗函数
  //console.log(e)
    if (e.detail.errMsg=="getUserInfo:ok"){
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            console.log("4444444444")
            this.getUserInfo();
            wx.setStorageSync("show", 2)
            this.setData({
              isShowAhturoizeWarning: false
            })
            wx.reLaunch	({
              url: '../index/index',
            })
          
          } else {
            // this.setData({
            //   isShowAhturoizeWarning: true
            // })
          }
        }
      })
    }else{
      this.setData({
        isShowAhturoizeWarning: true
      })
      wx.setStorageSync("show", 1)
      console.log("777777777777777")
    }
    // if (this.data.acceptAuthorize) {//判断是否已经授权过
      
    // } else {//如果已经授权过直接登录
    //   //this.saveUserInfo()
    //   console.log("777777777777777")
    // }
  },
  cancelAuthroize(){
    this.setData({
      isShowAhturoizeWarning: false,
      acceptAuthorize: false
    });
    app.globalData.unionid = null;
  },
})