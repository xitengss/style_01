<template>
  <div class="base-box">
    <div class="header" v-if="!id">
      <el-button type="primary" @click="templateHandleSelect">选择模版</el-button>
    </div>
    <el-form :model="form" :rules="formRules" label-width="110px" ref="form">
      <el-steps direction="vertical" :active="active">
        <el-step title="基本信息">
          <section slot="description">
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="研学团名称：" prop="name">
                  <el-input
                    v-model="form.name"
                    :maxlength="16"
                    placeholder="请输入研学团名称"
                    @focus="active = 1"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="联系人：" prop="relationPeople">
                  <el-input
                    v-model="form.relationPeople"
                    :maxlength="16"
                    @focus="active = 1"
                    placeholder="请输入联系人"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="联系电话：" prop="relationPhone">
                  <el-input
                    v-model="form.relationPhone"
                    :maxlength="12"
                    placeholder="请输入联系电话"
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
        <el-step title="接团老师">
          <section slot="description">
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="接团老师：" prop="teacherIds">
                  <el-select
                    multiple
                    remote
                    filterable
                    class="w-100"
                    :loading="searchLoading"
                    v-model="form.teacherIds"
                    :remote-method="teacherSearch"
                    placeholder="请输入关键词搜索并选择团老师"
                    @change="active = 3"
                    @focus="active = 3"
                  >
                    <el-option
                      v-for="item in teacherList"
                      :key="item.teacherId"
                      :label="item.name"
                      :value="item.teacherId"
                    ></el-option>
                  <br />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </section>
        </el-step>
        <el-step title="路线安排">
          <section slot="description">
            <el-link
              disabled
              icon="el-icon-warning-outline"
              :underline="false"
            >入住酒店时每个研学人员都要办理入住登记，否则无法申请该研学人员的补贴。</el-link>
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="活动日期：" prop="endDate">
                  <el-date-picker
                    class="w-100"
                    type="daterange"
                    v-model="timeModel"
                    range-separator="至"
                    format="yyyy-MM-dd"
                    value-format="timestamp"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="timeChange"
                    @focus="active = 4"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="住宿：" prop="grogshop">
                  <el-input
                    :maxlength="32"
                    v-model="form.grogshop"
                    placeholder="请输入住宿"
                    @focus="active = 4"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-tabs v-model="activeName" class="vw-70">
                <el-tab-pane
                  v-for="(item, index) in dayList"
                  :key="item"
                  :label="item"
                  :name="item"
                >
                  <journey :journey="form.journeyVOList[index]"></journey>
                </el-tab-pane>
              </el-tabs>
            </el-row>
          </section>
        </el-step>
      </el-steps>
    </el-form>
    <el-button :loading="saveFlag" type="primary" @click="handleSave(1)">提交</el-button>
    <el-button :loading="draftFlag" @click="handleSave(0)">保存成草稿</el-button>
    <el-button @click="handleBack">取消</el-button>

    <!-- 选择模版 -->
    <el-dialog
      title="选择模版"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="520px"
    >
      <div class="content">
        <el-form label-width="100px">
          <el-form-item label="模版名称">
            <el-select v-model="templateModel" placeholder="请选择模版名称">
              <el-option
                :label="item.name"
                v-for="item in templateList"
                :key="item.studyTourTemplateId"
                :value="item.studyTourTemplateId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="templateHandleSave" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadUrl } from 'api'
