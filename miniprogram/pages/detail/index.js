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
  onShareAppMessage: function(options) {
    // 设置分享的内容
    return {
      title: 'IUShow - AI 助力孩子学习和创作分享',
      path: '/pages/detail/index?workid='+options.target.dataset.id, // 可以携带页面参数
      // imageUrl: 'https://example.com/image.png' // 分享图标（可选）
    };
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
})