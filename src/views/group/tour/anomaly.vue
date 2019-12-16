<template>
  <div class="base-box">
    <div class="header">
      <h2>
        <i class="study-icon-shu bg-icon"></i>
        {{name}}
      </h2>
    </div>
    <el-tabs v-model="params.date" @tab-click="loadData">
      <el-tab-pane v-for="item in dateList" :key="item.date" :label="item.time" :name="item.time"></el-tab-pane>
    </el-tabs>
    <el-table :data="tableData" v-loading="loading" class="my-table">
      <el-table-column show-overflow-tooltip label="研学号" prop="number"></el-table-column>
      <el-table-column show-overflow-tooltip label="姓名" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip label="性别" prop="sexLabel"></el-table-column>
      <el-table-column show-overflow-tooltip label="联系电话" prop="phone"></el-table-column>
      <el-table-column show-overflow-tooltip label="监护人姓名" prop="profession"></el-table-column>
      <el-table-column show-overflow-tooltip label="监护人联系电话" prop="guardianPhone"></el-table-column>
      <el-table-column label="入住情况" align="center">
        <template>
          <span class="danger">未正常入住</span>
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
import { getJourneyListUrl, stayAnomalyListUrl } from 'api/group'
import { post, formatDate } from 'utils'
export default {
  name: 'groupTourAnomaly',
  data () {
    return {
      id: '',
      name: '',
      loading: false,
      dateList: [],
      tableData: [],
      params: {
        date: '',
        pageIndex: 1,
        pageSize: 10,
        studyTourId: ''
      },
      currentIndex: 1,
      total: 0
    }
  },
  created () {
    this.loadDate()
  },
  methods: {
    async loadDate () {
      const { id, name } = this.$route.query
      if (!id) {
        this.$message.error('数据异常!')
        this.$router.back()
        return
      }
      this.id = id
      this.name = name
      this.params.studyTourId = id
      const { data } = await post(getJourneyListUrl, `id=${this.id}`)
      data.forEach(item => {
        item.time = formatDate(new Date(item.date), 'yyyy-MM-dd')
      })
      this.dateList = data
      this.params.date = data.length ? data[0].time : ''
      this.loadData()
    },
    async loadData () { // 加载数据
      const { data: { data, pageIndex, count } } = await post(stayAnomalyListUrl, this.params)
      data.map(item => {
        item.sexLabel = item.sex === 1 ? '男' : '女'
      })
      this.tableData = data
      this.currentIndex = pageIndex
      this.total = count
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
