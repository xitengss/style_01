<template>
  <div class="base-box base-declare-box">
    <div class="header">
      <ul class="margin-10">
        <li
          v-for="item in numStatusList"
          :key="item.name"
          :class="['text-btn', item.name === active ? 'active': '']"
          @click="handleStatus(item)"
        >{{item.name}}({{item.num}})</li>
      </ul>
      <el-input placeholder="请输入研学团名称关键字搜索" v-model.trim="searchContent">
        <i class="el-input__icon el-icon-search" slot="suffix" @click="handleIconSearchClick"></i>
      </el-input>
    </div>
    <el-table :data="tableData" v-loading="loading" class="my-table">
      <el-table-column show-overflow-tooltip label="研学课程" prop="course"></el-table-column>
      <el-table-column show-overflow-tooltip label="服务团" prop="studyTourName"></el-table-column>
      <el-table-column show-overflow-tooltip label="参团人数" prop="countApply"></el-table-column>
      <el-table-column show-overflow-tooltip label="申报金额(元)" prop="sum"></el-table-column>
      <el-table-column show-overflow-tooltip label="申报时间" prop="time"></el-table-column>
      <el-table-column show-overflow-tooltip label="申报状态">
        <template slot-scope="scope">
          <span>
            <i class="is-dot" :style="{background: statusColor[scope.row.status]}"></i>
            {{statusList[scope.row.status]}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 0 || scope.row.status === 3"
            v-permission="'declareUpdate'"
            type="text"
            size="small"
            @click="handleEdit(scope.$index, scope.row, '编辑申报资料')"
          >编辑申报资料</el-button>
          <el-button
            v-else
            v-permission="'declareDetail'"
            type="text"
            size="small"
            @click="handleEdit(scope.$index, scope.row, '查看申报资料')"
          >查看</el-button>
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

    <!-- 增改申报资料 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="handleCancel"
      :close-on-click-modal="false"
      width="520px"
    >
      <div class="content">
        <el-form :model="declareModel" :rules="declareRules" label-width="100px" ref="declareForm">
          <el-alert
            type="error"
            :closable="false"
            v-if="declareModel.status === 3"
            :title="`驳回理由: ${declareModel.objection}`"
          ></el-alert>
          <el-form-item label="研学课程：">{{declareModel.course}}</el-form-item>
          <el-form-item label="服务团：">{{declareModel.studyTourName}}</el-form-item>
          <el-form-item label="参团人数：">{{declareModel.countApply}}人</el-form-item>
          <el-form-item label="申报方：" prop="title">
            <el-input
              v-if="isEdit"
              v-model="declareModel.title"
              :maxlength="32"
              placeholder="请输入申请方"
            ></el-input>
            <span v-else>{{declareModel.title}}</span>
          </el-form-item>
          <el-form-item label="申报金额：" prop="sum">
            <el-input v-if="isEdit" v-model="declareModel.sum" :maxlength="12" placeholder="请输入金额">
              <template slot="append">元</template>
            </el-input>
            <span v-else>{{declareModel.sum}}</span>
          </el-form-item>
          <el-form-item label="联系人：" prop="name">
            <el-input
              v-if="isEdit"
              v-model="declareModel.name"
              :maxlength="16"
              placeholder="请输入联系人"
            ></el-input>
            <span v-else>{{declareModel.name}}</span>
          </el-form-item>
          <el-form-item label="联系电话：" prop="phone">
            <el-input
              v-if="isEdit"
              v-model="declareModel.phone"
              :maxlength="12"
              placeholder="请输入联系电话"
            ></el-input>
            <span v-else>{{declareModel.phone}}</span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="handleCancel">{{isEdit ? '取消': '关闭'}}</el-button>
        <el-button @click="handleSave(0)" v-show="isEdit">保存为草稿</el-button>
        <el-button @click="handleSave(1)" type="primary" v-show="isEdit">提交申报</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { declareListUrl, declareUpdateUrl } from 'api/base'
import { post, formatDate } from 'utils'
import { allPhoneValidate, prcieValidate } from 'utils/validate'
import styles from 'assets/styles/variable.scss'
export default {
  name: 'baseDeclare',
  data () {
    return {
      searchContent: '',
      loading: false,
      tableData: [],
      params: {
        name: '',
        status: '',
        pageIndex: 1,
        pageSize: 10
      },
      currentIndex: 1,
      total: 0,
      active: '全部',
      numStatusList: [
        { name: '全部', num: 0, status: '' },
        { name: '草稿箱', num: 0, status: 0 },
        { name: '审核中', num: 0, status: 1 },
        { name: '通过', num: 0, status: 2 },
        { name: '未通过', num: 0, status: 3 }
      ],
      statusColor: [styles.warningColor, styles.errorColor, styles.successColor, styles.greyColor],
      statusList: ['草稿箱', '审核中', '通过', '未通过'],
      dialogTitle: '',
      dialogVisible: false,
      declareModel: {
        title: '',
        name: '',
        phone: '',
        sum: '',
        status: ''
      },
      declareTemp: {},
      declareRules: {
        name: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { validator: allPhoneValidate, trigger: 'blur' }
        ],
        title: [
          { required: true, message: '申请方不能为空', trigger: 'blur' }
        ],
        sum: [
          { required: true, message: '申报金额不能为空', trigger: 'blur' },
          { validator: prcieValidate, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isEdit () {
      return this.declareModel.status === 0 || this.declareModel.status === 3
    }
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
    this.loadData()
  },
  methods: {
    async loadData () { // 加载数据
      const { data: { pagerVo: { data, pageIndex, count }, numVO } } = await post(declareListUrl, this.params)
      data.map(item => {
        item.time = formatDate(new Date(item.declareDate), 'yyyy-MM-dd hh:mm:ss')
      })
      this.tableData = data
      this.currentIndex = pageIndex
      this.total = count
      this.numStatusList[0].num = numVO.num
      this.numStatusList[1].num = numVO.draftsNum
      this.numStatusList[2].num = numVO.auditNum
      this.numStatusList[3].num = numVO.passNum
      this.numStatusList[4].num = numVO.rejectNum
    },
    handleEdit (index, row, title) { // 编辑
      this.dialogTitle = title
      Object.assign(this.declareTemp, row)
      Object.assign(this.declareModel, row)
      this.dialogVisible = true
    },
    handleCancel () { // 取消编辑
      this.$refs.declareForm.resetFields()
      Object.assign(this.declareModel, this.declareTemp)
      this.dialogVisible = false
    },
    handleSave (status) { // 保存
      this.$refs.declareForm.validate(async val => {
        if (val) {
          const { studyCourseDeclareId, title, name, phone, sum } = this.declareModel
          let url = declareUpdateUrl
          let params = { studyCourseDeclareId, title, name, phone, sum, status }
          const { resultMessage } = await post(url, params)
          this.dialogVisible = false
          this.loadData()
          this.$message({
            type: 'success',
            message: resultMessage,
            duration: 1500
          })
        }
      })
    },
    handleStatus (item) { // 状态赛选
      this.active = item.name
      this.params.status = item.status
      this.handleIconSearchClick()
    },
    handleIconSearchClick () { // 搜索
      this.params.name = this.searchContent
      this.params.pageIndex = 1
      this.loadData()
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
