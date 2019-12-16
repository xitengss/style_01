<template>
  <div class="base-box admin-home-box">
    <el-form :model="form" :rules="formRules" label-width="100px" ref="form">
      <el-steps direction="vertical" :active="active">
        <el-step title="轮播图(至多4张)">
          <section slot="description">
            <slides-img :imgList="form.slideshow" :num="4"></slides-img>
          </section>
        </el-step>
        <el-step title="研学线路推荐">
          <section slot="description">
            <el-form-item
              :label="`线路${list[tourIndex]}`"
              v-for="(tour, tourIndex) in form.studyBaseTour"
              :key="tourIndex"
            >
              <el-row :gutter="30">
                <el-col :span="10">
                  <el-select
                    v-model="tour.studyBaseId"
                    placeholder="请选择研学单元"
                    @change="loadTour(tour, tour.studyBaseId)"
                  >
                    <el-option
                      v-for="item in baseList"
                      :key="item.studyBaseId"
                      :label="item.studyBaseName"
                      :value="item.studyBaseId"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-select v-model="tour.studyTourId" placeholder="请选择研学路线" @change="active = 2">
                    <el-option
                      v-for="item in tour.tourList"
                      :key="item.studyTourId"
                      :label="item.studyTourName"
                      :value="item.studyTourId"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <span>
                    <i
                      class="study-icon-zengjia main-color"
                      v-if="(form.studyBaseTour.length - 1) === tourIndex"
                      @click="tourAdd"
                    ></i>
                    <i
                      class="study-icon-jianshao danger"
                      v-if="form.studyBaseTour.length !== 1"
                      @click="tourDel(tourIndex)"
                    ></i>
                  </span>
                </el-col>
              </el-row>
            </el-form-item>
          </section>
        </el-step>
        <el-step title="研学课程推荐">
          <section slot="description">
            <el-form-item
              :label="`课程${list[courseIndex]}`"
              v-for="(course, courseIndex) in form.studyBase"
              :key="courseIndex"
            >
              <el-row :gutter="30">
                <el-col :span="10">
                  <el-select
                    v-model="course.studyBaseId"
                    placeholder="请选择研学单元"
                    @change="loadCourse(course, course.studyBaseId)"
                  >
                    <el-option
                      v-for="item in baseList"
                      :key="item.studyBaseId"
                      :label="item.studyBaseName"
                      :value="item.studyBaseId"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-select
                    v-model="course.studyCourseId"
                    placeholder="请选择研学课程"
                    @change="active = 3"
                  >
                    <el-option
                      v-for="item in course.courseList"
                      :key="item.studyCourseId"
                      :label="item.studyCourseName"
                      :value="item.studyCourseId"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <span>
                    <i
                      class="study-icon-zengjia main-color"
                      v-if="(form.studyBase.length - 1) === courseIndex"
                      @click="courseAdd"
                    ></i>
                    <i
                      class="study-icon-jianshao danger"
                      v-if="form.studyBase.length !== 1"
                      @click="courseDel(courseIndex)"
                    ></i>
                  </span>
                </el-col>
              </el-row>
            </el-form-item>
          </section>
        </el-step>
        <el-step title="研学单元推荐">
          <section slot="description">
            <el-form-item
              :label="`单元${list[baseIndex]}`"
              v-for="(base, baseIndex) in form.studyBaseId"
              :key="baseIndex"
            >
              <el-row :gutter="30">
                <el-col :span="10">
                  <el-select v-model="base.studyBaseId" placeholder="请选择研学单元" @change="active = 4">
                    <el-option
                      v-for="item in baseList"
                      :key="item.studyBaseId"
                      :label="item.studyBaseName"
                      :value="item.studyBaseId"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <span>
                    <i
                      class="study-icon-zengjia main-color"
                      v-if="(form.studyBaseId.length - 1) === baseIndex"
                      @click="baseAdd"
                    ></i>
                    <i
                      class="study-icon-jianshao danger"
                      v-if="form.studyBaseId.length !== 1"
                      @click="baseDel(baseIndex)"
                    ></i>
                  </span>
                </el-col>
              </el-row>
            </el-form-item>
          </section>
        </el-step>
      </el-steps>
    </el-form>
    <el-button type="primary" @click="handleSave">发布</el-button>
    <el-button @click="handleBack">取消</el-button>
  </div>
</template>

