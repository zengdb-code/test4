//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'), indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    swiperH:"",
    nowIdx:0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.getProductList()
          this.getIndexBanner()
        }else{
          wx.reLaunch({
            url: '../homepage/homepage',
          })
        }
      }
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.getUserInfoByServer(e.detail.encryptedData,e.detail.iv)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getProductList(){
    var _this = this;
    wx.request({
      url: app.globalData.apiUrl + 'Product/GetProductAllList',
      data: {
      },
      method: 'GET',
      success: function (res) {
        _this.setData({ productList: res })
      }
    })
  },
  onProductTap: function (event) {
    var productid = event.currentTarget.dataset.productid; 
    //console.log(app.globalData.userInfo)
    wx.navigateTo({
      url: '../goods-detail/goods-detail?pid=' + productid + "&tounid=" + app.globalData.userInfo.unionId
    })
  },
  getIndexBanner(){
    var _this=this;
    wx.request({
      url: app.globalData.apiUrl + 'Product/GetIndexBanner',
      data: {
      },
      method: 'GET',
      success: function (res) {
        _this.setData({
          autoplay: res.data.Data.Scroll.IsRolling
        })
        _this.setData({ bannerList: res.data.Data.Banners})
      }
    })
  },
  wxLogin:function(){
    var _this = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
           wx.getUserInfo({
             success: function (res) {
               _this.getUserInfoByServer(res.encryptedData,res.iv)
             }
           })
        }
      }
    })
  },
  getUserInfoByServer: function (encryptedData,iv){
    wx.login({
      success: res => {
        if(res.code){
          wx.request({
            url: app.globalData.apiUrl + 'WeChatCheck/GetUserInfo',
            data: {
                    code: res.code,
                    encryptedData: encryptedData,
                    iv: iv
                  },
            method: 'GET',
            success: function (res) {
                 if (res.data.Status == 0) {
                     app.globalData.userInfo = res.data.Data;
                     //wx.setStorageSync('userInfo', app.globalData.userInfo)
                     //console.log("app.globalData.userInfo")
                  }
            }
          })
        }
      }
    })
  } , 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) { },
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onBannerTap: function (event){
    var link = event.currentTarget.dataset.link; 
    if(link){
      wx.navigateTo({
        url: link, //'../paymentsuc/paymentsuc',
      })
    }
   
  }, transi:function(e){
    // console.log(e)
  },
  intervalChange(e) {
    this.setData({ nowIdx: e.detail.current })
  },
  getHeight:function(e){
    var width=e.detail.width;
    var height=e.detail.height;
    wx.getSystemInfo({
      success: (res)=>{
        var windowWidth = res.windowWidth-96;
        this.setData({
          swiperH: (windowWidth/(width/height)) + "px"
        })
      }
    })

  }
})
