import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

// 导入axios,让webpack能打包它
// import './axios'
import axios from './axios'
Vue.prototype.$axios = axios

// 导入字体图标
import '../static/styles/fonts/iconfont.css'

const app = new Vue(App)
app.$mount()
