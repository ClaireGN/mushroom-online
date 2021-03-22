<template>
  <div class="weui-search-bar__box">
    <icon
      class="weui-icon-search_in-box"
      type="search"
      color="#ff8d44"
      size="14"
    ></icon>
    <div @click="goToSearch" class="weui-search-bar__input">
      <span>{{placeholder}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    placeholder:{
      type:String,
      default:'搜索'
    }
  },
  methods:{
    goToSearch(){
      wx.navigateTo({url: '/pages/search/main'})
    }
  }
}
</script>

<style lang="less" scoped>
@weuiSearchBarHeight: 28px;
.weui-icon-search_in-box {
  position: absolute;
  left: 8px;
  top: 7px;
}
.weui-search-bar__box {
  position: relative;
  padding-left: 30px;
  padding-right: 30px;
  width: 100%;
  box-sizing: border-box;
  z-index: 1;
  margin-bottom: 8px;
}
.weui-search-bar__input {
  height: @weuiSearchBarHeight;
  line-height: @weuiSearchBarHeight;
  font-size: 14px;
  color: #999;
}
</style>
