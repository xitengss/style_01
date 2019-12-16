<template>
  <div class="base-box base-course-create-box">
    <el-form :model="form" :rules="formRules" label-width="100px" ref="form">
      <el-steps direction="vertical" :active="active">
        <el-step title="基本信息">
          <section slot="description">
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="课程名称：" prop="name">
                  <el-select v-model="form.name" placeholder="请选择课程名称" class="w-100">
                    <el-option v-for="item in courseList" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="课程状态：" prop="status">
                  <el-radio-group v-model="form.status" @change="active = 1">
                    <el-radio :label="1">有效</el-radio>
                    <el-radio :label="0">无效</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="课程时长：" prop="duration">
                  <el-input
                    type="number"
                    :maxlength="4"
                    placeholder="请输入课程时长"
                    v-model.number="form.duration"
                    @focus="active = 1"
                  >
                    <template slot="append">分钟</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="优惠价：" prop="preferentialPrice">
                  <el-input
                    type="number"
                    :maxlength="16"
                    placeholder="请输入优惠价"
                    prefix-icon="study-icon-renminbi"
                    v-model.number="form.preferentialPrice"
                    @focus="active = 1"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="咨询电话：" prop="phone">
                  <el-input
                    v-model="form.phone"
                    :maxlength="12"
                    placeholder="请输入咨询电话"
                    @focus="active = 1"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="原价：" prop="price">
                  <el-input
                    type="number"
                    :maxlength="16"
                    placeholder="请输入原价"
                    v-model.number="form.price"
                    prefix-icon="study-icon-renminbi"
                    @focus="active = 1"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="联系地址：" prop="address">
                  <el-input
                    v-model="form.address"
                    :maxlength="32"
                    placeholder="请输入联系地址"
                    @focus="active = 1"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </section>
        </el-step>
        <el-step title="上传封面">
          <section slot="description">
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="封面图片：">
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
        <el-step title="课程目标">
          <section slot="description">
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="课程目标：" prop="target">
                  <el-input
                    :rows="7"
                    type="textarea"
                    v-model="form.target"
                    placeholder="请输入课程目标"
                    @focus="active = 3"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </section>
        </el-step>
        <el-step title="研学内容">
          <section slot="description">
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="研学内容：" prop="content">
                  <el-input
                    :rows="7"
                    type="textarea"
                    v-model="form.content"
                    placeholder="请输入研学内容"
                    @focus="active = 4"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </section>
        </el-step>
        <el-step title="课程介绍">
          <section slot="description">
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="课程介绍：" prop="presentation">
                  <el-input
                    :rows="7"
                    type="textarea"
                    v-model="form.presentation"
                    placeholder="请输入课程介绍"
                    @focus="active = 5"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col>
                <el-form-item label="课程图片：">
                  <el-upload
                    :headers="headers"
                    :file-list="form.attachmentVOList"
                    :action="imgUploadUrl"
                    list-type="picture-card"
                    :on-remove="handleAttRemove"
                    :on-success="handleAttSuccess"
                    :before-upload="beforeUpload"
                    :http-request="uploadSectionFile"
                  >
                    <i class="study-icon-ic_join_dialing_norm"></i>
                  </el-upload>
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
import { courseSaveUrl, courseUpdateUrl, courseDetailUrl, getCreateCourseListUrl } from 'api/base'
import { post } from 'utils'
import { allPhoneValidate, isPhotoRegexp, prcieValidate } from 'utils/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'baseCourseCreate',
  data () {
    return {
      active: 1,
      courseList: [],
      form: {
        name: '',
        status: 1,
        price: '',
        preferentialPrice: '',
        content: '',
        address: '',
        phone: '',
        duration: '',
        coverId: '',
        target: '',
        presentation: '',
        imageIds: [],
        imgList: [{ name: '封面图', url: require('assets/img/img_course.png') }],
        attachmentVOList: []
      },
      formRules: {
        name: [
          { required: true, message: '课程名称不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '课程状态不能为空', trigger: 'blur' }
        ],
        duration: [
          { type: 'integer', min: 1, max: 9999, message: '课程时长应为1-9999的正整数', trigger: 'blur' },
          { required: true, message: '课程时长不能为空', trigger: 'blur' }
        ],
        price: [
          { type: 'number', min: 1, max: 999999999, message: '请输入值在1-999999999内' },
          { required: true, message: '原价不能为空', trigger: 'blur' },
          { validator: prcieValidate, trigger: 'blur' }
        ],
        preferentialPrice: [
          { type: 'number', min: 1, max: 999999999, message: '请输入值在1-999999999内' },
          { required: true, message: '优惠价不能为空', trigger: 'blur' },
          { validator: prcieValidate, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '咨询电话不能为空', trigger: 'blur' },
          { validator: allPhoneValidate, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '联系地址不能为空', trigger: 'blur' }
        ],
        target: [
          { required: true, message: '课程目标不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '研学内容不能为空', trigger: 'blur' }
        ],
        presentation: [
          { required: true, message: '课程介绍不能为空', trigger: 'blur' }
        ]
      }
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
    this.loadCourseList()
    this.loadData()
  },
  methods: {
    async loadCourseList () { // 加载课程名称
      const { data } = await post(getCreateCourseListUrl)
      this.courseList = data
    },
    async loadData () { // 加载数据
      const { id } = this.$route.query
      if (id) {
        const { data } = await post(courseDetailUrl, `id=${id}`)
        data.imgList = data.cover ? [{ url: data.cover }] : this.form.imgList
        data.attachmentVOList && data.attachmentVOList.map(item => {
          item.url = item.viewPath
          this.form.imageIds.push(item.attachmentId)
        })
        Object.assign(this.form, data)
      }
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
      this.form.coverId = data.id
      this.form.viewPath = data.viewPath
      this.form.imgList = fileList
    },
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
    handleRemove (file, fileList) { // 删除图片
      this.active = 2
      this.form.coverId = ''
      this.form.viewPath = ''
      this.form.imgList = fileList
    },
    handleAttRemove (file) { // 删除课程图片
      let index = this.form.imageIds.indexOf(file.attachmentId)
      if (index < 0) {
        return
      }
      this.form.imageIds.splice(index, 1)
    },
    handleAttSuccess (res) { // 上传课程图片
      const { data } = res
      this.form.imageIds.push(data.id)
    },
    handleSave () { // 保存课程
      this.$refs.form.validate(async val => {
        if (val) {
          const { studyCourseId, name, price, preferentialPrice, content, address, phone, status, coverId, duration, target, presentation, imageIds } = this.form
          let url = courseSaveUrl
          let params = { name, price, preferentialPrice, content, address, phone, status, coverId, duration, target, presentation, imageIds }
          if (studyCourseId) {
            url = courseUpdateUrl
            Object.assign(params, { studyCourseId })
          }
          const { resultMessage } = await post(url, params)
          this.$router.back()
          this.$message({
            type: 'success',
            message: resultMessage,
            duration: 1500
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请检查信息是否正确填写',
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
