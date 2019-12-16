<template>
  <div class="base-box group-template-detail-box">
    <div class="header">
      <h2>
        <i class="study-icon-shu bg-icon"></i>
        {{detail.name}}
      </h2>
      <el-button v-permission="'templateUpdate'" type="primary" @click="handleEdit">编辑</el-button>
    </div>
    <div class="base-content">
      <el-row>
        <el-col :span="4" :xs="8" :sm="8" :md="4" :lg="4">
          <div class="img">
            <el-image :src="detail.viewPath" fit="fill"></el-image>
          </div>
        </el-col>
        <el-col :span="20" :xs="16" :sm="16" :md="20" :lg="20">
          <el-row>
            <el-col :span="10" :xs="12" :sm="12" :md="10" :lg="10">
              <div class="h-30">
                i研学：
                <span class="grey-color">{{detail.studyBase}}</span>
              </div>
              <div class="h-30">
                活动时间：
                <span class="grey-color">{{detail.duration}}</span>
              </div>
              <div class="h-30">
                咨询电话：
                <span class="grey-color">{{detail.phone}}</span>
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
              <div class="h-30">
                联系地址：
                <span class="grey-color">{{detail.address}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="h-30">
                介绍信息：
                <span class="grey-color">{{detail.content}}</span>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="base-content border-bottom-dashed">
      <h3 class="title-left-boder">路线安排</h3>
      <div class="content">
        <line-plan :journeyVOList="detail.journeyVOList"/>
      </div>
    </div>
  </div>
</template>

<script>
import { templateDetailUrl } from 'api/group'
import { post } from 'utils'
import LinePlan from '../components/LInePlan'
export default {
  name: 'groupTemplateDetail',
  data () {
    return {
      detail: {}
    }
  },
  components: {
    LinePlan
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
      const { data } = await post(templateDetailUrl, `id=${id}`)
      data.viewPath = data.viewPath ? data.viewPath : require('assets/img/img_research.png')
      this.detail = data
    },
    handleEdit () { // 修改
      this.$router.push({ name: 'groupTemplateCreate', query: { id: this.detail.studyTourTemplateId } })
    }
  }
}
</script>
