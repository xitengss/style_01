<template>
  <div class="base-box group-tour-detail-box">
    <div class="header">
      <h2>
        <i class="study-icon-shu bg-icon"></i>
        {{detail.name}}
      </h2>
      <div>
        <el-button v-permission="'tourSaveTemplate'" @click="handleSaveTemplate">保存模版</el-button>
        <el-button
          v-if="detail.status === 0"
          v-permission="'tourUpdate'"
          type="primary"
          @click="handleEdit"
        >编辑</el-button>
      </div>
    </div>
    <div class="base-content">
      <el-row>
        <el-col :span="4" :xs="8" :sm="8" :md="4" :lg="4">
          <div class="img">
            <div
              class="status"
              :style="{background: statusColor[detail.status]}"
            >{{statusList[detail.status]}}</div>
            <el-image :src="detail.viewPath" fit="fill"></el-image>
          </div>
        </el-col>
        <el-col :span="20" :xs="16" :sm="16" :md="20" :lg="20">
          <el-row>
            <el-col :span="10" :xs="12" :sm="12" :md="10" :lg="10">
              <div class="h-30">
                i研学：
                <span class="grey-color">{{detail.baseOrTourName}}</span>
              </div>
              <div class="h-30">
                活动时间：
                <span class="grey-color">{{detail.time}}</span>
              </div>
            </el-col>
            <el-col :span="10" :xs="12" :sm="12" :md="10" :lg="10">
              <div class="h-30">
                优惠价：
                <span class="danger">￥{{detail.preferentialPrice}}</span>
              </div>
              <div class="h-30">
                原价：
                <span class="grey-color">￥{{detail.price}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="h-30" style="display:flex">
                <span style="width:100px"> 介绍信息：</span>
                <div class="grey-color">{{detail.content}}</div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="研学详情" name="first">
        <detail v-if="detail.journeyVOList" :detail="detail" />
      </el-tab-pane>
      <el-tab-pane label="图文直播" name="second">
        <spread
          v-if="detail.journeyVOList"
          :journeyVOList="detail.journeyVOList"
          :studyTourId="detail.studyTourId"
        />
      </el-tab-pane>
      <el-tab-pane label="图片相册" name="third">
        <photo v-if="detail.journeyVOList" :journeyVOList="detail.journeyVOList" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { tourDetailUrl, tourTemplateUrl } from 'api/group'
import { post, formatDate } from 'utils'
import Detail from './components/Detail'
import Photo from './components/Photo'
import Spread from './components/Spread'
import styles from 'assets/styles/variable.scss'
export default {
  name: 'groupTourDetail',
  components: {
    Detail,
    Spread,
    Photo
  },
  data () {
    return {
      activeName: 'first',
      detail: {},
      statusColor: [styles.warningColor, styles.errorColor, styles.successColor, styles.mainColor, styles.greyColor],
      statusList: ['草稿箱', '确认中', '报名中', '开团中', '已结束']
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const { id } = this.$route.query
      if (!id) {
        this.$message.error('数据异常!')
        this.$router.back()
        return
      }
      const { data } = await post(tourDetailUrl, `id=${id}`)
      let arr = []
      let baseList = []
      data.journeyVOList.map(journey => {
        journey.detailsVOList.map(detail => {
          arr = arr.concat(detail.courseVOList)
        })
      })
      for (let i = 0; i < arr.length; i += 3) {
        baseList.push(arr.slice(i, i + 3))
      }
      data.baseList = baseList
      data.teacherList = data.teacherVOList.map(item => item.name).join(',')
      data.time = `${formatDate(new Date(data.startDate), 'yyyy-MM-dd')} 至 ${formatDate(new Date(data.endDate), 'yyyy-MM-dd')}`
      data.viewPath = data.viewPath ? data.viewPath : require('assets/img/img_research.png')
      this.detail = data
    },
    handleEdit () { // 修改
      this.$router.push({ name: 'groupTourCreate', query: { id: this.detail.studyTourId } })
    },
    async handleSaveTemplate () { // 保存模版
      const { resultMessage } = await post(tourTemplateUrl, `id=${this.detail.studyTourId}`)
      this.$message({
        type: 'success',
        message: resultMessage,
        duration: 1500
      })
    }
  }
}
</script>