<script>
import { post } from 'utils'
import { getMicHomepageUrl, getStudyBaseListUrl, getStudyBaseTourListUrl, getStudyBaseCourseListUrl, micHomepagePublishUrl } from 'api/admin'
import SlidesImg from './component/SlidesImg'
export default {
  name: 'adminHome',
  components: {
    SlidesImg
  },
  data () {
    return {
      active: 1,
      baseList: [],
      form: {
        slideshow: [],
        studyBaseTour: [{ studyBaseId: '', studyTourId: '', tourList: [] }],
        studyBase: [{ studyBaseId: '', studyCourseId: '', courseList: [] }],
        studyBaseId: [{ studyBaseId: '' }]
      },
      formRules: {},
      list: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    }
  },
  created () {
    this.loadData()
    this.loadBaseList()
  },
  methods: {
    async loadData () { // 请求微主页详情
      const { data } = await post(getMicHomepageUrl)
      console.log(data, 555)
      if (!data) {
        return
      }
      const { slideshow, studyBase, studyBaseCourse, studyBaseTour } = data
      for (let i = 0; i < studyBaseTour.length; i++) {
        studyBaseTour[i].tourList = await this.loadTour(studyBaseTour[i], studyBaseTour[i].studyBaseId)
      }
      for (let i = 0; i < studyBaseCourse.length; i++) {
        studyBaseCourse[i].courseList = await this.loadCourse(studyBaseCourse[i], studyBaseCourse[i].studyBaseId)
      }
      Object.assign(this.form, { slideshow, studyBaseId: studyBase, studyBase: studyBaseCourse, studyBaseTour })
    },
    async loadBaseList () { // 获取研学基地列表
      const { data } = await post(getStudyBaseListUrl)
      this.baseList = data
    },
    async loadTour (tour, studyBaseId) { // 获取研学基地下的研学团列表
      this.active = 2
      const { data } = await post(getStudyBaseTourListUrl, `studyBaseId=${studyBaseId}`)
      tour.tourList = data
      return data
    },
    async loadCourse (course, studyBaseId) { // 获取研学基地下的课程列表
      this.active = 3
      const { data } = await post(getStudyBaseCourseListUrl, `studyBaseId=${studyBaseId}`)
      course.courseList = data
      return data
    },
    async handleSave () { // 保存
      const slideshow = this.form.slideshow.map((item, index) => {
        const { pictureDescription, attachmentId, flag = index } = item
        return ({ pictureDescription, attachmentId, flag })
      })
      const studyBaseTour = this.form.studyBaseTour.map((item, index) => {
        const { studyBaseId, studyTourId, flag = index } = item
        return ({ studyBaseId, studyTourId, flag })
      })
      const studyBase = this.form.studyBase.map((item, index) => {
        const { studyBaseId, studyCourseId, flag = index } = item
        return ({ studyBaseId, studyCourseId, flag })
      })
      const studyBaseId = this.form.studyBaseId.map((item, index) => {
        const { studyBaseId, flag = index } = item
        return ({ studyBaseId, flag })
      })
      const params = { slideshow, studyBaseTour, studyBase, studyBaseId }
      const { resultMessage } = await post(micHomepagePublishUrl, params)
      this.$message({
        type: 'success',
        message: resultMessage,
        duration: 1500
      })
    },
    tourAdd () { // 研学路线添加
      const item = this.form.studyBaseTour[this.form.studyBaseTour.length - 1]
      if (!item.studyBaseId || !item.studyTourId) {
        this.$message({
          type: 'warning',
          message: '请先选择本次研学路线推荐'
        })
        return
      }
      this.form.studyBaseTour.push({ studyBaseId: '', studyTourId: '', tourList: [] })
    },
    tourDel (index) { // 研学路线删除
      this.form.studyBaseTour.splice(index, 1)
    },
    courseAdd () { // 研学课程添加
      const item = this.form.studyBase[this.form.studyBase.length - 1]
      if (!item.studyBaseId || !item.studyCourseId) {
        this.$message({
          type: 'warning',
          message: '请先选择本次研学课程推荐'
        })
        return
      }
      this.form.studyBase.push({ studyBaseId: '', studyCourseId: '', courseList: [] })
    },
    courseDel (index) { // 研学课程删除
      this.form.studyBase.splice(index, 1)
    },
    baseAdd () { // 研学单元添加
      const item = this.form.studyBaseId[this.form.studyBaseId.length - 1]
      if (!item.studyBaseId) {
        this.$message({
          type: 'warning',
          message: '请先选择本次研学单元推荐'
        })
        return
      }
      this.form.studyBaseId.push({ studyBaseId: '' })
    },
    baseDel (index) { // 研学单元删除
      this.form.studyBaseId.splice(index, 1)
    },
    handleBack () { // 取消
      this.$confirm('此操作放弃已修改的内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.back()
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss">
.admin-home-box {
  .el-select {
    width: 100%;
  }
}
</style>