import { tourDetailUrl, tourUpdateUrl, tourSaveUrl, listTeacherUrl, listTemplateUrl, templateDetailUrl, journey } from 'api/group'
import { post, transformDate, formatDate } from 'utils'
import { allPhoneValidate, isPhotoRegexp, prcieValidate } from 'utils/validate'
import { mapGetters } from 'vuex'
import Journey from '../components/Journey'
export default {
  name: 'groupTourCreate',
  components: {
    Journey
  },
  data () {
    return {
      id: '',
      active: 1,
      activeName: transformDate('today'),
      dayList: [transformDate('today')],
      timeModel: [new Date().getTime(), new Date().getTime()],
      searchLoading: false,
      teacherList: [],
      templateModel: '',
      templateList: [],
      dialogVisible: false,
      saveFlag: false,
      draftFlag: false,
      form: {
        name: '',
        relationPeople: '',
        relationPhone: '',
        price: '',
        preferentialPrice: '',
        content: '',
        address: '',
        phone: '',
        journeyNum: 1,
        coverId: '',
        startDate: new Date().getTime(),
        endDate: new Date().getTime(),
        grogshop: '',
        teacherIds: [],
        journeyParametersRequestList: [],
        imgList: [{ name: '封面图', url: require('assets/img/img_research.png') }],
        journeyVOList: [Object.assign(JSON.parse(JSON.stringify(journey)), { date: new Date().getTime() })]
      },
      formRules: {
        name: [
          { required: true, message: '研学团名称不能为空', trigger: 'blur' }
        ],
        relationPeople: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        relationPhone: [
          { required: true, message: '联系人号码不能为空', trigger: 'blur' },
          { validator: allPhoneValidate, trigger: 'blur' }
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
        ],
        endDate: [
          { required: true, message: '活动日期不能为空', trigger: 'blur' }
        ],
        grogshop: [
          { required: true, message: '住宿不能为空', trigger: 'blur' }
        ],
        teacherIds: [
          { required: true, message: '接团老师不能为空', trigger: 'blur' }
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
    this.teacherSearch()
  },
  methods: {
    async teacherSearch (keyword = '') { // 接团老师查询
      this.searchLoading = true
      const { data } = await post(listTeacherUrl, `name=${keyword}`)
      this.searchLoading = false
      this.teacherList = data
    },
    async loadData () { // 加载数据
      const { id } = this.$route.query
      if (id) {
        this.id = id
        const { data } = await post(tourDetailUrl, `id=${id}`)
        this.active = 4
        data.imgList = data.viewPath ? [{ url: data.viewPath }] : this.form.imgList
        data.teacherIds = data.teacherVOList.map(item => item.teacherId)
        this.initJourneyVoList(data.journeyVOList)
        Object.assign(this.form, data)
        this.timeModel = [data.startDate, data.endDate]
        this.journeyChange()
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
    handleSave (status) { // 保存
      this.$refs.form.validate(async val => {
        if (val) {
          const { studyTourId, name, relationPeople, relationPhone, price, preferentialPrice, content, address, phone, coverId, journeyVOList, startDate, endDate, grogshop, teacherIds } = this.form
          let url = tourSaveUrl
          let journeyParametersRequestList = this.filterJourneyParame(journeyVOList)
          let params = { status, name, relationPeople, relationPhone, price, preferentialPrice, content, address, phone, coverId, journeyParametersRequestList, startDate, endDate, grogshop, teacherIds }
          if (studyTourId) {
            url = tourUpdateUrl
            Object.assign(params, { studyTourId })
          }
          status === 1 ? this.saveFlag = true : this.draftFlag = true
          const { resultMessage } = await post(url, params)
          status === 1 ? this.saveFlag = false : this.draftFlag = false
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
    timeChange (val) { // 活动日期变化
      this.active = 3
      if (!val) {
        this.timeModel = [new Date().getTime(), new Date().getTime()]
        this.form.startDate = new Date().getTime()
        this.form.endDate = new Date().getTime()
        return
      }
      this.form.startDate = val[0]
      this.form.endDate = val[1]
      this.journeyChange()
    },
    journeyChange () { // 行程天数变化
      let diffDay = (this.form.endDate - this.form.startDate) / 86400000 + 1
      let dayList = []
      for (let i = 0; i < diffDay; i++) {
        dayList.push(formatDate(new Date(this.form.startDate + 3600 * 1000 * 24 * i), 'yyyy-MM-dd'))
      }
      this.dayList = dayList
      let length = this.form.journeyVOList.length
      let difLength = Math.abs(length - diffDay)
      this.activeName = formatDate(new Date(this.form.startDate), 'yyyy-MM-dd')
      if (diffDay < length) {
        this.form.journeyVOList.splice(-1, difLength)
      } else {
        for (let i = 0; i < difLength; i++) {
          this.form.journeyVOList.push(JSON.parse(JSON.stringify(journey)))
        }
      }
      this.form.journeyVOList.map((item, i) => {
        item.date = this.form.startDate + 3600 * 1000 * 24 * i
      })
    },
    async templateHandleSelect () { // 获取模版
      this.dialogVisible = true
      const { data } = await post(listTemplateUrl)
      this.templateList = data
    },
    async templateHandleSave () { // 选择模版后回调
      this.dialogVisible = false
      if (!this.templateModel) {
        return
      }
      const { data } = await post(templateDetailUrl, `id=${this.templateModel}`)
      this.active = 3
      data.imgList = [{ url: data.viewPath }]
      this.initJourneyVoList(data.journeyVOList)
      let startDate = new Date().getTime()
      let endDate = startDate + 3600 * 1000 * 24 * (data.journeyNum - 1)
      this.form.startDate = startDate
      this.form.endDate = endDate
      Object.assign(this.form, data)
      this.timeModel = [startDate, endDate]
      this.journeyChange()
    },
    initJourneyVoList (journeyVOList) { // 还原编辑数据
      journeyVOList.map(journeyItem => {
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
    }
  }
}
</script>
