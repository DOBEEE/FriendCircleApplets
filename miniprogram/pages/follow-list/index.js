// pages/index/index.js
const config = require('../../core/config')
const { get} = require('../../services/index')
const {followtypeMap} = require('config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    data: [],
    followtypeMap
  },
  onLoad(options) {
      if (!options.type) return;
      get({
        url: '/list',
        data: {
          key: options.type,
        }
      }).then((res) => {
        this.setData({
          type: options.type,
          data: res.data[options.type]
        });
      });
  },
  goUserDetail(e) {
    const userid = e.currentTarget.dataset.userid
    wx.navigateTo({
      url: '/pages/user/index?userid=' + userid,
    });
    // return false
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