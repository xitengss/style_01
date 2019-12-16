<template>
  <div class="base-box group-teacher-box">
    <div class="header">
      <div>
        <el-button
          v-permission="'teacherAdd'"
          @click="handleAdd"
          icon="el-icon-plus"
          type="primary"
        >新增</el-button>
        <el-button
          v-permission="'teacherDel'"
          v-show="isShowMulDelBtn"
          @click="handleMulDel"
          type="danger"
        >批量删除</el-button>
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
      <el-table-column show-overflow-tooltip label="姓名" prop="name">
        <!-- <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
        </template>-->
      </el-table-column>
      <el-table-column show-overflow-tooltip label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex === 1 ? '男' : '女'}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="角色" prop="roleTxt"></el-table-column>
      <el-table-column show-overflow-tooltip label="手机" prop="phone"></el-table-column>
      <el-table-column show-overflow-tooltip label="身份证" prop="idCard"></el-table-column>
      <el-table-column show-overflow-tooltip label="微信绑定" prop="courseCount">
        <template slot-scope="scope">
          <span>
            <i
              class="is-dot"
              :style="{background: scope.row.boundWeixin ? styles.successColor : styles.warningColor }"
            ></i>
            {{scope.row.boundWeixin ? '绑定' : '未绑定'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="状态">
        <template slot-scope="scope">
          <span>
            <i
              class="is-dot"
              :style="{background: scope.row.status ? styles.successColor : styles.greyColor }"
            ></i>
            {{scope.row.status ? '在职' : '离职'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button
            v-permission="'teacherUntie'"
            type="text"
            size="small"
            @click="handleUser(scope.$index, scope.row)"
          >解绑微信</el-button>
          <el-button
            v-permission="'teacherUpdate'"
            type="text"
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-popover width="200" trigger="click" v-model="scope.row.delViewVisible">
            <p>
              <i class="el-icon-question warning"></i> 确定删除
              <span>{{scope.row.name}}</span> 该人员吗？
            </p>
            <div class="fr">
              <el-button size="mini" type="text" @click="scope.row.delViewVisible = false">取消</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
              >确定</el-button>
            </div>
            <el-button type="text" size="small" slot="reference" v-permission="'teacherDel'">删除</el-button>
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

    <!-- 增改人员 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="handleCancel"
      :close-on-click-modal="false"
      width="520px"
    >
      <div class="content">
        <el-form :model="teacherModel" :rules="teacherRules" label-width="100px" ref="teacherForm">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="teacherModel.name" :maxlength="16" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-model="teacherModel.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号码：" prop="phone">
            <el-input :maxlength="11" placeholder="请输入手机号码" v-model.number="teacherModel.phone"></el-input>
          </el-form-item>
          <el-form-item label="身份证：" prop="idCard">
            <el-input v-model="teacherModel.idCard" :maxlength="18" placeholder="请输入身份证"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-radio-group v-model="teacherModel.status">
              <el-radio :label="1">在职</el-radio>
              <el-radio :label="0">离职</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSave" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { teacherListUrl, teacherDeleteUrl, teacherSaveUrl, teacherUpdateUrl, teacherUnbindUrl } from 'api/group'
import { post } from 'utils'
import { phoneValidate, idcardValidate } from 'utils/validate'
import styles from 'assets/styles/variable.scss'
export default {
  name: 'groupTeacher',
  data () {
    return {
      searchContent: '',
      loading: false,
      tableData: [],
      params: {
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      currentIndex: 1,
      total: 0,
      ids: [],
      dialogTitle: '',
      dialogVisible: false,
      teacherModel: {
        name: '',
        sex: 1,
        role: 1,
        phone: '',
        idCard: '',
        status: 1
      },
      teacherTemp: {},
      teacherRules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: phoneValidate, trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '身份证不能为空', trigger: 'blur' },
          { validator: idcardValidate, trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isShowMulDelBtn () {
      return this.ids.length
    },
    styles () {
      return styles
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
      const { data: { data, pageIndex, count } } = await post(teacherListUrl, this.params)
      data.map(item => {
        item.roleTxt = '接团老师'
      })
      this.tableData = data
      this.currentIndex = pageIndex
      this.total = count
    },
    handleAdd () { // 新增
      this.dialogTitle = '新增人员'
      this.teacherModel = {
        name: '',
        sex: 1,
        role: 1,
        phone: '',
        idCard: '',
        status: 1
      }
      this.dialogVisible = true
    },
    async handleUser (index, row) { // 帐号管理
      const { resultMessage } = await post(teacherUnbindUrl, `id=${row.teacherId}`)
      this.$message({
        type: 'success',
        message: resultMessage,
        duration: 1500
      })
      this.loadData()
    },
    handleEdit (index, row) { // 修改
      this.dialogTitle = '修改人员'
      Object.assign(this.teacherTemp, row)
      Object.assign(this.teacherModel, row)
      this.addressModel = this.teacherModel.address
      this.dialogVisible = true
    },
    handleDelete (index, row) { // 删除
      this.delAction([row.teacherId])
    },
    handleMulDel () { // 批量删除
      this.$confirm('确认选中人员吗?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancleButtonText: '取消'
      }).then(() => {
        this.delAction(this.ids)
      })
    },
    async delAction (ids) { // 删除
      const { resultMessage } = await post(teacherDeleteUrl, { ids })
      this.$message({
        type: 'success',
        message: resultMessage,
        duration: 1500
      })
      this.loadData()
    },
    handleCancel () { // 取消修改
      this.$refs.teacherForm.resetFields()
      Object.assign(this.teacherModel, this.teacherTemp)
      this.dialogVisible = false
    },
    handleSave () { // 保存
      this.$refs.teacherForm.validate(async val => {
        if (val) {
          const { teacherId, name, sex, role, phone, idCard, status } = this.teacherModel
          let url = teacherSaveUrl
          let params = { name, sex, role, phone, idCard, status }
          if (teacherId) {
            url = teacherUpdateUrl
            Object.assign(params, { id: teacherId })
          }
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
    handleIconSearchClick () { // 搜索
      this.params.name = this.searchContent
      this.params.pageIndex = 1
      this.loadData()
    },
    tableSelectionChange (checkList) { // 选中表格框时触发
      this.ids = checkList.length ? checkList.map(item => item.teacherId) : []
    },
    addressChange (val) { // 地址选中触发
      let addr = this.addressList.filter(item => val === item.id)[0] || {}
      this.teacherModel.address = addr.title
      this.teacherModel.latitude = addr.location.lat
      this.teacherModel.longitude = addr.location.lng
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
    //   handleDetail (index, row) { // 查看详情
    //     this.$router.push({ name: 'groupTeacherDetail', query: { id: row.teacherId } })
    //   }
    // }
  }
}
</script>
