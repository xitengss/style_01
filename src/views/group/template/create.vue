<template>
  <div class="base-box group-template-create-box">
    <el-form :model="form" :rules="formRules" label-width="100px" ref="form">
      <el-steps direction="vertical" :active="active">
        <el-step title="基本信息">
          <section slot="description">
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="模版名称：" prop="name">
                  <el-input
                    v-model="form.name"
                    :maxlength="16"
                    placeholder="请输入模版名称"
                    @focus="active = 1"
                  ></el-input>
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
                    prefix-icon="study-icon-renminbi"
                    v-model.number="form.price"
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
        <el-step title="宣传介绍">
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
                    :class="['cover-upload', form.imgList.length ? 'hidden' : '']"
                  >
                    <div>
                      <i class="study-icon-ic_join_dialing_norm"></i>
                      <br>
                      <span class="grey-color-l">请上传（750像素（宽）* 280像素（高））不大于500k的封面图片</span>
                    </div>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="介绍信息：" prop="content">
                  <el-input
                    :rows="7"
                    type="textarea"
                    v-model="form.content"
                    maxlength="100"
                    show-word-limit
                    placeholder="内容用于生成海报，建议输入50-90个字"
                    @focus="active = 2"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </section>
        </el-step>
        <el-step title="路线安排">
          <section slot="description">
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="行程天数：" prop="journeyNum">
                  <el-input-number
                    :min="1"
                    :max="50"
                    v-model="form.journeyNum"
                    controls-position="right"
                    placeholder="请输入行程天数"
                    @focus="active = 3"
                    @change="journeyChange"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-tabs v-model="activeName" class="vw-70">
              <el-tab-pane
                v-for="item in form.journeyNum"
                :key="item"
                :label="`第${item}天`"
                :name="`${item.toString()}`"
              >
                <journey :journey="form.journeyVOList[item - 1]"></journey>
              </el-tab-pane>
            </el-tabs>
          </section>
        </el-step>
      </el-steps>
    </el-form>
    <el-button type="primary" @click="handleSave">取消</el-button>
    <el-button @click="handleBack">发布</el-button>
  </div>
</template>

<script>
import { uploadUrl } from 'api'
import { templateSaveUrl, templateUpdateUrl, templateDetailUrl, journey } from 'api/group'
import { post } from 'utils'
import { allPhoneValidate, isPhotoRegexp, prcieValidate } from 'utils/validate'
import { mapGetters } from 'vuex'
import Journey from '../components/Journey'
export default {
  name: 'groupTtemplateCreate',
  components: {
    Journey
  },
  data () {
    return {
      active: 1,
      activeName: '1',
      form: {
        name: '',
        price: '',
        preferentialPrice: '',
        content: '',
        address: '',
        phone: '',
        journeyNum: 1,
        coverId: '',
        imgList: [{ name: '封面图', url: require('assets/img/img_research.png') }],
        journeyVOList: [JSON.parse(JSON.stringify(journey))]
      },
      formRules: {
        name: [
          { required: true, message: '模版名称不能为空', trigger: 'blur' }
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
        content: [
          { required: true, message: '介绍信息不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '联系地址不能为空', trigger: 'blur' }
        ],
        journeyNum: [
          { required: true, message: '行程天数不能为空', trigger: 'blur' }
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
    this.loadData()
  },
  methods: {
    async loadData () { // 加载数据
      const { id } = this.$route.query
      if (id) {
        const { data } = await post(templateDetailUrl, `id=${id}`)
        console.log(data, 66)
        this.active = 3
        data.imgList = data.viewPath ? [{ url: data.viewPath }] : this.form.imgList
        data.journeyVOList && data.journeyVOList.map(journeyItem => {
          journeyItem.detailsVOList && journeyItem.detailsVOList.map(detail => {
            detail.attachmentVOList && detail.attachmentVOList.map(att => {
              att.url = att.viewPath
            })
            detail.attachmentIds = detail.attachmentVOList.map(att => att.attachmentId)
          })
          // 补全上下午
          if (journeyItem.detailsVOList.length !== 3) {
            let list = JSON.parse(JSON.stringify(journey.detailsVOList))
            list.map(item => {
              journeyItem.detailsVOList.map(detail => {
                if (item.dateType === detail.dateType) {
                  Object.assign(item, detail)
                }
              })
            })
            journeyItem.detailsVOList = list
          }
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
    handleSave () { // 保存模版
      this.$refs.form.validate(async val => {
        if (val) {
          const { studyTourTemplateId, name, price, preferentialPrice, content, address, phone, journeyNum, coverId, journeyVOList } = this.form
          let url = templateSaveUrl
          let journeyParametersRequestList = this.filterJourneyParame(journeyVOList)
          let params = { name, price, preferentialPrice, content, address, phone, journeyNum, coverId, journeyParametersRequestList }
          if (studyTourTemplateId) {
            url = templateUpdateUrl
            Object.assign(params, { studyTourTemplateId })
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
    filterJourneyParame (journeyVOList) { // 过滤没必要参数
      let arr = journeyVOList.map(journey => {
        let detailsParametersRequestList = journey.detailsVOList.map(detail => {
          let courseParametersRequestList = detail.courseVOList.filter(course => course.studyCourseId && course.time).map(course => {
            return ({
              studyCourseId: course.studyCourseId,
              time: course.time
            })
          })
          return ({
            title: detail.title,
            dateType: detail.dateType,
            attachmentIds: detail.attachmentIds,
            courseParametersRequestList
          })
        }).filter(detail => detail.title && detail.courseParametersRequestList.length)
        return ({
          date: journey.date,
          detailsParametersRequestList
        })
      })
      return arr
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
    },
    journeyChange (val) { // 行程天数变化
      this.active = 3
      let length = this.form.journeyVOList.length
      let difLength = Math.abs(length - val)
      if (val < length) {
        this.form.journeyVOList.splice(-1, difLength)
        this.activeName = '1'
      } else {
        for (let i = 0; i < difLength; i++) {
          this.form.journeyVOList.push(JSON.parse(JSON.stringify(journey)))
        }
      }
    }
  }
}
</script>
