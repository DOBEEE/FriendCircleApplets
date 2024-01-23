// pages/index/index.js
const config = require('../../core/config')
const SecCheck = require('../../core/SecCheck')
const app = getApp();
const PAGE_SIZE = config.PageSize;
function generateRandomName() {
  const adjectives = ["Cool", "Super", "Mighty", "Joyful", "Peaceful", "Cheerful"];
  const animals = ["Panda", "Lion", "Eagle", "Tiger", "Koala", "Leopard"];
  return adjectives[Math.floor(Math.random() * adjectives.length)] +
         animals[Math.floor(Math.random() * animals.length)] +
         Math.floor(Math.random() * 100);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottom: 0,
    hasUserInfo: false,
    vis: false,
    postList: [],
    showbar: true,
    postid: '',
    oncomment: false,
    replyuserInfo: null,
    replycontent: '',
    pageIndex: 0,
    end: false
  },
  taInput(e) {
    this.setData({
      replycontent: e.detail.value
    })
  },
  handleSend() {
    var that = this;
    //获取用户信息
    let userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || ''
    let openid = app.globalData.openid || wx.getStorageSync('openid') || ''
    if (openid == '' || userInfo == '') {
      this.setData({
        errMsg: '缺少用户信息'
      })
      return
    }
    SecCheck.msgSecCheck(this.data.replycontent).then(ans=>{
      console.log(ans)
      if(ans.result.code == 200){
        wx.cloud.callFunction({
          name: 'comment',
          data: {
            action: 'add',
            data: {
              postid: this.data.postid,
              userInfo,
              replyuserInfo: this.data.replyuserInfo,
              openid,
              replycontent: this.data.replycontent
            }
          },
          success: r => {
            console.log(r)
            /**
             * 全部组件进行刷新
             */
            let acmp = that.selectAllComponents('.card')
            // console.log(acmp)
            acmp.forEach(function (ele, index) {
              ele.flushComment(that.data.postid)
            })
            that.setData({
              postid: ''
            })
    
          }
        })
      }else{
        this.setData({
          errMsg:ans.result.msg,
          postid:''
        })
      }
    })
    

  },
  deletepost(e) {
    let docid = e.detail
    let tarr = this.data.postList
    let deleteIndex = tarr.findIndex(item => item._id === docid);
    tarr.splice(deleteIndex, 1)
    console.log(tarr)
    this.setData({
      postList: tarr
    })
  },
  baraction(e) {
    this.setData({
      postid: e.detail.postid,
      replyuserInfo: e.detail.replyuserInfo,
      oncomment: true
    })
  },
  hideShowBar() {
    var that = this;

    // let markcard = this.selectComponent('#wxcard')
    // markcard.closeActionBar();
    let acmp = this.selectAllComponents('.card')
    // console.log(acmp)
    acmp.forEach(function (ele, index) {
      ele.closeActionBar();
    })
    if (this.data.oncomment) {
      this.setData({
        oncomment: false
      })
      return
    }
    this.setData({
      postid: ''
    })
    // markcard.closeActionBar();
  },
  mockData({pageSize, pageIndex}) {
    
    const data = [];
  const startId = pageSize * (pageIndex - 1) + 1;
  
  for (let i = 0; i < pageSize; i++) {
    const id = startId + i;
    const randomName = generateRandomName();
    
    data.push({
      id: `id-${id}`,
      openid: `openid-${id}`,
      userInfo: {
        avatarUrl: `https://img1.baidu.com/it/u=2969900212,853391486&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500`,
        nickName: randomName,
      },
      content: `This is a sample post content by ${randomName}. Let's share some thoughts!`,
      postimages: [
        `https://img1.baidu.com/it/u=187817592,3356808617&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500`,
        `https://img1.baidu.com/it/u=187817592,3356808617&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500`
      ],
      location: `Sample Location ${id}`,
      date: new Date().toISOString(),
      nickname: randomName,
      isLike: true,
      likeNum: 10,
      isCollect: false,
      collectNum: 20,
    });
  }
  return data;
  },
  reqPostData() {
    if (this.end) return;
    let postList = this.data.postList
    let len = postList.length
    this.setData({
      vis:true
    })
    const data = this.mockData({pageIndex: this.pageIndex, pageSize: PAGE_SIZE});
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
    this.setData({
      vis:false,
      postList: postList.concat(data)
    })
    // wx.cloud.callFunction({
    //   name: 'post',
    //   data: {
    //     action: 'query',
    //     size: PAGE_SIZE,
    //     step: len,
    //     data: {}
    //   },
    //   success: r => {
    //     wx.stopPullDownRefresh({
    //       success: (res) => {},
    //     })
    //     console.log(r.result.data[0])
    //     this.setData({
    //       vis:false,
    //       postList: postList.concat(r.result.data)
    //     })
    //   },
    //   fail: r => {
    //     console.log(r)

    //   },
    //   complete:res=>{
    //     this.setData({
    //       vis:false
    //     })
    //   }
    // })
    if (data.length < PAGE_SIZE) {
      this.end = true;
    } else {
      this.pageIndex++;
    }
    
  },
  showEditPage() {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '/pages/post/post',
      })
    }
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
          userInfo: res.userInfo,
          hasUserInfo: true
        }, () => {
          wx.setStorageSync('userInfo', res.userInfo)
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp();
    console.log(app.globalData)
    if (app.globalData.userInfo != null) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        postList:[]
      })
    }
    this.reqPostData()
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