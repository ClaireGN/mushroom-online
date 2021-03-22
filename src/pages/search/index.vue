<template>
  <div class="search-container">
    <div class="search-head">
      <input v-model="keyword" focus class="search-input" type="text" @confirm="search" placeholder="请输入课程名称" @focus="isFocus = true"/>
      <span class="iconfont icon-search"></span>
      <span v-show="isFocus" @click="cancel" class="search-button">取消</span>
    </div>
    <div class="search-body">
      <!-- https://cn.vuejs.org/v2/guide/components-registration.html#%E7%BB%84%E4%BB%B6%E5%90%8D%E5%A4%A7%E5%B0%8F%E5%86%99 -->
      <course-list :courses="courses"></course-list>
    </div>
  </div>
</template>

<script>
import CourseList from '../../components/CourseList'
export default {
  components:{
    CourseList
  },
  data(){
    return {
      isFocus:true,
      keyword:'', // 搜索关键字
      courses:[]
    }
  },
  methods:{
    cancel(){
      this.isFocus = false
      this.keyword = ''

      this.search()
    },
    // 搜索
    async search(){
      const result = await this.$axios.get(`course/search?name=${this.keyword}`)

      this.courses = result.data.message
    }
  }
}
</script>

<style lang="less" scoped>
  .search-container{
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .search-head{
    padding: 30rpx 0;
    background-color: #ffffff;
    display: flex;
  }
  .search-input{
    margin-left: 30rpx;
    margin-right: 30rpx;
    padding-left: 55rpx;
    width:100%;
    height:74rpx;
    background:rgba(243,243,243,1);
    opacity:1;
    border-radius:8px;
    font-size: 14px;
    flex:1;
  }
  .icon-search{
    position: absolute;
    left:40rpx;
    top:48rpx;
    width: 56rpx;
    height: 56rpx;
    color:#A8A8A8;
  }
  .search-button{
    margin-right: 30rpx;
    width:100rpx;
    height:74rpx;
    line-height: 74rpx;
    text-align: center;
    color: #FF951C;
  }
  .search-body{
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 32rpx;
    height: 100%;
  }
</style>
