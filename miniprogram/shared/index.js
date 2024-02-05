const config = require('../core/config');
let cache = null;
module.exports = {
    login: () => {
      if (cache) {
        console.log(22222222)
        return cache;
      }
      cache = new Promise((resolve, reject) => {
        wx.login({
            success: res => {
              if (res.code) {
                // 发起网络请求
                wx.request({
                  url: config.serverHost + '/login', // 你的后端 API 地址
                  data: {
                    "type": "code",
                    code: res.code // 将 code 发送到服务器
                  },
                  method: 'post',
                  success: (res) => {
                    // 这里处理登录之后的逻辑，比如服务器会返回 session_key、openid、用户自定义登录态等
                    const cookie = res.header["Set-Cookie"];
                    if (cookie != null) {
                        wx.setStorageSync("sessionid", res.header["Set-Cookie"]);//服务器返回的Set-Cookie，保存到本地
                    }
                    resolve(res.data)
                  },
                  fail: function(error) {
                    // 登录失败，可以在这里做错误处理
                    console.error(error);
                    reject(error)
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            },
            fail: function() {
                reject(error)
            }
          });
      })
      return cache
       
    }
}