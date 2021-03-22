<template>
  <div v-if="course_detail" class="course-detail-container">
    <!-- 视频 -->
    <div v-if="!isPlaying" class="cover_image">
      <img :src="course_detail.course.cover_image_url" alt="">
      <div class="play">
        <img @click="isPlaying=true" src="/static/images/play@2x.png" alt="">
        <p>播放课程简介</p>
      </div>
    </div>
    <div v-else class="course_video">
      <video :src="course_detail.course.course_video_url" autoplay controls></video>
    </div>
    <!-- 简介 -->
    <div class="introduction">
      <div class="title-price">
        <span>{{course_detail.course.title}}</span>
        <span>{{course_detail.course.price}}.00</span>
      </div>
      <p class="introduce">{{course_detail.course.introduction}}</p>
      <div class="star">
        <Star :score="course_detail.course.score"/>
        <p>{{course_detail.course.study_count}}人已学</p>
      </div>
      <div class="study-share">
        <img @click="startStudy" src="/static/images/start_study@2x.png" alt="">
        <button src="/static/images/share@2x.png" open-type="share" class="share-button" plain alt=""></button>
      </div>
    </div>
    <!-- menu -->
    <div class="catalog">
      <div class="head">
        <span @click="changeSelectIndex(index)" v-for="(item,index) in menus" :class="{active:selectIndex === index}" :key="item">{{item}}</span>
      </div>
      <div class="body">
        <!-- 目录 -->
        <div class="catelog-container" v-if="selectIndex === 0">
          <p v-for="(item,index) in course_detail.videos" :key="item.id">
            {{index+1}}.{{item.name}}
          </p>
          <p v-if="!course_detail.videos">
            暂无课程视频哦，请联系客服添加~
          </p>
        </div>
        <!-- 讲师介绍 -->
        <div class="lecturer-container" v-else-if="selectIndex === 1">
          <div v-if="course_detail.lecturer" class="info">
              <img :src="course_detail.lecturer.avatar" alt="">
              <div class="name-follow">
                <p>{{course_detail.lecturer.name}}</p>
                <p>关注人数{{course_detail.lecturer.follow_count}}</p>
              </div>
              <p @click="followOrUnFollow(course_detail.lecturer.is_follow,course_detail.lecturer.id)" :class="[course_detail.lecturer.is_follow === 1 ? 'follow' : 'unfollow']">{{course_detail.lecturer.is_follow === 1 ? '已关注' : '关注'}}</p>
          </div>
          <div v-if="course_detail.lecturer" class="introduce">
            <p>{{course_detail.lecturer.introduction}}</p>
          </div>
        </div>
        <!-- 评价 -->
        <div v-else-if="selectIndex === 2">
          <div class="comment-item" v-for="item in course_detail.comments" :key="item.id">
            <div class="info">
              <img :src="item.avatar" alt="">

              <div class="nickname-content">
                <div>
                  <div class="nickname">{{item.nickname}}&nbsp;&nbsp;<Star :score="item.score"/></div>
                </div>
                <div>{{item.content}}</div>
              </div>
              <div class="time">{{item.comment_time}}</div>
            </div>
            <div class="star">
              <img @click="likeOrUnLike(item)" :src="item.is_like === 2 ? '/static/images/like_highlight@2x.png' : '/static/images/like_normal@2x.png'" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Star from '../../components/Star'
