<template>
  <div class="base-box group-declare-create-box">
    <h2>
      <i class="study-icon-shu bg-icon"></i>
      {{form.studyName}}
    </h2>
    <div class="base-content left-20 h-30">
      i研学：
      <span class="grey-color">{{form.baseAndTourName}}</span>
      <el-divider direction="vertical"></el-divider>团员人数：
      <span class="grey-color">{{form.countApply}}人</span>
    </div>
    <el-form :model="form" :rules="formRules" label-width="100px" ref="form">
      <el-steps direction="vertical" :active="active">
        <el-step title="基本信息">
          <section slot="description">
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="申报方：" prop="title">
                  <el-input
                    :maxlength="32"
                    placeholder="请输入申报方"
                    v-model="form.title"
                    @focus="active = 1"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="联系人：" prop="name">
                  <el-input
                    v-model="form.name"
                    :maxlength="16"
                    placeholder="请输入联系人"
                    @focus="active = 1"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="申报金额：" prop="sum">
                  <el-input
                    type="number"
                    :maxlength="16"
                    placeholder="请输入申报金额"
                    prefix-icon="study-icon-renminbi"
                    v-model.number="form.sum"
                    @focus="active = 1"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :xs="24" :sm="24" :md="20" :lg="11">
                <el-form-item label="联系电话：" prop="phone">
                  <el-input
                    v-model="form.phone"
                    :maxlength="12"
                    placeholder="请输入联系电话"
                    @focus="active = 1"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </section>
        </el-step>
        <el-step title="往返交通票据或证明">
          <section slot="description">
            <el-link
              disabled
              :underline="false"
            >往返交通票据或证明（大巴车除外），如航空公司的电子客票，船务公司出具的船票证明等，如无法提供车船票据证明，可提供双方协议和账目往来证明作为依据</el-link>
            <el-form-item label-width="0px" class="margin-10">
              <el-upload
                :headers="headers"
                :action="imgUploadUrl"
                list-type="picture-card"
                :on-remove="trafficHandleRemove"
                :on-success="trafficHandleSuccess"
                :before-upload="beforeUpload"
                :file-list="form.trafficList"
                :http-request="uploadSectionFile"
              >
                <i class="study-icon-ic_join_dialing_norm"></i>
              </el-upload>
            </el-form-item>
          </section>
        </el-step>
        <el-step title="保险单复印件">
          <section slot="description">
            <el-link disabled :underline="false">i研学或机构为团员购买的保险单据复印件</el-link>
            <el-form-item label-width="0px" class="margin-10">
              <el-upload
                :headers="headers"
                :action="imgUploadUrl"
                list-type="picture-card"
                :on-remove="insuranceHandleRemove"
                :on-success="insuranceHandleSuccess"
                :before-upload="beforeUpload"
                :file-list="form.insuranceList"
                :http-request="uploadSectionFile"
              >
                <i class="study-icon-ic_join_dialing_norm"></i>
              </el-upload>
            </el-form-item>
          </section>
        </el-step>
        <el-step title="发票">
          <section slot="description">
            <el-link disabled :underline="false">受委托旅行社向集美区文体广电出版旅游局开具申请奖励的有效发票</el-link>
            <el-form-item label-width="0px" class="margin-10">
              <el-upload
                :headers="headers"
                :action="imgUploadUrl"
                list-type="picture-card"
                :on-remove="invoiceHandleRemove"
                :on-success="invoiceHandleSuccess"
                :before-upload="beforeUpload"
                :file-list="form.invoiceList"
                :http-request="uploadSectionFile"
              >
                <i class="study-icon-ic_join_dialing_norm"></i>
              </el-upload>
            </el-form-item>
          </section>
        </el-step>
        <el-step title="收据">
          <section slot="description">
            <el-link disabled :underline="false">接待对台研学旅行的集美辖区院校、基地和景区提交申请报告、与申请奖励金额相应的收据</el-link>
            <el-form-item label-width="0px" class="margin-10">
              <el-upload
                :headers="headers"
                :action="imgUploadUrl"
                list-type="picture-card"
                :on-remove="receiptHandleRemove"
                :on-success="receiptHandleSuccess"
                :before-upload="beforeUpload"
                :file-list="form.receiptList"
                :http-request="uploadSectionFile"
              >
                <i class="study-icon-ic_join_dialing_norm"></i>
              </el-upload>
            </el-form-item>
          </section>
        </el-step>
      </el-steps>
    </el-form>
    <el-button type="primary" @click="handleSave(1)">提交</el-button>
    <el-button @click="handleSave(0)">保存成草稿箱</el-button>
    <el-button @click="handleBack">取消</el-button>
  </div>
