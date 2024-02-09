const { get } = require('../../services/index')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    avatarUrl: '',
    currentTab: 'works',
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
      this.setData({
        works: {
          ...this.data.works,
          [this.data.currentTab]: res.data[this.data.currentTab]
        }
      });
    });
    // this.setData({
    //   userInfo: {
    //     listdata: Array.from({length: 10}).map(i => (
    //       {
    //         id: `id-1`,
    //         openid: `openid-2`,
    //         userInfo: {
    //           avatarUrl: `https://img1.baidu.com/it/u=2969900212,853391486&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500`,
    //           nickName: '11111',
    //         },
    //         content: `This is a sample post content by 2. Let's share some thoughts!`,
    //         postimages: Array.from({length: 10}).map((i, idx) => idx % 2 > 0 ? `https://img1.baidu.com/it/u=187817592,3356808617&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500`: 
    //           'https://pic1.zhimg.com/v2-4253112469acdc04bd1e78187215b976_r.jpg?source=1940ef5c'
    //         ),
    //         location: `Sample Location 2`,
    //         date: new Date().toISOString(),
    //         nickname: '2222',
    //         isLike: true,
    //         likeNum: 10,
    //         isCollect: false,
    //         collectNum: 20,
    //       }
    //     ))
    //   }
    // })
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
    console.log(`Change tab, tab-panel value is ${event.detail.value}.`);

    
    this.setData({
      currentTab: event.detail.value
    }, () => {
      this.getData();
    });
  },
  goDetail(e) {
    console.log(2222, e.currentTarget)
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
  wx.getUserProfile({
    desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
      this.setData({
        nickName: res.userInfo.nickName,
        avatarUrl: res.userInfo.avatarUrl
      }, () => {
        wx.setStorageSync('userInfo', res.userInfo)
      })
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
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo') || null
    console.log(222, userInfo)
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