export default {
  components:{
    Star
  },
  data(){
    return {
      course_id:null, // 课程id
      course_detail:null, // 课程详情的数据
      isPlaying:false, // 是否正在播放
      menus:['目录','讲师介绍','评价'], // menus
      selectIndex: 0 // 默认选中的索引
    }
  },
  onLoad(options){
    this.course_id = options.course_id

    // 获取课程数据
    this.getCourseDetailData()
  },
  onShareAppMessage(obj){
    return {
      title: '七夕只要7.7',
      path: '/page/home/main?id=111',
      imageUrl:'/static/images/logo@2x.png'
    }
  },
  methods: {
    // 获取课程数据
    async getCourseDetailData(){
      // this.$axios.get(`course/${this.course_id}`).then(result => {
      //   this.course_detail = result.data.message
      //   this.menus[2] = `评价(${result.data.message.commentTotal})`
      // })

      const result = await this.$axios.get(`course/${this.course_id}`)

      this.course_detail = result.data.message
      this.menus[2] = `评价(${result.data.message.commentTotal})`
    },
    // 更改选中的索引
    changeSelectIndex(index){
      this.selectIndex = index
    },
    // 关注还是取消关注
    async followOrUnFollow(is_follow,lecturer_id){
      // console.log(is_follow,lecturer_id)
      switch (is_follow) {
        case 0: // 之前没有关注，现在要去关注
          const result1 = await this.$axios.post('lecturer/follow',{
            lecturer_id
          })

          if (result1.data.status === 0) {
            this.course_detail.lecturer.is_follow = 1
            wx.showToast({
              title: result1.data.message, //提示的内容,
              icon: 'none', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          }
          break;

        case 1: // 之前关注过，现在要取消关注
          const result2 = await this.$axios.post('lecturer/unfollow',{
            lecturer_id
          })

          if (result2.data.status === 0) {
            this.course_detail.lecturer.is_follow = 0
            wx.showToast({
              title: result2.data.message, //提示的内容,
              icon: 'none', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          }
          break;

        default:
          break;
      }
    },
    // 点赞与取消点赞
    async likeOrUnLike(item){
      // console.log(item)
      switch (item.is_like) {
        // 之前没有点赞，现在点赞
        case 1:
          const res1 = await this.$axios.post('comment/like',{
            comment_id: item.id,
            is_like:2
          })
          if (res1.data.status === 0){
            item.is_like = 2
          }
          break;

        // 之前有点赞，现在取消点赞
        case 2:
          const res2 = await this.$axios.post('comment/like',{
            comment_id: item.id,
            is_like:1
          })
          if (res2.data.status === 0){
            item.is_like = 1
          }
          break;

        default:
          break;
      }
    },
    // 开始学习
    startStudy(){
      wx.navigateTo({ url: `/pages/play/main?course_id=${this.course_id}` });
    }
  },
}
</script>

<style lang="less" scoped>
.course-detail-container{
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
    position: relative;
    .play{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: absolute;
      img{
        width:164rpx;
        height: 164rpx;
      }
      p{
        margin-top: 10rpx;
        color:#E9E9E9;
        font-size: 15px;
      }
    }
  }
  .course_video{
    width: 750rpx;
    height: 434rpx;
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
    left:0;
    right: 0;
    height: 452rpx;
    background-color: #F8F8F8;
    padding:38rpx 32rpx;
    .title-price{
      margin-top: 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span:nth-child(1){
        font-size: 24px;
        color:#343434;
        font-weight: Bold;
      }
      span:nth-child(2){
        font-size: 22px;
        color:#EE3939;
      }
    }
    .introduce{
      color:#818181;
      font-size: 12px;
      margin:40rpx 0rpx;
    }
    .star{
      display: flex;
      p{
        height: 50rpx;
        line-height: 50rpx;
        margin-left: 20rpx;
        font-size: 12px;
        color:#FE8E38;
      }
    }
    .study-share{
      margin-top: 60rpx;
      img:nth-child(1){
        width: 568rpx;
        height: 92rpx;
      }
      .share-button{
        border:none;
        width: 92rpx;
        height: 92rpx;
        background-color: #fff;
        border-radius: 10rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        float: right;
        background-image:url(../../../static/images/share@2x.png);
        background-repeat: no-repeat;
        background-size: 34rpx 34rpx;
        background-position: 30rpx 30rpx;
      }
    }
  }
  .catalog{
    margin-top:520rpx;
    // position: absolute;
    z-index:5;
    width:750rpx;
    height:582rpx;
    background-color: #F8F8F8;
    .head{
      height: 120rpx;
      background-color: #F8F8F8;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #F5F5F5;
      span{
        text-align: center;
        color:#A8A8A8;
        font-size: 14px;
        height: 120rpx;
        line-height: 120rpx;
        flex:1;
        position: relative;
      }
      .active{
          color:#333333;
          font-weight: bold;
          &::after{
            content:'';
            position: absolute;
            left:88rpx;
            bottom: 0px;
            width: 74rpx;
            height: 3px;
            background-color: #FF8E43;
          }
        }
    }
    .catelog-container{
      padding:40rpx;
      height:582rpx;
      p{
        color:#636363;
        font-size: 15px;
        height: 80rpx;
        line-height: 80rpx;
      }
    }
    .lecturer-container{
      padding:40rpx;
      .info{
        height: 200rpx;
        display: flex;
        align-items: center;
        .name-follow{
          margin-left: 30rpx;
          flex:1;
          p:nth-child(1){
            font-size: 17px;
            color:#333333;
          }
          p:nth-child(2){
            font-size: 14px;
            margin-top: 15rpx;
            color:#A8A8A8;
          }
        }
        img{
          margin-left: 12rpx;
          width:120rpx;
          height: 120rpx;
        }
        .unfollow{
          width:136rpx;
          height: 52rpx;
          line-height: 52rpx;
          text-align: center;
          border: 1px solid #A8A8A8;
          border-radius: 26rpx;
          color:#A8A8A8;
          font-size: 14px;
        }
        .follow{
           width:136rpx;
          height: 52rpx;
          line-height: 52rpx;
          text-align: center;
          border: 1px solid #A8A8A8;
          border-radius: 26rpx;
          color:#fff;
          background-color: #A8A8A8;
          font-size: 14px;
        }
      }
      .introduce{
        p{
          margin-left: 12rpx;
          font-size:12px;
          font-family:PingFang SC;
          font-weight:400;
          line-height:20px;
          color:rgba(168,168,168,1);
          opacity:1;
        }
      }
    }
    .comment-item{
      padding:40rpx;
      height: 180rpx;
      border-bottom: 2px solid #F1F1F1;
      .info{
        height: 120rpx;
        display: flex;
        align-items: center;
        img{
          margin-left:6rpx;
          width:96rpx;
          height: 96rpx;
          border-radius: 50%;
        }
        .nickname-content{
          flex:1;
          margin-left:30rpx;
          margin-right: 10rpx;
          .nickname{
            color:#333333;
            font-size: 15px;
            font-weight: bold;
            align-items: center;
            display: flex;
            div{
              height: 100%;
              display: inline-block;
            }
          }
          div:nth-child(2){
            margin-top:16rpx;
            color:#A8A8A8;
            font-size: 12px;
          }
        }
        .time{
          color:#A8A8A8;
          font-size: 11px;
        }
      }
    }
    .star{
      img{
        margin-top: 30rpx;
        width:44rpx;
        height: 44rpx;
        float: right;
        margin-right: 20rpx;
      }
      img:nth-child(0){
        margin-right: 20rpx;
      }
    }
  }
}
</style>
