<template>
  <div class="base-box group-tour-box">
    <div class="header">
      <div>
        <el-button v-permission="'tourAdd'" @click="handleAdd" icon="el-icon-plus" type="primary">新增</el-button>
        <el-button
          v-permission="'tourDel'"
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
      <el-table-column show-overflow-tooltip label="研学团">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="状态">
        <template slot-scope="scope">
          <span>
            <i class="is-dot" :style="{background: statusColor[scope.row.status]}"></i>
            {{statusList[scope.row.status]}}
          </span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="活动时间">
        <template slot-scope="scope">
          <span>{{scope.row.startTime}} 至 {{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="路线费用" prop="preferentialPrice">
        <template slot-scope="scope">
          <span class="danger">￥{{scope.row.preferentialPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="原价" prop="price">
        <template slot-scope="scope">
          <span>￥{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="住宿异常情况">
        <template slot-scope="scope">
          <el-button
            type="text"
            :disabled="!Boolean(scope.row.anomaly)"
            v-permission="'tourAnomaly'"
            @click="handleAnomaly(scope.$index, scope.row)"
          >异常({{scope.row.anomaly}})</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status !== 0 &&  scope.row.status !== 1"
            v-permission="'tourUser'"
            type="text"
            size="small"
            @click="handleUser(scope.$index, scope.row)"
          >名单管理</el-button>
          <el-button
            v-if="scope.row.status === 0"
            v-permission="'tourUpdate'"
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
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              slot="reference"
              v-permission="'tourDel'"
            >删除</el-button>
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
  </div>
</template>

<script>
import { tourListUrl, tourDeleteUrl } from 'api/group'
import { post, formatDate } from 'utils'
import styles from 'assets/styles/variable.scss'
export default {
  name: 'groupTour',
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
      statusColor: [styles.warningColor, styles.errorColor, styles.successColor, styles.mainColor, styles.greyColor],
      statusList: ['草稿箱', '确认中', '报名中', '开团中', '已结束']
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
      const { data: { data, pageIndex, count } } = await post(tourListUrl, this.params)
      data.map(item => {
        item.startTime = formatDate(new Date(item.startDate), 'yyyy-MM-dd')
        item.endTime = formatDate(new Date(item.endDate), 'yyyy-MM-dd')
      })
      this.tableData = data
      this.currentIndex = pageIndex
      this.total = count
    },
    handleAdd () { // 新增
      this.$router.push({ name: 'groupTourCreate' })
    },
    handleUser (index, row) { // 帐号管理
      this.$router.push({ name: 'groupTourUser', query: { id: row.studyTourId, status: row.status } })
    },
    handleEdit (index, row) { // 修改
      this.$router.push({ name: 'groupTourCreate', query: { id: row.studyTourId } })
    },
    handleDetail (index, row) { // 查看详情
      this.$router.push({ name: 'groupTourUnlimitedDetail', query: { id: row.studyTourId } })
    },
    handleAnomaly (index, row) { // 查看异常天数
      this.$router.push({ name: 'groupTourAnomaly', query: { id: row.studyTourId, name: row.name } })
    },
    handleDelete (index, row) { // 删除
      this.delAction([row.studyTourId])
    },
    handleMulDel () { // 批量删除
      this.$confirm('确认选中研学团吗?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancleButtonText: '取消'
      }).then(() => {
        this.delAction(this.ids)
      })
    },
    async delAction (ids) { // 删除
      const { resultMessage } = await post(tourDeleteUrl, { ids })
      this.$message({
        type: 'success',
        message: resultMessage,
        duration: 1500
      })
      this.loadData()
    },
    handleIconSearchClick () { // 搜索
      this.params.name = this.searchContent
      this.params.pageIndex = 1
      this.loadData()
    },
    tableSelectionChange (checkList) { // 选中表格框时触发
      this.ids = checkList.length ? checkList.map(item => item.studyTourId) : []
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
