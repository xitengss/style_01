<template>
  <div class="base-box group-template-box">
    <div class="header">
      <div>
        <el-button
          v-permission="'templateAdd'"
          @click="handleAdd"
          icon="el-icon-plus"
          type="primary"
        >新增</el-button>
        <el-button
          v-permission="'templateDel'"
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
      <el-table-column show-overflow-tooltip label="模版名称">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="行程天数" prop="journeyNum"></el-table-column>
      <el-table-column show-overflow-tooltip label="路线费用">
        <template slot-scope="scope">
          <span class="danger">￥{{scope.row.preferentialPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="创建时间" prop="time"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="'templateUpdate'"
            type="text"
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-popover width="200" trigger="click" v-model="scope.row.delViewVisible">
            <p>
              <i class="el-icon-question warning"></i> 确定删除
              <span>{{scope.row.name}}</span> 该模版吗？
            </p>
            <div class="fr">
              <el-button size="mini" type="text" @click="scope.row.delViewVisible = false">取消</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
              >确定</el-button>
            </div>
            <el-button type="text" size="small" slot="reference" v-permission="'templateDel'">删除</el-button>
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
import { templateListUrl, templateDeleteUrl } from 'api/group'
import { post, formatDate } from 'utils'
export default {
  name: 'groupTemplate',
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
      ids: []
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
      const { data: { data, pageIndex, count } } = await post(templateListUrl, this.params)
      data.map(item => {
        item.time = formatDate(new Date(item.gmtCreate), 'yyyy-MM-dd')
      })
      this.tableData = data
      this.currentIndex = pageIndex
      this.total = count
    },
    handleAdd () { // 新增
      this.$router.push({ name: 'groupTemplateCreate' })
    },
    handleEdit (index, row) { // 修改
      this.$router.push({ name: 'groupTemplateCreate', query: { id: row.studyTourTemplateId } })
    },
    handleDetail (index, row) { // 查看详情
      this.$router.push({ name: 'groupTemplateDetail', query: { id: row.studyTourTemplateId } })
    },
    handleDelete (index, row) { // 删除
      this.delAction([row.studyTourTemplateId])
    },
    handleMulDel () { // 批量删除
      this.$confirm('确认选中模版吗?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancleButtonText: '取消'
      }).then(() => {
        this.delAction(this.ids)
      })
    },
    async delAction (ids) { // 删除
      const { resultMessage } = await post(templateDeleteUrl, { ids })
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
      this.ids = checkList.length ? checkList.map(item => item.studyTourTemplateId) : []
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
