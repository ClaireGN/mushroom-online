<template>
  <div class="home-container">
    <!-- 搜索条 -->
    <SearchBar placeholder="请输入课程的名称"></SearchBar>
    <!-- 轮播图 -->
    <swiper indicator-dots circular autoplay indicator-active-color="#fff" :interval="3000">
        <navigator :url="'/pages/course-detail/main?course_id='+item.course_id" v-for="item in swipers" :key="item.id">
            <swiper-item>
                <image :src="item.img_url"></image>
            </swiper-item>
        </navigator>
    </swiper>
    <!-- 热门课程 -->
    <div>
      <div class="tips">
        <p>推荐课程</p>
        <img @click="goToCoursePage" src="/static/images/arrow@2x.png" alt="">
      </div>
      <scroll-view scroll-x class="course-container">
         <navigator :url="'/pages/course-detail/main?course_id='+item.relation_id" class="course-item" v-for="item in courses" :key="item.id">
          <img :src="item.icon" alt="">
        </navigator>
      </scroll-view>
    </div>
    <!-- 推荐视频 -->
    <div>
      <div class="tips">
        <p>热门视频</p>
        <img @click="goToCoursePage" src="/static/images/arrow@2x.png" alt="">
      </div>
      <div class="hot-video">
        <navigator :url="'/pages/course-detail/main?course_id='+item.course_id" v-for="item in videos" :key="item.id" class="video-item">
          <img :src="item.cover_photo_url" alt="">
          <p class="title">{{item.name}}</p>
          <p class="subtitle">{{item.view_count}}人已观看</p>
        </navigator>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBar from '../../components/SearchBar'
export default {
  data(){
    return {
      swipers:[], // 轮播图数据
      courses:[], // 课程数据
      videos:[] // 热门视频
    }
  },
  components:{
    SearchBar
  },
  onLoad(){
    // 获取轮播图数据
    this.getSwipersData()
    // 获取推荐课程的数据
    this.getCoursesData()
    // 获取热门视频的数据
    this.getVideosData()
  },
  methods:{
    async getSwipersData(){
      const result = await this.$axios.get('home/swipers')

      this.swipers = result.data.message
    },
    async getCoursesData(){
      const result = await this.$axios.get('home/course')

      this.courses = result.data.message
    },
    async getVideosData(){
      const result = await this.$axios.get('home/video')

      this.videos = result.data.message
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding: 20rpx;
  background-color: #fff;
}
swiper{
  width:100%;
  height: 342rpx;
  swiper-item{
    width:100%;
    height: 100%;
  }
  image{
    width:100%;
    height: 100%;
  }
}
.tips{
  height:120rpx;
  display:flex;
  align-items:center;
  justify-content:space-between;
  p {
    font-size:36rpx;
    font-weight:700;
    color:#212121;
  }
  img{
    width:48rpx;
    height:48rpx;
  }
}
.course-container{
  height:170rpx;
  white-space: nowrap;
  .course-item{
    width:296rpx;
    height:168rpx;
    display: inline-block;
    margin-right: 32rpx;
    img{
      width:100%;
      height:100%;
    }
  }
}
.hot-video{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  .video-item{
    width:340prx;
    img{
      width:340rpx;
      height: 210rpx;
      border-radius: 12rpx;
    }
    .title{
      margin-top: 15rpx;
      color:#262626;
      font-size: 26rpx;
    }
    .subtitle{
      margin-top: 15rpx;
      margin-bottom: 15rpx;
      color:#959595;
      font-size: 18rpx;
    }
  }
}
</style>
