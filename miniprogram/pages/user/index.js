// pages/post/post.js
const { get } = require('../../services/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '--',
    avatarUrl: '',
    works:[],
    "praised": 100,
    "follow": 10,
    "fans": 20,
    "desc": "感恩",
    pageid: 1,
    pageNum: 10,
    userid: '',
  },
  getData(userid) {
    get({
      url: '/list',
        data: {
          userid: userid,
          key: 'works',
          pageid: this.data.pageid,
          pageNum: this.data.pageNum,
        }
    }).then(({data}) => {
      this.setData({
        works: data.works
      });
    });
  },
  loginhandle() {
    wx.navigateTo({
      url: '/pages/login/index',
    });
  },
  showImg(e) {
    let imgidx = e.target.dataset.imgidx;
    let imgArr = this.properties.cardInfo.postimages
    wx.previewImage({
      current: imgArr[imgidx], // 当前显示图片的http链接
      urls: imgArr // 需要预览的图片http链接列表
    })
  },
  goDetail(e) {
    const data = e.currentTarget.dataset.iteminfo
    wx.navigateTo({
      url: '/pages/detail/index',
      success: (res) => {
        res.eventChannel.emit('transferData', {
          ...data,
          userInfo: {
            avatarUrl: this.data.avatarUrl,
            nickName: this.data.nickName,
            userid: this.data.userid
          },
          location: `Sample Location 2`,
          isLike: true,
          isCollect: false,
        });
      }
    });
    // return false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    get({
      url: '/userinfo',
      data: {
        userid: options.userid,
      }
    }).then(({data}) => {
      this.setData({
        "praised": data.praised,
        "follow": data.follow,
        "fans": data.fans,
        "desc": data.desc,
        nickName: data.nick,
        avatarUrl: data.header,
      });
    });
    this.setData({
      "userid": options.userid,
    });
    this.getData(options.userid);
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

  }
})