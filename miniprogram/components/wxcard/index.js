// components/wxcard/index.js
const app = getApp();
const { get, post } = require('../../services/index')

Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    cardInfo:{
      type:Object,
      observer:function(newVal,oldVal){
        // console.log(newVal)
      }
    },
    showAllImg: {
      type: Boolean,
      observer:function(newVal,oldVal){
        // console.log(newVal)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    openid:'',
    liked:false,
    showbar:false,
    vis:false,
    cardData: {}
    // //喜欢列表
    // likeList:[],
    // //评论列表
    // commentList:[]
  },
  observers: {
    'cardInfo': function(newValue) {
      // 当 initialValue 属性变化时，设置 myData 的值
      this.setData({
        cardData: newValue
      });
    }
  },
  lifetimes:{
    attached(){
      this.setData({
        openid:app.globalData.openid,
        cardData: this.properties.cardInfo
      })
      //请求并获取喜欢列表
      // this.reqLikeList();
      // //请求并获取评论列表
      // this.reqCommentList();
    }
  },
  onShareAppMessage: function(options) {
    // 设置分享的内容
    return {
      title: 'IUShow - AI 助力孩子学习和创作分享',
      path: '/pages/detail/index?workid='+this.data.cardData.id, // 可以携带页面参数
      // imageUrl: 'https://example.com/image.png' // 分享图标（可选）
    };
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goUserDetail(e) {
      wx.navigateTo({
        url: '/pages/user/index?userid=' + this.data.cardData.userInfo.userid,
      });
      // return false
    },
    deletecomment(e){
      var that = this;
      /**
       * 长按删除
       */
      let docid = e.currentTarget.dataset.idx;
      let openid = e.currentTarget.dataset.openid;
      let myopenid = app.globalData.openid || wx.getStorageSync('openid')
      if(myopenid!=openid){
        return
      }
      /**
       * 相等判断是否删除
       */
      wx.showModal({
        title:'提醒',
        content:'是否删除该评论',
        success:r=>{
          if(r.confirm){
            /**
             * 删除
             */
            wx.cloud.callFunction({
              name:'comment',
              data:{
                action:'delete',
                docid:docid
              },
              success:res=>{
                this.reqCommentList();
              }
            })
          }
        }
      })
    },
    delit(e){
      let docid = e.currentTarget.dataset.idx;
      wx.showModal({
        title:'提醒',
        content:'是否要删除该条朋友圈',
        success:r=>{
          if(r.confirm){
            this.setData({
              vis:true
            })
            wx.cloud.callFunction({
              name:'post',
              data:{
                action:'delete',
                docid:docid
              },
              success:res=>{
                this.triggerEvent('deletepost',docid)
              },
              fail:res=>{

              },
              complete:res=>{
                this.setData({
                  vis:false
                })
              }
            })
          }
        }
      })
    },
    showImg(e) {
      let imgidx = e.target.dataset.imgidx;
      let imgArr = this.properties.cardInfo.content
      console.log(2222, imgidx)
      wx.previewImage({
        current: imgArr[imgidx], // 当前显示图片的http链接
        urls: imgArr // 需要预览的图片http链接列表
      })
    },
    ishare() {
      get({
        url: '/works',
        data: {
          key: 'share',
          workid: this.data.cardData.id
        }
      }).then(() => {
        this.setData({
          vis:false,
          cardData: {
            ...this.data.cardData,
            share: this.data.cardData.share + 1
          }
        })
      })
    },
    ilike(){
      this.setData({
        vis:true
      })
      get({
        url: '/works',
        data: {
          key: 'praised',
          workid: this.properties.cardInfo.id
        }
      }).then(() => {
        this.setData({
          vis:false,
          cardData: {
            ...this.data.cardData,
            ispraised: !this.data.cardData.ispraised,
            praised: this.data.cardData.ispraised ? this.data.cardData.praised - 1 : this.data.cardData.praised + 1
          }
        })
      })
    },
    icollect(){
      this.setData({
        vis:true
      })
      get({
        url: '/works',
        data: {
          key: 'collect',
          workid: this.properties.cardInfo.id
        }
      }).then(() => {
        this.setData({
          vis:false,
          cardData: {
            ...this.data.cardData,
            iscollect: !this.data.cardData.iscollect,
            collect: this.data.cardData.iscollect ? this.data.cardData.collect - 1 : this.data.cardData.collect + 1
          }
        })
      })
    },
    goDetail(e) {
      const data = this.properties.cardInfo
      wx.navigateTo({
        url: '/pages/detail/index',
        success: (res) => {
          res.eventChannel.emit('transferData', data);
        }
      });
      // return false
    },
    follow() {
      this.setData({
        vis:true
      })
      post({
        url: '/follow',
        data: {
          type: this.data.cardData.isfollow ? 0 : 1,
          userid: this.properties.cardInfo.userid
        }
      }).then(() => {
        this.setData({
          vis:false,
          cardData: {
            ...this.data.cardData,
            isfollow: !this.data.cardData.isfollow
          }
        })
      })
    },
    closeActionBar(){
      this.setData({
        showbar:false
      })
    }
  }
})
