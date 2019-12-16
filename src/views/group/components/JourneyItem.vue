<template>
  <div>
    <el-form :model="journeyItem" label-width="100px">
      <el-row :gutter="30">
        <el-col :span="1">
          <el-form-item :label="title" class="font-w-600" label-width="60px"></el-form-item>
        </el-col>
        <el-col :span="10" :xs="23" :sm="23" :md="19" :lg="10">
          <el-form-item label="活动主题：">
            <el-input v-model="journeyItem.title" placeholder="请输入活动主题" :maxlength="32"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <course
        :key="courseIndex"
        :course="course"
        :index="courseIndex"
        :isShowAddBtn="(journeyItem.courseVOList.length -1) === courseIndex"
        :isShowDelBtn="journeyItem.courseVOList.length !== 1"
        v-for="(course, courseIndex) in journeyItem.courseVOList"
        @add="add"
        @del="del"
      />
      <el-row>
        <el-col :offset="1">
          <el-form-item>
            <el-upload
              :headers="headers"
              :action="imgUploadUrl"
              list-type="picture-card"
              :on-remove="handleAttRemove"
              :on-success="handleAttSuccess"
              :before-upload="beforeUpload"
              :http-request="uploadSectionFile"
              :file-list="journeyItem.attachmentVOList"
            >
              <i class="study-icon-ic_join_dialing_norm"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { uploadUrl } from 'api'
import { post } from 'utils'
import { isPhotoRegexp } from 'utils/validate'
import { mapGetters } from 'vuex'
import Course from './Course'
export default {
  name: 'JourneyItem',
  components: {
    Course
  },
  props: {
    journeyItem: {
      type: Object,
      required: true,
      default: () => ({
        courseVOList: [],
        attachmentIds: [],
        attachmentVOList: []
      })
    }
  },
  data () {
    return {
      titleList: ['', '上午', '下午', '晚上']
    }
  },
  computed: {
    title () {
      return this.titleList[this.journeyItem.dateType]
    },
    imgUploadUrl () {
      return uploadUrl
    },
    headers () {
      return {
        token: this.token
      }
    },
    ...mapGetters([
      'token'
    ])
  },
  methods: {
    beforeUpload (file) { // 图片上传前
      this.active = 2
      const isphoto = isPhotoRegexp.test(file.type)
      const isLt500k = file.size / 1024 < 500
      if (!isphoto) {
        this.$message.error('上传图片只能是jpg和png格式!')
        return false
      }
      if (!isLt500k) {
        this.$message.error('上传图片大小不能超过 500k!')
      }
      return isphoto && isLt500k
    },
    handleAttRemove (file) { // 删除课程图片
      let index = this.journeyItem.attachmentIds.indexOf(file.attachmentId)
      if (index < 0) {
        return
      }
      this.journeyItem.attachmentIds.splice(index, 1)
    },
    async uploadSectionFile (param) { // 自定义上传图片方法
      const reParams = {
        file: param.file
      }
      const res = await post(uploadUrl, reParams)
      param.onSuccess(res)
    },
    handleAttSuccess (res) { // 上传课程图片
      if (!res) {
        return
      }
      const { data } = res
      this.journeyItem.attachmentIds.push(data.id)
    },
    add () {
      this.journeyItem.courseVOList.push({ studyCourseId: '', timeModel: [] })
    },
    del (index) {
      this.journeyItem.courseVOList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
</style>
