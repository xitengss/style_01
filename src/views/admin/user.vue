<template>
  <div class="base-box admin-base-user-box">
    <div class="header">
      <div>
        <el-button @click="handleAdd" icon="el-icon-plus" type="primary">新增</el-button>
        <el-button v-show="isShowMulDelBtn" @click="handleMulDel" type="danger">批量删除</el-button>
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
      <el-table-column show-overflow-tooltip label="账号" prop="account"></el-table-column>
      <el-table-column show-overflow-tooltip label="姓名" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip label="角色" prop="roleName"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleResetPwd(scope.$index, scope.row)">重置密码</el-button>
          <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-popover width="200" trigger="click" v-model="scope.row.delViewVisible">
            <p>
              <i class="el-icon-question warning"></i> 确定删除
              <span>{{scope.row.name}}</span> 该帐号吗？
            </p>
            <div class="fr">
              <el-button size="mini" type="text" @click="scope.row.delViewVisible = false">取消</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
              >确定</el-button>
            </div>
            <el-button type="text" size="small" slot="reference">删除</el-button>
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

    <!-- 增改帐号 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="handleCancel"
      :close-on-click-modal="false"
      width="520px"
    >
      <div class="content">
        <el-form :model="userModel" :rules="userRules" label-width="100px" ref="userForm">
          <el-form-item label="账号：" prop="account">
            <el-input v-model="userModel.account" :maxlength="16" placeholder="请输入帐号名称"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="userModel.name" :maxlength="16" placeholder="请输入姓名"></el-input>
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
import { userListUrl, userDeleteUrl, userSaveUrl, userUpdateUrl, userResetPwdUrl } from 'api/admin'
import { post } from 'utils'
export default {
  name: 'adminBaseUser',
  data () {
    return {
      baseAndTourId: '',
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
      userModel: {
        account: '',
        name: ''
      },
      userTemp: {},
      userRules: {
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isShowMulDelBtn () {
      return this.ids.length
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
    this.load()
  },
  methods: {
    load () { // 初始化
      const { id, role } = this.$route.query
      if (!id || !role) {
        this.$message.error('数据异常')
        this.$router.back()
        return
      }
      this.baseAndTourId = id
      this.params.baseAndTourId = id
      this.role = role
      this.loadData()
    },
    async loadData () { // 加载数据
      const { data: { data, pageIndex, count } } = await post(userListUrl, this.params)
      this.tableData = data
      this.currentIndex = pageIndex
      this.total = count
    },
    handleAdd () { // 新增
      this.dialogTitle = '新增帐号'
      this.userModel = {
        name: '',
        account: ''
      }
      this.dialogVisible = true
    },
    async handleResetPwd (index, row) { // 重置帐号
      const { resultMessage } = await post(userResetPwdUrl, { userId: row.userId })
      this.$message({
        type: 'success',
        message: resultMessage
      })
    },
    handleEdit (index, row) { // 修改
      this.dialogTitle = '修改帐号'
      Object.assign(this.userTemp, row)
      Object.assign(this.userModel, row)
      this.dialogVisible = true
    },
    handleDelete (index, row) { // 删除
      this.delAction([row.baseAndTourUserId])
    },
    handleMulDel () { // 批量删除
      this.$confirm('确认选中帐号吗?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancleButtonText: '取消'
      }).then(() => {
        this.delAction(this.ids)
      })
    },
    async delAction (ids) { // 删除
      const { resultMessage } = await post(userDeleteUrl, { ids })
      this.$message({
        type: 'success',
        message: resultMessage,
        duration: 1500
      })
      this.loadData()
    },
    handleCancel () { // 取消修改
      this.$refs.userForm.resetFields()
      Object.assign(this.userModel, this.userTemp)
      this.dialogVisible = false
    },
    handleSave () { // 保存
      this.$refs.userForm.validate(async val => {
        if (val) {
          const { userId, account, name } = this.userModel
          let url = userSaveUrl
          let params = { name, account }
          if (userId) {
            url = userUpdateUrl
            Object.assign(params, { userId: userId })
          } else {
            Object.assign(params, { baseAndTourId: this.baseAndTourId, role: this.role })
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
      this.ids = checkList.length ? checkList.map(item => item.baseAndTourUserId) : []
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
