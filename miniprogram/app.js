const config = require('core/config');
const {login} = require('shared/index');
const { get } = require('services/index')
App({
  globalData: {
    openid: '',
    userInfo:null
  },
  //先序执行的函数
  onLaunch: function () {
    /**
     * 初始化userInfo
     */
    let userInfo = wx.getStorageSync('userInfo') || null
    if (userInfo != null) {
      this.globalData.userInfo = userInfo
    }
    let token = wx.getStorageSync('token') || null
    let openid = wx.getStorageSync('openid') || null
    if(openid!=null){
      this.globalData.openid = openid
    }
    if(token!=null){
      this.globalData.token = token
    }
    if (!openid || !token) {
      login().then(({openid, token}) => {
        wx.setStorageSync('openid', openid)
        wx.setStorageSync('token', token)
        this.globalData.openid = openid;
        this.globalData.token = token;
        get({
          url: '/userinfo',
        }).then(({data}) => {
          if (!data.isbind) {
            wx.navigateTo({
              url: '/pages/login/index',
            });
          }
          if (!data.isnew) {
            setTimeout(() => {
              wx.showActionSheet({
                itemList: ['获取微信头像和昵称'],
                success () {
                  wx.getUserProfile({
                    desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                    success: (res) => {
                      // this.globalData.userInfo = res.userInfo
                      wx.setStorageSync('userInfo', res.userInfo)
                      get({
                        url: '/setuser',
                        data: {
                          userinfo: {
                            header: res.userInfo.avatarUrl,
                            nick: res.userInfo.nickName,
                          }
                        }
                      })
                    }
                  })
                },
                fail (res) {
                  console.log(res.errMsg)
                }
              })
            }, 300)
          }
          
        });
      });
    }
    
  }


})