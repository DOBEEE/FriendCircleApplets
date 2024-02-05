// pages/index/index.js
const app = getApp();
const { get} = require('../../services/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo: {
    },
  },
  onLoad(options) {
    if (options.workid) {
      get({
        url: '/detail',
        data: {
          workid: options.workid,
        }
      }).then(({data}) => {
        this.setData({
          dataInfo:{...data, userInfo: {
            avatarUrl: data.header,
            nickName: data.nick,
            userid: data.userid
          },},
        });
      });
    } else {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.on('transferData', (data) => {
        console.log(111, data)
        this.setData({
          dataInfo: data || {}
        })
      });
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})