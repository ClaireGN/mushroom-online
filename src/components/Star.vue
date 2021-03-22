<template>
  <div class="container">
    <div class="star-bg">
      <img v-for="item in 5" :key="item" src="/static/images/star_empty@2x.png" alt="">
    </div>
    <div class="star">
      <img v-for="item in score" :key="item" src="/static/images/star_fill@2x.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  props:{
    score:{
      type:Number,
      default:0
    }
  }
}
</script>

<style lang="less" scoped>
.container{
  position: relative;
}
.star,.star-bg{
  float: left;
  display: flex;
  height: 50rpx;
  align-items: center;
  img{
    width:38rpx;
    height: 36rpx;;
  }
}
.star{
  position: absolute;
  top:0;
  left:0;
}
</style>

