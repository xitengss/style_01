<template>
  <div class="base-box group-tour-user-box">
    <div class="header">
      <div>
        <template v-if="status == 2">
          <el-button @click="handleAddApply" icon="el-icon-plus" type="primary">新增学员</el-button>
          <el-button @click="handleAddStaff" icon="el-icon-plus" type="primary">新增工作人员</el-button>
          <el-button @click="importDialogVisible = true">导入名单</el-button>
          <el-button v-show="isShowMulDelBtn" @click="handleMulDel" type="danger">批量删除</el-button>
        </template>
      </div>
      <el-input placeholder="请输入关键字搜索" v-model.trim="searchContent">
        <i class="el-input__icon el-icon-search" slot="suffix" @click="handleIconSearchClick"></i>
      </el-input>
    </div>
    <el-table
      :data="tableData"
      v-loading="loading"
      class="my-table"
      @selection-change="tableSelectionChange"
    >
      <el-table-column show-overflow-tooltip type="selection" width="55" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip label="研学号" prop="number"></el-table-column>
      <el-table-column show-overflow-tooltip label="姓名">
        <template slot-scope="scope">
          <span v-if="scope.row.role != 3">{{scope.row.name}}</span>
          <el-button
            v-else
            type="text"
            @click="handleApplyDetail(scope.$index, scope.row)"
          >{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex === 1 ? '男' : '女'}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="角色" prop="roleName"></el-table-column>
      <el-table-column show-overflow-tooltip label="联系电话" prop="phone"></el-table-column>
      <el-table-column show-overflow-tooltip label="监护人姓名" prop="guardian"></el-table-column>
      <el-table-column show-overflow-tooltip label="监护人联系电话" prop="guardianPhone"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="status == 2  || status == 3"
            type="text"
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-popover width="200" trigger="click" v-model="scope.row.delViewVisible">
            <p>
              <i class="el-icon-question warning"></i> 确定删除
              <span>{{scope.row.name}}</span>
              该{{roleList[scope.row.role - 1]}}吗？
            </p>
            <div class="fr">
              <el-button size="mini" type="text" @click="scope.row.delViewVisible = false">取消</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
              >确定</el-button>
            </div>
            <el-button v-if="status == 2" type="text" size="small" slot="reference">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 增改工作人员 -->
    <el-dialog
      :title="staffDialogTile"
      :visible.sync="staffDialogVisible"
      :before-close="staffHandleCancel"
      :close-on-click-modal="false"
      width="520px"
    >
      <div class="content">
        <el-form :model="staffModel" :rules="staffRules" label-width="100px" ref="staffForm">
          <el-form-item label="角色：" prop="role">
            <el-radio-group v-model="staffModel.role">
              <el-radio :label="1">随团老师</el-radio>
              <el-radio :label="2">随团工作人员</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input
              :maxlength="16"
              placeholder="请输入姓名"
              v-model="staffModel.name"
              @change="searchStaffInfo"
            ></el-input>
          </el-form-item>
          <el-form-item label="证件类型：" prop="idType">
            <el-select v-model="staffModel.idType" placeholder="请选择证件类型">
              <el-option
                v-for="item in idTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码：" prop="idCard">
            <el-input
              v-model="staffModel.idCard"
              :maxlength="18"
              placeholder="请输入证件号码"
              @change="searchStaffInfo"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-model="staffModel.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="联系电话：" prop="phone">
            <el-input :maxlength="12" placeholder="请输入联系电话" v-model="staffModel.phone"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="staffHandleCancel">取消</el-button>
        <el-button @click="staffHandleSave" type="primary">确定</el-button>
      </div>
    </el-dialog>

    <!-- 增改学员 -->
    <el-dialog
      :title="applyDialogTile"
      :visible.sync="applyDialogVisible"
      :before-close="applyHandleCancel"
      :close-on-click-modal="false"
      width="800px"
    >
      <div class="content">
        <el-form :model="applyModel" :rules="applyRules" label-width="110px" ref="applyForm">
          <h4>人员信息</h4>
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名：" prop="name">
                <span v-show="!isEdit" class="grey-color-l">{{applyModel.name}}</span>
                <el-input
                  v-show="isEdit"
                  v-model="applyModel.name"
                  :maxlength="16"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别：" prop="sex">
                <span v-show="!isEdit" class="grey-color-l">{{applyModel.sex === 1 ? '男': '女'}}</span>
                <el-radio-group v-show="isEdit" v-model="applyModel.sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="出生日期：" prop="birth">
                <span v-show="!isEdit" class="grey-color-l">{{applyModel.birthDate}}</span>
                <el-date-picker
                  v-show="isEdit"
                  type="date"
                  class="w-100"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                  v-model="applyModel.birth"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地区：" prop="region">
                <span v-show="!isEdit" class="grey-color-l">{{applyModel.regionName}}</span>
                <el-select v-show="isEdit" v-model="applyModel.region" placeholder="请选择地区">
                  <el-option
                    v-for="item in regionList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="证件类型：" prop="idType">
                <span v-show="!isEdit" class="grey-color-l">{{applyModel.idTypeName}}</span>
                <el-select v-show="isEdit" v-model="applyModel.idType" placeholder="请选择证件类型">
                  <el-option
                    v-for="item in idTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件号码：" prop="idCard">
                <span v-show="!isEdit" class="grey-color-l">{{applyModel.idCard}}</span>
                <el-input
                  v-show="isEdit"
                  v-model="applyModel.idCard"
                  :maxlength="18"
                  placeholder="请输入证件号码"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="职业：" prop="profession">
                <span v-show="!isEdit" class="grey-color-l">{{applyModel.professionName}}</span>
                <el-select v-show="isEdit" v-model="applyModel.profession" placeholder="请选择职业">
                  <el-option
                    v-for="item in professionList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：" prop="phone">
                <span v-show="!isEdit" class="grey-color-l">{{applyModel.phone}}</span>
                <el-input
                  v-show="isEdit"
                  :maxlength="12"
                  placeholder="请输入联系电话"
                  v-model="applyModel.phone"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="现居住地：" prop="registerCity">
                <span
                  v-show="!isEdit"
                  class="grey-color-l"
                >{{applyModel.registerProvince}}/{{applyModel.registerCity}}</span>
                <el-cascader
                  v-show="isEdit"
                  class="w-100"
                  v-model="addrModel"
                  :options="addroptions"
                  @change="addrHandleChange"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址：" prop="registerAddress">
                <span v-show="!isEdit" class="grey-color-l">{{applyModel.registerAddress}}</span>
                <el-input
                  v-show="isEdit"
                  v-model="applyModel.registerAddress"
                  :maxlength="16"
                  placeholder="请输入详细地址"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="学校：">
                <span v-show="!isEdit" class="grey-color-l">{{applyModel.school}}</span>
                <el-input
                  v-show="isEdit"
                  v-model="applyModel.school"
                  :maxlength="16"
                  placeholder="请输入学校"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="首次来大陆：" prop="first">
                <span v-show="!isEdit" class="grey-color-l">{{applyModel.first ? '是': '否'}}</span>
                <el-radio-group v-show="isEdit" v-model="applyModel.first">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="个人照片：">
                <el-upload
                  :limit="1"
                  :disabled="!isEdit"
                  :headers="headers"
                  :file-list="applyModel.imgList"
                  :action="imgUploadUrl"
                  list-type="picture-card"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  :before-upload="beforeUpload"
                  :http-request="uploadSectionFile"
                  :class="['single-upload', applyModel.coverId ? 'hidden' : '']"
                >
                  <i class="study-icon-ic_join_dialing_norm"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <h4>监护人信息</h4>
          <div v-for="(guardian, guardianIndex) in applyModel.guardianList" :key="guardianIndex">
            <el-row>
              <el-col :span="12">
                <el-form-item :label="`监护人${guardianIndex + 1}姓名:`">
                  <span v-show="!isEdit" class="grey-color-l">{{guardian.guardian}}</span>
                  <el-input
                    v-show="isEdit"
                    v-model="guardian.guardian"
                    :maxlength="16"
                    placeholder="请输入姓名"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="`联系电话:`"
                  :prop="`guardianList.${guardianIndex}.guardianPhone`"
                  :rules="{validator: allPhoneValidate, trigger: 'blur'}"
                >
                  <span v-show="!isEdit" class="grey-color-l">{{guardian.guardianPhone}}</span>
                  <el-input
                    v-show="isEdit"
                    :maxlength="12"
                    placeholder="请输入联系电话"
                    v-model="guardian.guardianPhone"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="`与监护人关系:`">
                  <span v-show="!isEdit" class="grey-color-l">{{guardian.relation}}</span>
                  <el-input
                    v-show="isEdit"
                    v-model="guardian.relation"
                    :maxlength="16"
                    placeholder="与监护人关系"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="left-10" v-show="isEdit">
                <el-form-item label-width="0">
                  <span>
                    <i
                      class="study-icon-zengjia main-color"
                      v-if="(applyModel.guardianList.length - 1) === guardianIndex"
                      @click="add(guardianIndex)"
                    ></i>
                    <i
                      class="study-icon-jianshao danger"
                      v-if="applyModel.guardianList.length !== 1"
                      @click="del(guardianIndex)"
                    ></i>
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="applyHandleCancel">取消</el-button>
        <el-button @click="applyHandleSave" type="primary" v-show="isEdit">保存</el-button>
      </div>
    </el-dialog>

    <!-- 导入名单 -->
    <el-dialog
      width="520px"
      title="导入名单"
      :close-on-click-modal="false"
      :visible.sync="importDialogVisible"
    >
      <div class="content">
        <el-upload
          drag
          :limit="1"
          :data="importData"
          class="upload-box"
          :headers="headers"
          ref="templateUpload"
          :auto-upload="false"
          :action="applyImportUrl"
          :on-change="importChange"
          :on-exceed="importExceed"
          :on-success="importUploadSuccess"
          :http-request="uploadExcelFile"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            支持xls、xlsx文件
            <el-button
              @click="downTemplateExcel"
              class="down-btn el-icon-download"
              type="text"
              size="mini"
            >模板下载</el-button>
          </div>
        </el-upload>
      </div>
      <div slot="footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="importFlag" @click="importSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { applyListUrl, applyDeleteUrl, staffSaveUrl, staffUpdateUrl, applySaveUrl, applyUpdateUrl, applyDetailUrl, applyImportUrl, applyTemplateUrl, getStudentUrl, applyModel } from 'api/group'
