<template>
  <div v-if="playData" class="play-container">
    <div class="cover_image">
      <video :src="playData.videos[0].video_url"></video>
    </div>
    <div class="introduction">
      <div class="title-and-info">
        <div class="title">{{playData.course.title}}</div>
        <div class="info">
          <span>{{playData.course.study_count}}人学过</span>
          <span v-if="playData.course.level === 1">初级</span>
          <span v-else-if="playData.course.level === 2">中级</span>
          <span v-else-if="playData.course.level === 3">高级</span>
          <span>时长:{{playData.course.course_duration}}</span>
        </div>
      </div>
      <div class="comment">
        <img src="/static/images/evaluate@2x.png" alt="">
      </div>
    </div>
    <div class="course-progress">
      <div class="title">课程进度</div>
      <div class="catelog-container">
        <p @click="toggleSelect(index,item)" :class="[selectIndex === index ? 'active' : '']" v-for="(item,index) in playData.videos" :key="item.id">
          {{index+1}}.{{item.name}}
          <span :class="[item.is_study === 1 ? 'studied' : 'time']">
            {{item.is_study === 1 ? '已学习' : item.duration}}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      course_id: null, // 课程id
      playData: null, // 课程播放的数据
      selectIndex:0 //当前选中的索引
    }
  },
  onLoad(options){
    this.course_id = options.course_id

    this.getCoursePlayData()
  },
  methods:{
    // 获取课程播放的信息
    async getCoursePlayData(){
      const result = await this.$axios.get(`course/play/${this.course_id}`)

      this.playData = result.data.message
    },
    // 判断登录的用户，是否有权限播放该视频
    /**
     * 调用该方法，会返回一个Promise对象，该对象中通过Promise要么返回true(有权限)，要么返回false(没有权限)
     */
    async validataPlayRight(){
      const result = await this.$axios.get('order/paystatus',{
        params:{
          course_id:this.course_id
        }
      })

      // pay_status === 1 支付过，有权限 0 则表示没有支付过，没有权限
      if (result.data.pay_status === 1){
        return true
      } else {
        return false
      }
    },
    // 切换播放的视频
    async toggleSelect(index,item){
      // 改变索引
      this.selectIndex = index

      // 调用鉴权的方法，来判断是否有播放权限
      const isCanPlay = await this.validataPlayRight()
      if (!isCanPlay) {
        wx.showModal({
          title: '提示', //提示的标题,
          content: '您还没有支付,请先支付后，再来观看哦~', //提示的内容,
          showCancel: true, //是否显示取消按钮,
          cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
          cancelColor: '#000000', //取消按钮的文字颜色,
          confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
          confirmColor: '#ff9b2e', //确定按钮的文字颜色,
          success: res => {
            if (res.confirm) {
              const url = `/pages/pay/main?course_id=${this.course_id}&title=${this.playData.course.title}&price=${this.playData.course.price}`
              wx.navigateTo({ url });
            }
          }
        });
        return
      }

      // 这边就可以正常播放
      console.log("--播放并且记录学习进度--")
    }
  }
}
</script>

<style lang="less" scoped>
.play-container{
  background-color:#EFEFEF;
  position: relative;
  .cover_image{
    width: 750rpx;
    height: 434rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      width: 750rpx;
      height: 434rpx;
    }
    video{
      width: 750rpx;
      height: 434rpx;
    }
  }
  .introduction{
    z-index: 3;
    position: absolute;
    margin-top: -10rpx;
    border-radius:16px 16px 0px 0px;
    border-bottom: 1px solid #F5F5F5;
    // width:750rpx;
    left:0;
    right: 0;
    height: 192rpx;
    background-color: #FFFFFF;
    padding:38rpx 32rpx;
    display: flex;
    align-items: center;
    .title-and-info{
      flex:1;
      .title{
        color:#343434;
        font-size: 24px;
        font-weight: bold;
      }
      .info{
        margin-top:12rpx;
        height: 34rpx;
        line-height: 34rpx;
        color:#818181;
        font-size: 12px;
        span{
          padding-right: 15rpx;
        }
        span:nth-child(2),span:nth-child(3){
          padding-left: 15rpx;
        }
        span:nth-child(2){
          position: relative;
          &::before{
            position: absolute;
            content:'';
            background-color: #EBEBEB;
            left:0rpx;
            width:1px;
            top:8rpx;
            height: 20rpx;
          }
          &::after{
            position: absolute;
            content:'';
            background-color: #EBEBEB;
            right:0rpx;
            width:1px;
            top:8rpx;
            height: 20rpx;
          }
        }
      }
    }
    .comment{
      margin-top:32rpx;
      img{
        width: 198rpx;
        height: 80rpx;
      }
    }
  }
  .course-progress{
    margin-top:222rpx;
    padding: 44rpx 32rpx;
    background-color: #FFF;
    .title{
      color:#343434;
      font-size: 15px;
    }
    .catelog-container{
      p{
        color:#636363;
        font-size: 15px;
        height: 80rpx;
        line-height: 80rpx;
      }
      .studied{
        float:right;
        margin-top:16rpx;
        font-size:10px;
        text-align: center;
        color:#AAAAAA;
        background-color: #F5F5F5;
        border-radius: 12rpx;
        width:98rpx;
        height: 48rpx;
        line-height: 48rpx;
      }
      .time{
        float:right;
      }
      .active{
        color:#FF5E00;
      }
    }
  }
}
.comment-content{
  label{
    width:100rpx;
  }
  textarea{
    width: 100%;
    height: 200rpx;
  }
}
</style>
