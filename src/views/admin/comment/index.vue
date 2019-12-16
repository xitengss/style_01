<template>
  <div class="base-box admin-comment-box">
    <div class="header">
      <div></div>
      <el-input placeholder="请输入研学人员姓名关键字搜索" v-model.trim="searchContent">
        <i class="el-input__icon el-icon-search" slot="suffix" @click="handleIconSearchClick"></i>
      </el-input>
    </div>
    <el-table :data="tableData" v-loading="loading" class="my-table">
      <el-table-column show-overflow-tooltip label="研学号" prop="number"></el-table-column>
      <el-table-column show-overflow-tooltip label="姓名" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip label="性别" prop="sexLabel"></el-table-column>
      <el-table-column show-overflow-tooltip label="地区" prop="region"></el-table-column>
      <el-table-column show-overflow-tooltip label="职业" prop="profession"></el-table-column>
      <el-table-column show-overflow-tooltip label="出生日期" prop="birthLabel"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="'comment'"
            type="text"
            size="small"
            @click="handleDetail(scope.$index, scope.row)"
          >查看评论</el-button>
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
import { commentListUrl } from 'api/admin'
import { post, formatDate } from 'utils'
export default {
  name: 'adminComment',
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
      total: 0
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
      const { data: { data, pageIndex, count } } = await post(commentListUrl, this.params)
      // console.log(data, 888)
      data.map(item => {
        item.birthLabel = `${formatDate(new Date(item.birth), 'yyyy-MM-dd')}`
        item.sexLabel = item.sex === 1 ? '男' : '女'
        item.profession = item.professionVO && item.professionVO.name
        item.region = item.regionVO && item.regionVO.name
      })
      this.tableData = data
      this.currentIndex = pageIndex
      this.total = count
    },
    async handleDetail (index, row) { // 查看评论
      this.$router.push({ name: 'adminCommentDetail', query: { id: row.studyStudentId } })
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
