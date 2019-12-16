<template>
  <el-row :gutter="30">
    <el-col :span="10" :xs="23" :sm="23" :md="19" :lg="10" :offset="1">
      <el-form-item label="研学课程：">
        <select-tree
          class="w-100"
          ref="planCourse"
          :value="course.course"
          :data="courseTree"
          placeholder="请选择课程"
          :defaultProps="treeProps"
          :selectedChange="treeChange"
          :singleCheckId="course.studyCourseId"
        ></select-tree>
      </el-form-item>
    </el-col>
    <el-col :span="10" :xs="21" :sm="21" :md="19" :lg="10" :offset="1">
      <el-form-item label="上课时间：">
        <el-time-picker
          is-range
          :clearable="false"
          arrow-control
          class="w-100"
          v-model="timeModel"
          range-separator="至"
          format="HH:mm"
          value-format="HH:mm"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          @change="timeChange"
        ></el-time-picker>
      </el-form-item>
    </el-col>
    <el-col :span="2" class="left-10">
      <el-form-item label-width="0">
        <span>
          <i class="study-icon-zengjia main-color" v-if="isShowAddBtn" @click="add"></i>
          <i class="study-icon-jianshao danger" v-if="isShowDelBtn" @click="del"></i>
        </span>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
import { getCourseTreeUrl } from 'api/base'
import { get } from 'utils'
import SelectTree from 'components/SelectTree'
export default {
  name: 'Course',
  components: {
    SelectTree
  },
  props: {
    course: {
      type: Object,
      required: true,
      default: () => ({
        studyCourseId: '',
        time: ''
      })
    },
    isShowAddBtn: {
      default: true
    },
    isShowDelBtn: {
      default: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      baseId: [],
      courseTree: [],
      timeModel: ['06:00', '20:00'],
      treeProps: {
        children: 'childrenList',
        label: 'name'
      }
    }
  },
  watch: {
    course (val) {
      let time = this.course.time
      if (time) {
        this.timeModel = time.split('-')
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () { // 初始化数据
      let time = this.course.time
      if (time) {
        this.timeModel = time.split('-')
      }
      this.courseSearch()
    },
    async courseSearch (keyword = '') { // 课程查询
      const { data } = await get(`${getCourseTreeUrl}`, `name=${keyword}`)
      this.baseId = data.map(item => item.id)
      this.courseTree = data
    },
    timeChange (val) {
      if (!val) {
        this.course.time = ''
        return
      }
      this.course.time = val.join('-')
    },
    treeChange (obj) {
      if (!obj) {
        return
      }
      if (this.baseId.includes(obj.id)) {
        this.$message({
          type: 'warning',
          message: `不能选择基地，请选择课程`,
          duration: 1500
        })
        this.$refs.planCourse.selVal = ''
        this.course.studyCourseId = ''
        return
      }
      this.course.studyCourseId = obj.id
    },
    add () { // 增加
      this.$emit('add')
    },
    del () { // 减少
      this.$emit('del', this.index)
    }
  }
}
</script>
