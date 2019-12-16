<template>
  <div class="base-box admin-group-box">
    <div class="header">
      <div>
        <el-button
          v-permission="'groupAdd'"
          @click="handleAdd"
          icon="el-icon-plus"
          type="primary"
        >新增</el-button>
        <el-button
          v-permission="'groupDel'"
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
      <el-table-column show-overflow-tooltip label="i研学名称" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip label="法人账号" prop="account"></el-table-column>
      <el-table-column show-overflow-tooltip label="联系人" prop="relationPeople"></el-table-column>
      <el-table-column show-overflow-tooltip label="联系电话" prop="relationPhone"></el-table-column>
      <el-table-column show-overflow-tooltip label="联系地址" prop="address"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="'groupUser'"
            type="text"
            size="small"
            @click="handleUser(scope.$index, scope.row)"
          >帐号管理</el-button>
          <el-button
            v-permission="'groupUpdate'"
            type="text"
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-popover width="200" trigger="click" v-model="scope.row.delViewVisible">
            <p>
              <i class="el-icon-question warning"></i> 确定删除
              <span>{{scope.row.name}}</span> 该i研学吗？
            </p>
            <div class="fr">
              <el-button size="mini" type="text" @click="scope.row.delViewVisible = false">取消</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
              >确定</el-button>
            </div>
            <el-button type="text" size="small" slot="reference" v-permission="'groupDel'">删除</el-button>
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

    <!-- 增改i研学 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="handleCancel"
      :close-on-click-modal="false"
      width="520px"
    >
      <div class="content">
        <el-form :model="groupModel" :rules="groupRules" label-width="140px" ref="groupForm">
          <el-form-item label="单位名称：">{{groupModel.name}}</el-form-item>
          <el-form-item label="统一社会信用代码：">{{groupModel.creditId || '-'}}</el-form-item>
          <el-form-item label="帐号：">{{groupModel.account}}</el-form-item>
          <el-form-item label="联系人：" prop="relationPeople">
            <el-input v-model="groupModel.relationPeople" :maxlength="16" placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="relationPhone">
            <el-input v-model="groupModel.relationPhone" :maxlength="12" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="联系地址：" prop="address">
            <el-input v-model="groupModel.address" :maxlength="32" placeholder="请输入联系地址"></el-input>
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
import { studygroupListUrl, studygroupDeleteUrl, studySaveUrl, studygroupUpdateUrl } from 'api/admin'
import { post } from 'utils'
import { allPhoneValidate } from 'utils/validate'
export default {
  name: 'adminGroup',
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
      groupModel: {
        name: '',
        relationPeople: '',
        relationPhone: '',
        address: ''
      },
      groupTemp: {},
      groupRules: {
        relationPeople: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        relationPhone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { validator: allPhoneValidate, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '联系地址不能为空', trigger: 'blur' }
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
    this.loadData()
  },
  methods: {
    async loadData () { // 加载数据
      const { data: { data, pageIndex, count } } = await post(studygroupListUrl, this.params)
      this.tableData = data
      this.currentIndex = pageIndex
      this.total = count
    },
    handleAdd () { // 新增
      this.dialogTitle = '新增i研学'
      this.groupModel = {
        name: '',
        relationPeople: '',
        relationPhone: '',
        address: ''
      }
      this.dialogVisible = true
    },
    handleUser (index, row) { // 帐号管理
      this.$router.push({ name: 'adminGroupUser', query: { id: row.tourGroupUnitId, role: 1 } })
    },
    handleEdit (index, row) { // 修改
      this.dialogTitle = '修改i研学'
      Object.assign(this.groupTemp, row)
      Object.assign(this.groupModel, row)
      this.dialogVisible = true
    },
    handleDelete (index, row) { // 删除
      this.delAction([row.tourGroupUnitId])
    },
    handleMulDel () { // 批量删除
      this.$confirm('确认选中i研学吗?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancleButtonText: '取消'
      }).then(() => {
        this.delAction(this.ids)
      })
    },
    async delAction (ids) { // 删除
      const { resultMessage } = await post(studygroupDeleteUrl, { ids })
      this.$message({
        type: 'success',
        message: resultMessage,
        duration: 1500
      })
      this.loadData()
    },
    handleCancel () { // 取消修改
      this.$refs.groupForm.resetFields()
      Object.assign(this.groupModel, this.groupTemp)
      this.dialogVisible = false
    },
    handleSave () { // 保存
      this.$refs.groupForm.validate(async val => {
        if (val) {
          const { tourGroupUnitId, relationPeople, relationPhone, address } = this.groupModel
          let url = studySaveUrl
          let params = { relationPeople, relationPhone, address }
          if (tourGroupUnitId) {
            url = studygroupUpdateUrl
            Object.assign(params, { tourGroupUnitId })
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
      this.ids = checkList.length ? checkList.map(item => item.tourGroupUnitId) : []
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
