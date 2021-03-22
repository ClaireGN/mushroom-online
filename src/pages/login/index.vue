<template>
  <div style="height:100%;">
    <div v-if="!isWxLogin" class="login-container">
      <img class="logo" src="/static/images/logo@2x.png" alt="">
      <p class="title">蘑菇在线</p>
      <img class="login-tips" src="/static/images/login_tips@2x.png" alt="">
      <p class="bottom-tip">Copyright © 2019 蘑菇在线 </p>
      <button open-type="getUserInfo" @getuserinfo="getUserInfo" plain class="wx-login-button">
        <img class="wx-login-img" src="/static/images/wx_login@2x.png" alt="">
      </button>
      <p @click="phoneLogin" class="phone-login">手机号登录</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isWxLogin: false
    }
  },
  onLoad(){
    if (wx.getStorageSync('token')){
      wx.reLaunch({ url: '/pages/home/main' });
    }
  },
  methods: {
    getUserInfo (e) {
      // 如果用户拒绝，则直接return
      if (e.mp.detail.errMsg === 'getUserInfo:fail auth deny') return

      // 解构出nickname、avatar
      const {nickName,avatarUrl} = e.mp.detail.userInfo

      // 调用wx.login接口
      wx.login({
        success: async res => {
          const result = await this.$axios.post('user/wxlogin',{
            code:res.code,
            nickname:nickName,
            avatar:avatarUrl
          })

          if (result.data.status === 0){
            // 先把token保存在本地
            wx.setStorageSync('token', result.data.token)

            // 跳转到home
            // wx.navigateTo({ url: '/pages/phone-login/main' });
            // reLaunch 可以跳转到tabBar，并且它可以把之前的页面栈全部清空
            mpvue.reLaunch({ url: '/pages/home/main' });
          }
        },
        fail: () => {},
        complete: () => {}
      });
    },
    // 编程式导航
    phoneLogin(){
      wx.navigateTo({
        url: '/pages/phone-login/main'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .logo{
    margin-top:180rpx;
    width: 212rpx;
    height: 212rpx;
  }
  .title{
    color:#333333;
    font-size: 24px;
    margin-top: 20rpx;
  }
  .login-tips{
    margin-top: 30rpx;
    height: 34rpx;
    width:292rpx;
    position: relative;
  }
  .wx-login-button{
    margin-top:200rpx;
    width:568rpx;
    height: 98rpx;
    padding:0;
    border:none;
  }
  .wx-login-img{
    // margin-top:200rpx;
    width:568rpx;
    height: 98rpx;
  }
  .phone-login{
    margin-top:40rpx;
    color:#333333;
    font-size: 15px;
  }
  .bottom-tip{
    color:#A8A8A8;
    font-size: 10px;
    position: absolute;
    bottom:40rpx;
  }
}
.wx-login-container{
  position: relative;
  .wx-login-tip1{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 450rpx;
    padding-top: 50rpx;
    img{
      width: 198rpx;
      height: 198rpx;
    }
    p{
      color:#BEBEBE;
      margin-top:50rpx;
      font-size: 13px;
    }
  }
  .wx-login-tip1-cover{
    position: fixed;
    left:0;
    right:0;
    top:0;
    height: 500rpx;
    background:rgba(0,0,0,1);
    opacity:0.16;
  }
  .wx-login-tip2{
    position: fixed;
    left:0;
    right:0;
    bottom: 0;
    z-index: 1;
    background-color: #FFF;
    width: 750rpx;
    height: 720rpx;
    padding-top:38rpx;
    padding-left:38rpx;
    .head{
      height: 60rpx;
      display: flex;
      align-items: center;
      .head-img{
        width:54rpx;
        height: 54rpx;
        border-radius: 54rpx;
      }
      span{
        margin-left:20rpx;
        color:#333333;
        font-weight: bold;
        font-size: 16px;
      }
    }
    .body1{
      height: 100rpx;
      line-height: 100rpx;
      font-weight: bold;
      margin-top:50rpx;
      color:#020202;
      font-size: 25px;
      width: 650rpx;
    }
    .body2{
      margin-top:120rpx;
      display: flex;
      height: 150rpx;
      align-items: center;
      position: relative;
      img{
        width: 94rpx;
        height: 94rpx;
      }
      div{
        margin-left:50rpx;
        display: flex;
        flex-direction: column;
        span:nth-child(1){
          color:#333333;
          font-size: 16px;
          font-weight: bold;
        }
        span:nth-child(2){
          margin-top:15rpx;
          color:#D1D1D1;
          font-size: 14px;
        }
      }
      &::before{
        content:'';
        background-color:#EDEDED;
        position: absolute;
        top:0;
        left:0;
        width:674rpx;
        height: 1px;
      }
      &::after{
        content:'';
        background-color:#EDEDED;
        position: absolute;
        bottom:0;
        left:0;
        width:674rpx;
        height: 1px;
      }
    }
    .footer{
      display: flex;
      height: 260rpx;
      align-items: center;
      button{
        width:314rpx;
        height: 82rpx;
        line-height: 82rpx;
        padding:0;
        margin:0;
        color: #2A2A2A;
        font-size: 18px;
      }
      button:nth-child(2){
        margin-left: 50rpx;
        color:#FFF;
        background-color: #57BE6A;
      }
    }
  }
}
</style>
