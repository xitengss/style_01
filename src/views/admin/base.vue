<template>
  <div class="base-box admin-base-box">
    <div class="header">
      <div>
        <el-button v-permission="'baseAdd'" @click="handleAdd" icon="el-icon-plus" type="primary">新增</el-button>
        <el-button
          v-permission="'baseDel'"
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
      <el-table-column show-overflow-tooltip label="研学单元名称" prop="name">
        <!-- <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
        </template> -->
      </el-table-column>
      <el-table-column show-overflow-tooltip label="联系人" prop="relationPeople"></el-table-column>
      <el-table-column show-overflow-tooltip label="联系电话" prop="relationPhone"></el-table-column>
      <el-table-column show-overflow-tooltip label="联系地址" prop="address"></el-table-column>
      <el-table-column show-overflow-tooltip label="开设课程数" prop="courseCount"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="'baseUser'"
            type="text"
            size="small"
            @click="handleUser(scope.$index, scope.row)"
          >帐号管理</el-button>
          <el-button
            v-permission="'baseUpdate'"
            type="text"
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-popover width="200" trigger="click" v-model="scope.row.delViewVisible">
            <p>
              <i class="el-icon-question warning"></i> 确定删除
              <span>{{scope.row.name}}</span> 该基地吗？
            </p>
            <div class="fr">
              <el-button size="mini" type="text" @click="scope.row.delViewVisible = false">取消</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
              >确定</el-button>
            </div>
            <el-button type="text" size="small" slot="reference" v-permission="'baseDel'">删除</el-button>
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

    <!-- 增改研学单元 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="handleCancel"
      :close-on-click-modal="false"
      width="520px"
    >
      <div class="content">
        <el-form :model="baseModel" :rules="baseRules" label-width="100px" ref="baseForm">
          <el-form-item label="单元名称：" prop="name">
            <el-select v-model="baseModel.name" placeholder="请选择单元名称" class="w-100">
              <el-option v-for="item in baseList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人：" prop="relationPeople">
            <el-input v-model="baseModel.relationPeople" :maxlength="16" placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="relationPhone">
            <el-input v-model="baseModel.relationPhone" :maxlength="12" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="联系地址：" prop="address">
            <el-select
              remote
              filterable
              :remote-method="mapSearch"
              :loading="searchLoading"
              v-model="addressModel"
              placeholder="请输入关键词搜索并选择地址"
              @change="addressChange"
            >
              <el-option
                v-for="item in addressList"
                :key="item.id"
                :label="`${item.title}`"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <tx-map :position="position"></tx-map>
          </el-form-item>
          <el-form-item label="范围：" prop="scope">
            <el-input
              v-model.number="baseModel.scope"
              :maxlength="12"
              type="number"
              placeholder="请输入接团老师打卡定位范围值"
            >
              <template slot="append">米</template>
            </el-input>
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
import { studybaseListUrl, studybaseDeleteUrl, studySaveUrl, studybaseUpdateUrl, mapSeacrchUrl, getBaseListUrl } from 'api/admin'
import { post, get } from 'utils'
import { allPhoneValidate } from 'utils/validate'
import TxMap from 'components/Map'
export default {
  name: 'adminBase',
  components: {
    TxMap
  },
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
      baseList: [],
      dialogTitle: '',
      dialogVisible: false,
      baseModel: {
        name: '',
        relationPeople: '',
        relationPhone: '',
        address: '',
        latitude: '',
        longitude: '',
        scope: ''
      },
      searchLoading: false,
      addressModel: '',
      addressList: [],
      baseTemp: {},
      baseRules: {
        name: [
          { required: true, message: '基地名称不能为空', trigger: 'blur' }
        ],
        relationPeople: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        relationPhone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { validator: allPhoneValidate, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '联系地址不能为空', trigger: 'blur' }
        ],
        scope: [
          { type: 'number', min: 1, max: 999999999, message: '请输入范围值在1-999999999内' },
          { required: true, message: '范围值不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isShowMulDelBtn () {
      return this.ids.length
    },
    position () {
      return { lat: this.baseModel.latitude, lng: this.baseModel.longitude }
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
    this.loadbaseList()
    this.loadData()
  },
  methods: {
    async loadbaseList () { // 加载课程名称
      const { data } = await post(getBaseListUrl)
      this.baseList = data
    },
    async loadData () { // 加载数据
      const { data: { data, pageIndex, count } } = await post(studybaseListUrl, this.params)
      this.tableData = data
      this.currentIndex = pageIndex
      this.total = count
    },
    async mapSearch (keyword) { // 地址查询
      if (!keyword) {
        return
      }
      this.searchLoading = true
      const { data } = await get(`${mapSeacrchUrl}`, `region=厦门&keyword=${keyword}`)
      this.searchLoading = false
      let obj = JSON.parse(data)
      this.addressList = obj.data
    },
    handleAdd () { // 新增
      this.dialogTitle = '新增研学单元'
      this.baseModel = {
        name: '',
        relationPeople: '',
        relationPhone: '',
        address: '',
        latitude: '',
        longitude: '',
        scope: ''
      }
      this.dialogVisible = true
    },
    handleUser (index, row) { // 帐号管理
      this.$router.push({ name: 'adminBaseUser', query: { id: row.studyBaseId, role: 2 } })
    },
    handleEdit (index, row) { // 修改
      this.dialogTitle = '修改研学单元'
      Object.assign(this.baseTemp, row)
      Object.assign(this.baseModel, row)
      this.addressModel = this.baseModel.address
      this.dialogVisible = true
    },
    // handleDetail (index, row) { // 查看畅享详情
    //   this.$router.push({ name: 'adminDetail', query: { id: row.studyBaseId } })
    // },
    handleDelete (index, row) { // 删除
      this.delAction([row.studyBaseId])
    },
    handleMulDel () { // 批量删除
      this.$confirm('确认选中基地吗?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancleButtonText: '取消'
      }).then(() => {
        this.delAction(this.ids)
      })
    },
    async delAction (ids) { // 删除
      const { resultMessage } = await post(studybaseDeleteUrl, { ids })
      this.$message({
        type: 'success',
        message: resultMessage,
        duration: 1500
      })
      this.loadData()
    },
    handleCancel () { // 取消修改
      this.$refs.baseForm.resetFields()
      Object.assign(this.baseModel, this.baseTemp)
      this.dialogVisible = false
    },
    handleSave () { // 保存
      this.$refs.baseForm.validate(async val => {
        if (val) {
          const { studyBaseId, name, relationPeople, relationPhone, address, latitude, longitude, scope } = this.baseModel
          let url = studySaveUrl
          let params = { name, relationPeople, relationPhone, address, latitude, longitude, scope }
          if (studyBaseId) {
            url = studybaseUpdateUrl
            Object.assign(params, { studyBaseId })
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
      this.ids = checkList.length ? checkList.map(item => item.studyBaseId) : []
    },
    addressChange (val) { // 地址选中触发
      let addr = this.addressList.filter(item => val === item.id)[0] || {}
      this.baseModel.address = addr.title
      this.baseModel.latitude = addr.location.lat
      this.baseModel.longitude = addr.location.lng
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
