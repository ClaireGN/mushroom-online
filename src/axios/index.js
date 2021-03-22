// import Vue from 'vue'
import axios from 'axios'

// 设置基准路径
axios.defaults.baseURL = "http://localhost:3000/api"

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (wx.getStorageSync('token')){
    config.headers.Authorization = wx.getStorageSync('token')
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


// 适配器（可以让你决定axios底层使用什么发送网络请求，默认是使用XMLHTTPRequest）
axios.defaults.adapter = function (config) {
  return new Promise ((resolve, reject) => {
      // 使用wx.request 去发送网络请求
      wx.showLoading({
        title: '正在加载中...', //提示的内容,
        mask: true //显示透明蒙层，防止触摸穿透,
      });
      wx.request({
        url: config.url, //开发者服务器接口地址",
        data: config.data || config.params, //请求的参数",
        header:config.headers, //这个地方要设置正确，否则容易出错
        method: config.method,
        dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject(err)
        },
        complete: () => {
          wx.hideLoading()
        }
      });
  })
}

// 挂载到Vue的原型上
// Vue.prototype.$axios = axios

export default axios
