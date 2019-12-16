<template>
  <div class="base-box base-home-box">
    <el-form :model="form" :rules="formRules" label-width="100px" ref="form">
      <el-steps direction="vertical" :active="active">
        <el-step title="基本信息">
          <section slot="description">
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="基地名称：" prop="studyBaseName">
                  <el-input
                    v-model="form.studyBaseName"
                    :maxlength="16"
                    placeholder="请输入基地名称"
                    @focus="active = 1"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="联系方式：" prop="phone">
                  <el-input
                    v-model="form.phone"
                    :maxlength="12"
                    placeholder="请输入联系方式"
                    @focus="active = 1"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="商务合作：" prop="email">
                  <el-input
                    v-model="form.email"
                    :maxlength="32"
                    placeholder="请输入商务合作邮箱"
                    @focus="active = 1"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="总部地址：" prop="address">
                  <el-input
                    v-model="form.address"
                    :maxlength="32"
                    placeholder="请输入总部地址"
                    @focus="active = 1"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </section>
        </el-step>
        <el-step title="轮播图(至多4张)">
          <section slot="description">
            <slides-img :imgList="form.slideshow" :num="4"></slides-img>
          </section>
        </el-step>
        <el-step title="列表缩略图">
          <section slot="description">
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label-width="0">
                  <el-upload
                    :limit="1"
                    :headers="headers"
                    :file-list="form.imgList"
                    :action="imgUploadUrl"
                    list-type="picture-card"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload"
                    :http-request="uploadSectionFile"
                    :class="['single-upload', form.imgList.length ? 'hidden' : '']"
                  >
                    <div>
                      <i class="study-icon-ic_join_dialing_norm"></i>
                      <br />
                      <!-- <span class="grey-color-l">请上传（750像素（宽）* 280像素（高））不大于500k的封面图片</span> -->
                    </div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </section>
        </el-step>
        <el-step title="研学课程推荐">
          <section slot="description">
            <slides-img :imgList="form.slideshow" :num="4"></slides-img>
          </section>
        </el-step>
        <el-step title="研学单元介绍">
          <section slot="description">
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label-width="0" prop="studyBaseInfo">
                  <el-input
                    :rows="7"
                    type="textarea"
                    v-model="form.studyBaseInfo"
                    placeholder="请输入研学单元介绍"
                    @focus="active = 5"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </section>
        </el-step>
      </el-steps>
    </el-form>
    <el-button type="primary" @click="handleSave">保存</el-button>
    <el-button @click="handleBack">取消</el-button>
  </div>
</template>

<script>
import { uploadUrl } from 'api'
import { post } from 'utils'
// import { getBaseHomepageUrl, baseHomepagePublishUrl } from 'api/admin'
import { baseHomepagePublishUrl } from 'api/admin'
import { allPhoneValidate, isPhotoRegexp, emailValidate } from 'utils/validate'
import { mapGetters } from 'vuex'
import SlidesImg from './component/SlidesImg'
export default {
  name: 'baseHome',
  components: {
    SlidesImg
  },
  data () {
    return {
      active: 1,
      courseList: [],
      form: {
        studyBaseName: '',
        phone: '',
        email: '',
        address: '',
        slideshow: [],
        imgList: [],
        studyBaseInfo: ''
      },
      formRules: {
        studyBaseName: [
          { required: true, message: '基地名称不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' },
          { validator: allPhoneValidate, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '商务合作邮箱不能为空', trigger: 'blur' },
          { validator: emailValidate, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '总部地址不能为空', trigger: 'blur' }
        ],
        studyBaseInfo: [
          { required: true, message: '请输入研学单元介绍', trigger: 'blur' }
        ]
      },
      list: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    }
  },
  computed: {
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
  created () {
    this.loadData()
    this.loadCourseList()
  },
  methods: {
    async loadData () { // 请求基地介绍详情
      // const { data } = await post(getBaseHomepageUrl)
      // if (!data) {
      //   return
      // }
      // console.log(data)
    },
    async loadCourseList () {

    },
    async uploadSectionFile (param) { // 自定义上传图片方法
      const reParams = {
        file: param.file
      }
      const res = await post(uploadUrl, reParams)
      param.onSuccess(res)
    },
    handleSuccess (res, file, fileList) { // 图片上传成功
      if (!res) {
        return
      }
      const { data } = res
      this.form.attachmentId = data.id
      this.form.imgList = fileList
    },
    beforeUpload (file) { // 图片上传前
      this.active = 3
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
    handleRemove (file, fileList) { // 删除图片
      this.active = 3
      this.form.attachmentId = ''
      this.form.imgList = fileList
    },
    handleSave () { // 保存课程
      this.$refs.form.validate(async val => {
        if (val) {
          const { studyBaseName, phone, email, address, attachmentId, studyBaseInfo, slideshow: tempSlideshow, studyBaseCourse: tempStudyBaseCourse } = this.form
          const slideshow = tempSlideshow.map((item, index) => {
            const { pictureDescription, attachmentId, flag = index } = item
            return ({ pictureDescription, attachmentId, flag })
          })
          const studyBaseCourse = tempStudyBaseCourse.map((item, index) => {
            const { studyCourseId, flag = index } = item
            return ({ studyCourseId, flag })
          })
          const params = { studyBaseName, phone, email, address, attachmentId, studyBaseInfo, slideshow, studyBaseCourse }
          const { resultMessage } = await post(baseHomepagePublishUrl, params)
          this.$message({
            type: 'success',
            message: resultMessage,
            duration: 1500
          })
        }
      })
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
