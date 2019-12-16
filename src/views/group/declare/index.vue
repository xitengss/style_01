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
        <el-popover trigger="hover" width="400">
          <p>
            (一)关于申报奖励条件
            <br>1、关于组团要求。原则上每团16名（含）以上台湾青少年，年龄在6-28周岁，应优先选择台湾地区在校学生。且每批团组中原则上应有30%以上为首次来大陆人员，随团老师比例原则上不超过团员总数的5%，组团工作人员原则上不超过团员总数的2%。
            <br>2、关于研学行程。必须在集美至少安排3天2夜以上行程，至少在集美区两家以上特色文化景区（点）开展研学课程（经区政府认定，具有研学旅行资质的景区、景点和课程）。有两家以上基地课程鼓励与集美辖区院校（包括大中专院校、中小学校）开展座谈、校园观光、联谊等交流活动。
          </p>
          <el-button slot="reference" type="text">申报条件</el-button>
        </el-popover>
      </ul>
      <el-input placeholder="请输入研学团名称关键字搜索" v-model.trim="searchContent">
        <i class="el-input__icon el-icon-search" slot="suffix" @click="handleIconSearchClick"></i>
      </el-input>
    </div>
    <el-table :data="tableData" v-loading="loading" class="my-table">
      <el-table-column show-overflow-tooltip label="研学团">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleDetail(scope.$index, scope.row)"
          >{{scope.row.studyName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="团员人数" prop="countApply"></el-table-column>
      <el-table-column show-overflow-tooltip label="首次来大陆" prop="countFirstPercent"></el-table-column>
      <el-table-column show-overflow-tooltip label="教师比例" prop="countTeacherPercent"></el-table-column>
      <el-table-column show-overflow-tooltip label="随团工作人员比例" prop="countWorkPercent"></el-table-column>
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
            v-permission="'groupDeclareUpdate'"
            type="text"
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑申报资料</el-button>
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
import { declareListUrl } from 'api/group'
import { post, formatDate } from 'utils'
import styles from 'assets/styles/variable.scss'
export default {
  name: 'groupDeclare',
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
      dialogTitle: ''
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
        item.declareDate == null ? item.time = '' : item.time = formatDate(new Date(item.declareDate), 'yyyy-MM-dd hh:mm:ss')
        item.countFirstPercent = `${item.countFirst}%`
        item.countTeacherPercent = `${item.countTeacher}%`
        item.countWorkPercent = `${item.countWork}%`
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
    handleEdit (index, row) { // 编辑
      this.$router.push({ name: 'groupDeclareCreate', query: { id: row.studyTourDeclareId } })
    },
    handleDetail (index, row) { // 详情
      this.$router.push({ name: 'groupDeclareDetail', query: { id: row.studyTourDeclareId } })
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
