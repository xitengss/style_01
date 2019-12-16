<template>
  <div class="base-box group-tour-detail-box">
    <div class="w-header border-bottom-solid">
      <div>
        <h2 class="mess">{{detail.name}}</h2>
      </div>
      <div
        class="status"
        :style="{background: statusColor[detail.status]}"
      >{{statusList[detail.status]}}</div>
    </div>
    <div class="w-base-content">
      <el-row :gutter="20">
        <el-col :span="8" :xs="10" :sm="8" :md="6" :lg="7">
          <div class="img">
            <el-image :src="detail.viewPath" fit="fill"></el-image>
          </div>
        </el-col>
        <el-col :span="16" :xs="12" :sm="16" :md="18" :lg="17">
          <el-row>
            <el-col :span="10" :xs="12" :sm="12" :md="10" :lg="10">
              <div class="h-mess">
                组团单位：
                <span class="grey-color w-r">{{detail.baseOrTourName}}</span>
              </div>
              <div class="h-mess">
                活动时间：
                <span class="grey-color w-r">{{detail.time}}</span>
              </div>
            </el-col>
            <el-col :span="10" :xs="12" :sm="12" :md="10" :lg="10">
              <div class="h-mess">
                优惠价：
                <span class="danger">￥{{detail.preferentialPrice}}</span>
              </div>
              <div class="h-mess">
                原价：
                <span class="grey-color w-r">￥{{detail.price}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="h-mess">
                <span class="w-l">介绍信息：</span>
                <span class="grey-color w-r">{{detail.content}}</span>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName" class="tab">
      <el-tab-pane label="研学详情" name="first">
        <detail v-if="detail.journeyVOList" :detail="detail"/>
      </el-tab-pane>
      <el-tab-pane label="图文直播" name="second">
        <spread
          v-if="detail.journeyVOList"
          :journeyVOList="detail.journeyVOList"
          :studyTourId="detail.studyTourId"
        />
      </el-tab-pane>
      <el-tab-pane label="图片相册" name="third">
        <photo v-if="detail.journeyVOList" :journeyVOList="detail.journeyVOList"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { tourDetailUrl } from 'api/group'
import { post, formatDate } from 'utils'
import Detail from './components/UnlimitedDetail'
import Photo from './components/UnimitedPhoto'
import Spread from './components/UnlimitedSpread'
import styles from 'assets/styles/variable.scss'
export default {
  name: 'groupTourUnlimitedDetail',
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
        this.$30age.error('数据异常!')
        this.$router.back()
        return
      }
      const { data } = await post(tourDetailUrl, `id=${id}`)
      console.log(data)
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
    }
  }
}
</script>

<style>
.w-header {
  display: flex;
  justify-content: left;
  padding-bottom: 12px;
}
.mess {
  font-size: 24px;
  font-family: " Microsoft YaHei";
}
.status {
  margin: 5px 0 0 15px;
  padding: 0 10px;
  height: 24px;
  line-height: 27px;
  font-size: 14px;
  color: #fff;
  border-radius: 5px;
}
/* 主体内容 */
.w-base-content {
  padding: 28px 0;
}
.img {
  width: 100%;
  height: 150px;
  padding: 0;
}
.img img {
  height: 150px;
}
.h-mess {
  display: flex;
  margin-bottom: 10px;
  color: #74767a;
}
.h-mess .w-l {
  color: #74767a;
  width: 120px;
}
.h-mess .w-r {
  color: #323538;
}
.download {
  color: #0077bb;
  font-size: 12px;
}
</style>
