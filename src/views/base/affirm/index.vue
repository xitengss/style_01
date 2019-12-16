<template>
  <div class="base-box base-affirm-box">
    <div class="header">
      <div></div>
      <el-input placeholder="请输入i研学关键字搜索" v-model.trim="searchContent">
        <i class="el-input__icon el-icon-search" slot="suffix" @click="handleIconSearchClick"></i>
      </el-input>
    </div>
    <el-table :data="tableData" v-loading="loading" class="my-table">
      <el-table-column show-overflow-tooltip label="研学团名称" prop="studyTourName"></el-table-column>
      <el-table-column show-overflow-tooltip label="课程名称" prop="courseName"></el-table-column>
      <el-table-column show-overflow-tooltip label="上课时间" prop="time"></el-table-column>
      <el-table-column show-overflow-tooltip label="课程时长" prop="duration"></el-table-column>
      <el-table-column show-overflow-tooltip label="i研学" prop="tourName"></el-table-column>
      <el-table-column show-overflow-tooltip label="联系电话" prop="relationPhone"></el-table-column>
      <el-table-column show-overflow-tooltip label="状态">
        <template slot-scope="scope">
          <span>
            <i class="is-dot" :style="{background: ratifyColor[scope.row.ratify]}"></i>
            {{ratifyList[scope.row.ratify]}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="'affirmCourse'"
            v-if="scope.row.ratify === 0"
            type="text"
            size="small"
            @click="handleAffirm(scope.$index, scope.row, 1)"
          >同意</el-button>
          <el-button
            type="text"
            size="small"
            v-if="scope.row.ratify === 0"
            v-permission="'affirmCourse'"
            @click="handleAffirm(scope.$index, scope.row, 2)"
          >拒绝</el-button>
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
import { getAffirmCourseListUrl, affirmCourseUrl } from 'api/base'
import { post, formatDate } from 'utils'
import styles from 'assets/styles/variable.scss'
export default {
  name: 'baseCourse',
  data () {
    return {
      searchContent: '',
      loading: false,
      tableData: [],
      params: {
        // name: '',
        pageIndex: 1,
        pageSize: 10
      },
      currentIndex: 1,
      total: 0,
      ratifyColor: [styles.warningColor, styles.successColor, styles.greyColor],
      ratifyList: ['待确认', '已同意', '已拒绝']
    }
  },
  computed: {
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
      const { data: { data, pageIndex, count } } = await post(getAffirmCourseListUrl, this.params)
      data.map(item => {
        item.time = `${formatDate(new Date(item.date), 'yyyy-MM-dd')} ${item.time}`
        item.duration = `${item.duration}分钟`
      })
      this.tableData = data
      this.currentIndex = pageIndex
      this.total = count
    },
    async handleAffirm (index, row, ratify) { // 修改
      const { resultMessage } = await post(affirmCourseUrl, { studyTourJourneyDetailsCourseId: row.studyTourJourneyDetailsCourseId, ratify })
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