import { REGION, ID_TYPE, PROFESSION } from 'api/config'
import { dictionaryUrl, uploadUrl } from 'api'
import { post, formatDate } from 'utils'
import { allPhoneValidate, isPhotoRegexp, excelValidate } from 'utils/validate'
import { mapGetters } from 'vuex'
import areaData from 'utils/area.json'
export default {
  name: 'groupTourUser',
  data () {
    return {
      status: 0,
      studyTourId: '',
      searchContent: '',
      loading: false,
      importFlag: false,
      tableData: [],
      params: {
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      currentIndex: 1,
      total: 0,
      ids: [],
      importDialogVisible: false,
      addroptions: areaData,
      addrModel: [],
      staffDialogTile: '',
      staffDialogVisible: false,
      roleList: ['随团老师', '随团工作人员', '研学人员'],
      staffModel: { role: 1, name: '', sex: 1, phone: '', idType: '', idCard: '' },
      staffTemp: {},
      staffRules: {
        role: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        idType: [
          { required: true, message: '证件类型不能为空', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '证件号码不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { validator: allPhoneValidate, trigger: 'blur' }
        ]
      },
      idTypeList: [],
      regionList: [],
      professionList: [],
      isEdit: false,
      applyDialogTile: '',
      applyDialogVisible: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      studyStudentId: '',
      applyModel: JSON.parse(JSON.stringify(applyModel)),
      applyTemp: {},
      applyRules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        birth: [
          { required: true, message: '出生日期不能为空', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '地区不能为空', trigger: 'blur' }
        ],
        idType: [
          { required: true, message: '证件类型不能为空', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '证件号码不能为空', trigger: 'blur' }
        ],
        profession: [
          { required: true, message: '职业不能为空', trigger: 'blur' }
        ],
        registerCity: [
          { required: true, message: '现居住地不能为空', trigger: 'blur' }
        ],
        phone: [
          { validator: allPhoneValidate, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isShowMulDelBtn () {
      return this.ids.length
    },
    allPhoneValidate () {
      return allPhoneValidate
    },
    imgUploadUrl () {
      return uploadUrl
    },
    applyImportUrl () {
      return applyImportUrl
    },
    excelValidate () {
      return excelValidate
    },
    importData () {
      return ({ studyTourId: this.studyTourId })
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
  watch: {
    searchContent () { // 搜索
      let timer
      if (timer) { // 优化搜索请求
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        this.handleIconSearchClick()
      }, 500)
    }
  },
  created () {
    this.init()
    this.loadIdTypeList()
    this.loadRegionList()
    this.loadProfessionList()
  },
  methods: {
    init () { // 初始化
      const { id, status } = this.$route.query
      if (!id) {
        this.$message.error('数据异常')
        this.$router.back()
        return
      }
      this.studyTourId = id
      this.status = status
      this.params.studyTourId = id
      this.loadData()
    },
    async loadData () { // 加载数据
      const { data: { data, pageIndex, count } } = await post(applyListUrl, this.params)
      data.map(item => {
        item.number = item.number || '-'
        item.guardian = item.guardian || '-'
        item.guardianPhone = item.guardianPhone || '-'
        item.roleName = this.roleList[item.role - 1]
        item.idType = item.idTypeVO && Number(item.idTypeVO.id)
      })
      this.tableData = data
      this.currentIndex = pageIndex
      this.total = count
    },
    async searchStudentInfo () { // 名字和身份证查询学员信息
      if (this.applyDialogTile === '修改研学人员信息') {
        return
      }
      const { name, idCard } = this.applyModel
      if (!name || !idCard || idCard.length < 10) {
        return
      }
      const { data } = await post(getStudentUrl, { name, idCard })
      if (!data) {
        this.studyStudentId = ''
        return
      }
      this.studyStudentId = data.studyStudentId
      data.idType = data.idTypeVO && Number(data.idTypeVO.id)
      data.idTypeName = data.idTypeVO && data.idTypeVO.name
      data.region = data.regionVO && Number(data.regionVO.id)
      data.regionName = data.regionVO && data.regionVO.name
      data.profession = data.professionVO && Number(data.professionVO.id)
      data.professionName = data.professionVO && data.professionVO.name
      data.imgList = data.cover ? [{ url: data.cover }] : []
      data.birthDate = formatDate(new Date(data.birth), 'yyyy-MM-dd')
      this.addrModel = [data.registerProvince, data.registerCity]
      Object.assign(this.applyModel, data)
      Object.assign(this.applyTemp, data)
    },
    async loadApplyDetail (index, row) { // 获取学员详情
      const { data } = await post(applyDetailUrl, `id=${row.studyTourApplyId}`)
      data.idType = data.idTypeVO && Number(data.idTypeVO.id)
      data.idTypeName = data.idTypeVO && data.idTypeVO.name
      data.region = data.regionVO && Number(data.regionVO.id)
      data.regionName = data.regionVO && data.regionVO.name
      data.profession = data.professionVO && Number(data.professionVO.id)
      data.professionName = data.professionVO && data.professionVO.name
      data.imgList = data.viewPath ? [{ url: data.viewPath }] : []
      data.birthDate = formatDate(new Date(data.birth), 'yyyy-MM-dd')
      data.guardianList = data.guardianVOList && data.guardianVOList.length ? data.guardianVOList : [{ guardian: '', guardianPhone: '', relation: '' }]
      this.addrModel = [data.registerProvince, data.registerCity]
      Object.assign(this.applyModel, data)
      Object.assign(this.applyTemp, data)
      this.applyDialogVisible = true
    },
    async loadIdTypeList () { // 证件类型
      const { data } = await post(dictionaryUrl, `category=${ID_TYPE}`)
      this.idTypeList = data
    },
    async loadRegionList () { // 地区
      const { data } = await post(dictionaryUrl, `category=${REGION}`)
      this.regionList = data
    },
    async loadProfessionList () { // 职业
      const { data } = await post(dictionaryUrl, `category=${PROFESSION}`)
      this.professionList = data
    },
    handleAddStaff () { // 新增工作人员
      this.staffDialogTile = '新增工作人员'
      this.staffModel = { role: 1, name: '', sex: 1, phone: '', idType: '', idCard: '' }
      this.staffDialogVisible = true
    },

    staffHandleCancel () { // 工作人员取消修改
      this.$refs.staffForm.resetFields()
      Object.assign(this.staffModel, this.staffTemp)
      this.staffDialogVisible = false
    },
    staffHandleSave () { // 工作人员保存
      this.$refs.staffForm.validate(async val => {
        if (val) {
          const { studyTourApplyId, role, name, sex, phone, idType, idCard } = this.staffModel
          let url = staffSaveUrl
          let params = { role, name, sex, phone, idType, idCard, studyTourId: this.studyTourId }
          if (studyTourApplyId) {
            url = staffUpdateUrl
            Object.assign(params, { studyTourApplyId })
          }
          const { resultMessage } = await post(url, params)
          this.staffDialogVisible = false
          this.loadData()
          this.$message({
            type: 'success',
            message: resultMessage,
            duration: 1500
          })
        }
      })
    },
    handleAddApply () { // 新增学员
      this.applyDialogTile = '新增研学人员信息'
      this.isEdit = true
      this.addrModel = []
      this.applyModel = JSON.parse(JSON.stringify(applyModel))
      this.applyTemp = JSON.parse(JSON.stringify(applyModel))
      this.applyDialogVisible = true
    },
    handleApplyDetail (index, row) {
      this.applyDialogTile = '研学人员信息'
      this.isEdit = false
      this.loadApplyDetail(index, row)
    },
    handleEdit (index, row) { // 修改
      if (row.role === 3) {
        this.applyDialogTile = '修改研学人员信息'
        this.isEdit = true
        this.loadApplyDetail(index, row)
        return
      }
      this.staffDialogTile = '修改工作人员'
      Object.assign(this.staffTemp, row)
      Object.assign(this.staffModel, row)
      this.staffDialogVisible = true
    },
    applyHandleCancel () { // 工作人员取消修改
      this.$refs.applyForm.resetFields()
      Object.assign(this.applyModel, this.applyTemp)
      this.applyDialogVisible = false
    },
    applyHandleSave () { // 学员保存
      this.$refs.applyForm.validate(async val => {
        if (val) {
          const { studyTourApplyId, name, sex, birth, idType, idCard, registerProvince, registerCity, registerAddress, phone, school, coverId, first, profession, region, guardianList } = this.applyModel
          let url = applySaveUrl
          let guardianListTemp = guardianList.filter(item => item.guardian || item.guardianPhone || item.relation)
          let tempArr = guardianList.filter(item => item.guardianPhone)
          // 判断数组是否重复
          if (new Set(tempArr.map(item => item.guardianPhone)).size !== tempArr.length) {
            this.$message.error('监护人的联系电话不能一样')
            return
          }
          let params = { name, sex, phone, studyTourId: this.studyTourId, birth, idType, idCard, registerProvince, registerCity, registerAddress, school, coverId, first, profession, region, guardianList: guardianListTemp }
          if (studyTourApplyId) {
            url = applyUpdateUrl
            Object.assign(params, { studyTourApplyId })
          } else {
            Object.assign(params, { studyStudentId: this.studyStudentId })
          }
          const { resultMessage } = await post(url, params)
          this.applyDialogVisible = false
          this.loadData()
          this.$message({
            type: 'success',
            message: resultMessage,
            duration: 1500
          })
        }
      })
    },
    handleDelete (index, row) { // 删除
      this.delAction([row.studyTourApplyId])
    },
    handleMulDel () { // 批量删除
      this.$confirm('确认选中项吗?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancleButtonText: '取消'
      }).then(() => {
        this.delAction(this.ids)
      })
    },
    async delAction (ids) { // 删除
      const { resultMessage } = await post(applyDeleteUrl, { ids })
      this.$message({
        type: 'success',
        message: resultMessage,
        duration: 1500
      })
      this.loadData()
    },
    async uploadSectionFile (param) { // 自定义上传图片方法
      const reParams = {
        file: param.file
      }
      const res = await post(uploadUrl, reParams)
      param.onSuccess(res)
    },
    handleSuccess (res, file) { // 图片上传成功
      if (!res) {
        return
      }
      const { data } = res
      this.applyModel.coverId = data.id
      this.applyModel.viewPath = data.viewPath
    },
    beforeUpload (file) { // 图片上传前
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
    handleRemove () { // 删除图片
      this.applyModel.coverId = ''
      this.applyModel.viewPath = ''
    },
    add (index) { // 增加监护人
      let { guardianPhone, relation, guardian } = this.applyModel.guardianList[index]
      if (!guardian || !guardianPhone || !relation) {
        this.$message({
          type: 'warning',
          message: `请先完善监护人${index + 1}信息!`,
          duration: 1500
        })
        return
      }
      this.applyModel.guardianList.push({ guardian: '', guardianPhone: '', relation: '' })
    },
    del (index) { // 减少监护人
      this.applyModel.guardianList.splice(index, 1)
    },
    addrHandleChange (arr) {
      this.applyModel.registerProvince = arr[0]
      this.applyModel.registerCity = arr[1]
    },
    importChange (file, fileList) { // 上传是否是excel
      const isExcel = excelValidate(file.raw.type)
      if (!isExcel) {
        fileList.pop()
        this.$message.error('只支持.xlsx与.xls文件！')
      }
    },
    async uploadExcelFile (param) { // 自定义上传文件
      const reParams = {
        file: param.file,
        studyTourId: this.studyTourId
      }
      const res = await post(applyImportUrl, reParams)
      param.onSuccess(res)
    },
    importExceed () { // 超出文件
      this.$message({
        type: 'warning',
        message: '只能上传一个文件，请删除已传文件后再重新上传'
      })
    },
    importUploadSuccess (res) { // 文件上传成功
      this.importFlag = false
      if (res.resultCode === 400) {
        this.$message.error(res.resultMessage)
        return
      }
      this.importDialogVisible = false
      const { data } = res
      this.loadData()
      this.$notify({
        duration: 0,
        showClose: true,
        dangerouslyUseHTMLString: true,
        onClick: () => {
          window.open(data.errorFileAccessPath, '_self')
        },
        title: '导入结果',
        message: `成功导入<span class="success">${data.successCount}</span>条,失败导入<span class="danger">${data.errorCount}</span>条,点击下载导入异常数据`
      })
    },
    importSave () { // 保存
      this.importFlag = true
      this.$refs.templateUpload.submit()
    },
    downTemplateExcel () { // 下载导入名单模版
      window.open(applyTemplateUrl, '_self')
    },
    handleIconSearchClick () { // 搜索
      this.params.name = this.searchContent
      this.params.pageIndex = 1
      this.loadData()
    },
    tableSelectionChange (checkList) { // 选中表格框时触发
      this.ids = checkList.length ? checkList.map(item => item.studyTourApplyId) : []
    },
    handleSizeChange (val) { // 改变显示条数
      this.params.pageIndex = 1
      this.params.pageSize = val
      this.loadData()
    },
    handleCurrentChange (val) { // 切换页面
      this.params.pageIndex = val
      this.loadData()
    }
  }
}
</script>

<style lang="scss">
.group-tour-user-box {
  .upload-box {
    .el-upload {
      display: block;
      .el-upload-dragger {
        width: 100%;
      }
    }
    .down-btn {
      float: right;
      margin-top: -6px;
    }
  }
}
</style>
