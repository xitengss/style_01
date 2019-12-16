<template>
<!-- 可作为基地微主页 -->
  <div class="base-box group-tour-detail-box">
    <div class="header">
      <h2>
        <i class="study-icon-shu bg-icon"></i>
        {{detail.name}}
      </h2>
    </div>
    <!-- 详情内容区 -->
    <div class="base-content">
      <el-row>
        <el-col :span="20" :xs="16" :sm="16" :md="20" :lg="20">
          <el-row>
            <el-col :span="10" :xs="12" :sm="12" :md="10" :lg="10">
              <div class="h-30">
                单元名称：
                <span class="grey-color">{{detail.name}}</span>
              </div>
              <div class="h-30">
                联系地址：
                <span class="grey-color">{{detail.address}}</span>
              </div>
              <div class="h-30">
                联系人员：
                <span class="grey-color">{{detail.relationPeople}}</span>
              </div>
              <div class="h-30">
                联系电话：
                <span class="grey-color">{{detail.relationPhone}}</span>
              </div>
            </el-col>
            <!-- <el-col :span="10" :xs="12" :sm="12" :md="10" :lg="10">
              <tx-map :position="position"></tx-map>
            </el-col> -->
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import styles from 'assets/styles/variable.scss'
import { studybaseDetailUrl } from 'api/admin'
import { post } from 'utils'
// import TxMap from 'components/Map'
export default {
  data () {
    return {
      detail: {}
    }
  },
  computed: {
    position () {
      return { lat: this.detail.latitude, lng: this.detail.longitude }
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
      const { data } = await post(studybaseDetailUrl, `studyBaseId=${id}`)
      //   console.log(data)
      console.log(data)
      this.detail = data
    }
  }
}
</script>
