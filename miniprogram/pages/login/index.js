// pages/index/index.js
const { post} = require('../../services/index')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: '',
    pwd: '',
  },
  login() {
    if (!this.data.user) {
      wx.showToast({
        title: '账号必填',
        icon: 'error',
        duration: 1500,
        mask: false,
      });
      return;
    }
    if (!this.data.pwd) {
      wx.showToast({
        title: '密码必填',
        icon: 'error',
        duration: 1500,
        mask: false,
      });
      return;
    }
    post({
      url: '/bind', // 你的后端 API 地址
      data: {
        user: this.data.user,
        pwd: this.data.pwd // 将 code 发送到服务器
      },
      success: ({data}) => {
        wx.showToast({
          title: 'IR Chat账号绑定成功',
          icon: 'success',
          duration: 1500,
          mask: false,
        });
        wx.navigateBack({
          delta: 1  // 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
        });
      },
      fail: function(error) {
        console.error(error);
      }
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
  // onShow: function () {
  //   /**
  //    * 请求朋友圈信息
  //    */
  //   this.setData({
  //     postList:[]
  //   },()=>{
  //     this.reqPostData()
  //   })
   
  // },

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
    this.setData({
      postList: []
    }, () => {
      this.reqPostData();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    /**
     * 请求朋友圈信息
     */
    this.reqPostData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})