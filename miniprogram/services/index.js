const {login} = require('../shared/index');
const config = require('../core/config');
module.exports = {
    get: (options) => {
        return new Promise((resolve, reject) => { 
        const { url, data, success, fail } = options;
        let token = wx.getStorageSync('token') || null
        let openid = wx.getStorageSync('openid') || null
        const header = {
            cookie: wx.getStorageSync('sessionid')
        }
        console.log(11122, header)
        if (!token || !openid) {
            login().then(() => {
                let token = wx.getStorageSync('token') || null
                let openid = wx.getStorageSync('openid') || null
                const header = {
                    cookie: wx.getStorageSync('sessionid')
                }
                console.log(1111, openid)
                wx.request({
                    url: config.serverHost + url, // 你的后端 API 地址
                    data: {token: token,openid: openid,...data},
                    method: 'get',
                    header,
                    success: (res) => {
                        
                        success && success(res)
                        resolve(res)
                    },
                    fail: function(error) {
                      console.error(error);
                      fail && fail(res);
                      reject(error)
                    }
                  })
                })
            } else {
                wx.request({
                    url: config.serverHost + url, // 你的后端 API 地址
                    data: {token: token,openid: openid,...data},
                    method: 'get',
                    header,
                    success: (res) => {
                        if (!res?.data?.success) {
                            fail && fail(res);
                            wx.showToast({
                                title: res?.data?.message,
                                icon: 'error',
                            });
                        } else {
                            success && success(res)
                        }
                        resolve(res)
                    },
                    fail: function(error) {
                      console.error(error);
                      fail && fail(res);
                      wx.showToast({
                        title: '网络错误',
                            icon: 'error',
                        });
                      reject(error)
                    }
                  })
            }
        })
    },
    post: (options) => {
        return new Promise((resolve, reject) => { 
        const { url, data, success, fail } = options;
        let token = wx.getStorageSync('token') || null
        let openid = wx.getStorageSync('openid') || null
        const header = {
            cookie: wx.getStorageSync('sessionid')
        }
        if (!token || !openid) {
            login().then(() => {
                let token = wx.getStorageSync('token') || null
                let openid = wx.getStorageSync('openid') || null
                const header = {
                    cookie: wx.getStorageSync('sessionid')
                }
                wx.request({
                    url: config.serverHost + url, // 你的后端 API 地址
                    data: {token: token,openid: openid,...data},
                    method: 'post',
                    header,
                    success: (res) => {
                        if (!res?.data?.success) {
                            fail && fail(res);
                            wx.showToast({
                                title: res?.data?.message,
                                icon: 'error',
                            });
                        } else {
                            success && success(res)
                        }
                        
                        resolve(res)
                    },
                    fail: function(error) {
                      console.error(error);
                      fail && fail(res);
                      
                      reject(error)
                    }
                  })
                })
            } else {
                wx.request({
                    url: config.serverHost + url, // 你的后端 API 地址
                    data: {token: token,openid: openid,...data},
                    method: 'post',
                    header,
                    success: (res) => {
                        if (!res?.data?.success) {
                            fail && fail(res);
                            wx.showToast({
                                title: res?.data?.message,
                                icon: 'error',
                            });
                        } else {
                            success && success(res)
                        }
                        resolve(res)
                    },
                    fail: function(error) {
                      console.error(error);
                      fail && fail(res);
                      wx.showToast({
                        title: '网络错误',
                            icon: 'error',
                        });
                      reject(error)
                    }
                  })
            }
        })
    }
}