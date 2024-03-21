const { get, post } = require('../../services/index')
const config = require('../../core/config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    avatarUrl: '',
    currentTab: 'works',
    _usernick: '',
    showWithInput: false,
    works:{
      works: [],
      likes: [],
      collects: [],
      history: []
    },
    "praised": 100,
    "follow": 10,
    "fans": 20,
    "desc": "感恩",
    pageid: 1,
    pageNum: 10
  },
  getData() {
    get({
      url: '/list',
        data: {
          key: this.data.currentTab,
          pageid: this.data.pageid,
          pageNum: this.data.pageNum,
        }
    }).then((res) => {
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
      this.setData({
        works: {
          ...this.data.works,
          [this.data.currentTab]: res.data[this.data.currentTab]
        }
      });
    });
  },
  avatarHandle() {
    const self = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        wx.showLoading({
          title: '',
          mask: true,
        });
        wx.uploadFile({
          filePath: res.tempFiles[0].tempFilePath,
          name: 'file',
          url: config.serverHost + '/upload',
          header: {
            cookie: wx.getStorageSync('sessionid')
          },
          formData: {
            token: wx.getStorageSync('token') || null
          },
          fail() {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败',
              icon: 'error'
            });
          },
          success: (res) => {
            
            const data = JSON.parse(res.data);
            if (data.success) {
              post({
                url: '/setuser',
                  data: {
                    userinfo: {
                      header: data.url
                    },
                  }
              }).then((res) => {
                self.setData({
                  avatarUrl: data.url
                });
                wx.hideLoading();
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 1500,
                  mask: false,
                });
              });
            } else {
              wx.hideLoading();
              wx.showToast({
                title: data.message,
                icon: 'error'
              });
            }
          }
        })
        
      }
    })
  },
  userChange(e) {
    this.setData({
      _usernick: e.detail.value
    })
  },
  showDialog(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [key]: true, dialogKey: key });
  },

  closeDialog() {
    this.setData({ showWithInput: false });
  },
  nickNameHandle(e) {
    this.setData({ showWithInput: true });
  },
  confirmNickName(e) {
    post({
      url: '/setuser',
        data: {
          userinfo: {
            nick: this.data._usernick
          },
        }
    }).then((res) => {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1500,
        mask: false,
      });
      this.setData({
        nickName: this.data._usernick,
        showWithInput: false
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
  onTabsChange(event) {
    this.setData({
      currentTab: event.detail.value
    }, () => {
      this.getData();
    });
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
          },
        });
      }
    });
    // return false
  },
  goFollows(e) {
    wx.navigateTo({
      url: '/pages/follow-list/index?type=follows',
    });
    // return false
  },
  goFans(e) {
    wx.navigateTo({
      url: '/pages/follow-list/index?type=fans',
    });
    // return false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    get({
      url: '/userinfo',
    }).then(({data}) => {
      this.setData({
        "praised": data.praised,
        "follow": data.follow,
        "fans": data.fans,
        "desc": data.desc,
        isbind: data.isbind
      });
    });
  },
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo') || null
    if (userInfo != null) {
      this.setData({
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      })
    }
    get({
      url: '/userinfo',
    }).then(({data}) => {
      this.setData({
        "praised": data.praised,
        "follow": data.follow,
        "fans": data.fans,
        "desc": data.desc,
        isbind: data.isbind
      });
    });
    this.getData();
  },
/**
   * 获取用户信息
   * @param {} e 
   */
    getUserProfile(e) {
      get({
        url: '/userinfo',
      }).then(({data}) => {
        wx.setStorageSync('userInfo', {
          nickName: data.nick,
          avatarUrl: data.header
        })
      })
  // wx.getUserProfile({
  //   desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //   success: (res) => {
  //     this.setData({
  //       nickName: res.userInfo.nickName,
  //       avatarUrl: res.userInfo.avatarUrl
  //     }, () => {
  //       wx.setStorageSync('userInfo', res.userInfo)
  //     })
  //   }
  // })
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
    let userInfo = wx.getStorageSync('userInfo') || null
    if (userInfo != null) {
      this.setData({
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      })
    }
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
    get({
      url: '/userinfo',
    }).then(({data}) => {
      this.setData({
        "praised": data.praised,
        "follow": data.follow,
        "fans": data.fans,
        "desc": data.desc,
        isbind: data.isbind,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      });
    });
    this.getData();
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