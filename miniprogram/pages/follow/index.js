// pages/index/index.js
const config = require('../../core/config')
const SecCheck = require('../../core/SecCheck')
const app = getApp();
const PAGE_SIZE = config.PageSize;
const { get} = require('../../services/index')
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
    pageIndex: 1,
    end: false,
    pageid: 1,
    pageNum: 10,
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
  reqPostData(refresh) {
    if (this.data.end && !refresh) return;
    let postList = this.data.postList
    this.setData({
      vis:true,
      end: refresh ? false : this.data.end 
    })
    get({
      url: '/follows',
      data: {
        pageid: refresh ? 1 : this.data.pageIndex,
        pageNum: this.data.pageNum,
      }
    }).then(({data}) => {
      console.log(1111, data)
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
      this.setData({
        vis:false,
        postList: postList.concat(data.recommends.map(i => ({
          ...i,
          userInfo: {
            avatarUrl: i.header,
            nickName: i.nick,
            userid: i.userid
          },
        })))
      });
      if (data.recommends.length < this.data.pageNum) {
        this.setData({
          end: true
        })
      } else {
        this.setData({
          pageIndex: refresh ? 2 : this.data.pageIndex + 1
        })
      }
    });
    
    
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
      postList: [],
      end: false
    }, () => {
      this.reqPostData(true);
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