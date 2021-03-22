<template>
  <div>
    <course-list :courses="courses"/>
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
      courses:[] // 课程列表
    }
  },
  onLoad(){
    // 获取课程列表数据
    this.getCourseListData()
  },
  methods:{
    async getCourseListData(){
      const result = await this.$axios.get('course/list')

      this.courses = result.data.message
    }
  }
}
</script>

<style>

</style>