</template>

<script>
import { uploadUrl } from 'api'
import { declareDetailUrl, declareUpdateUrl } from 'api/group'
import { post } from 'utils'
import { allPhoneValidate, isPhotoRegexp, prcieValidate } from 'utils/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'groupDeclareCreate',
  data () {
    return {
      active: 1,
      form: {
        title: '',
        name: '',
        sum: '',
        phone: ''
      },
      formRules: {
        title: [
          { required: true, message: '申报方不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        sum: [
          { type: 'number', min: 1, max: 999999999, message: '请输入值在1-999999999内' },
          { required: true, message: '申报金额不能为空', trigger: 'blur' },
          { validator: prcieValidate, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { validator: allPhoneValidate, trigger: 'blur' }
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
        const { data } = await post(declareDetailUrl, `id=${id}`)
        this.active = data.title ? 5 : 1
        data.trafficIds = data.trafficList.map(item => {
          item.url = item.viewPath
          return item.attachmentId
        })
        data.insuranceIds = data.insuranceList.map(item => {
          item.url = item.viewPath
          return item.attachmentId
        })
        data.invoiceIds = data.invoiceList.map(item => {
          item.url = item.viewPath
          return item.attachmentId
        })
        data.receiptIds = data.receiptList.map(item => {
          item.url = item.viewPath
          return item.attachmentId
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
    trafficHandleSuccess (res, file) { // 往返交通票据图片上传成功
      if (!res) {
        return
      }
      const { data } = res
      this.form.trafficIds.push(data.id)
    },
    trafficHandleRemove (file) { // 往返交通票据删除图片
      this.active = 2
      let index = this.form.trafficIds.indexOf(file.attachmentId)
      if (index < 0) {
        return
      }
      this.form.trafficIds.splice(index, 1)
    },
    insuranceHandleSuccess (res, file) { // 保险单复印件图片上传成功
      if (!res) {
        return
      }
      const { data } = res
      this.form.insuranceIds.push(data.id)
    },
    insuranceHandleRemove (file) { // 保险单复印件删除图片
      this.active = 3
      let index = this.form.insuranceIds.indexOf(file.attachmentId)
      if (index < 0) {
        return
      }
      this.form.insuranceIds.splice(index, 1)
    },
    invoiceHandleSuccess (res, file) { // 发票图片上传成功
      if (!res) {
        return
      }
      const { data } = res
      this.form.invoiceIds.push(data.id)
    },
    invoiceHandleRemove (file) { // 发票删除图片
      this.active = 4
      let index = this.form.invoiceIds.indexOf(file.attachmentId)
      if (index < 0) {
        return
      }
      this.form.invoiceIds.splice(index, 1)
    },
    receiptHandleSuccess (res, file) { // 收据图片上传成功
      if (!res) {
        return
      }
      const { data } = res
      this.form.receiptIds.push(data.id)
    },
    receiptHandleRemove (file) { // 收据删除图片
      this.active = 5
      let index = this.form.receiptIds.indexOf(file.attachmentId)
      if (index < 0) {
        return
      }
      this.form.receiptIds.splice(index, 1)
    },
    handleSave (status) { // 保存申报
      this.$refs.form.validate(async val => {
        if (val) {
          const { studyTourDeclareId, name, phone, title, sum, trafficIds, insuranceIds, invoiceIds, receiptIds } = this.form
          let params = { studyTourDeclareId, name, phone, title, sum, status, trafficIds, insuranceIds, invoiceIds, receiptIds }
          const { resultMessage } = await post(declareUpdateUrl, params)
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
