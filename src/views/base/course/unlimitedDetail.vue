<template>
  <div class="base-box base-course-detail-box">
    <div class="header">
      <h2>
        <i class="study-icon-shu bg-icon"></i>
        {{detail.name}}
      </h2>
    </div>
    <div class="base-content">
      <el-row>
        <el-col :span="4" :xs="8" :sm="8" :md="4" :lg="4">
          <div class="img">
            <div
              class="status"
              :style="{background: detail.status ? styles.mainColor : styles.greyColor }"
            >{{detail.status ? '有效': '无效'}}</div>
            <el-image :src="detail.cover" fit="fill"></el-image>
          </div>
        </el-col>
        <el-col :span="6" :xs="8" :sm="8" :md="6" :lg="6">
          <div class="h-30">
            所属基地：
            <span class="grey-color">{{detail.studyBaseName}}</span>
          </div>
          <div class="h-30">
            课程时长：
            <span class="grey-color">{{detail.duration}}</span>
          </div>
          <div class="h-30">
            联系地址：
            <span class="grey-color">{{detail.address}}</span>
          </div>
          <div class="h-30">
            联系电话：
            <span class="grey-color">{{detail.phone}}</span>
          </div>
        </el-col>
        <el-col :span="6" :xs="8" :sm="8" :md="6" :lg="6">
          <div class="h-30">
            课程费用：
            <span class="danger">￥{{detail.preferentialPrice}}</span>
          </div>
          <div class="h-30">
            课程原价：
            <span class="grey-color">￥{{detail.price}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="base-content border-bottom-dashed">
      <h3 class="title-left-boder">课程目标</h3>
      <div class="content">{{detail.target}}</div>
    </div>
    <div class="base-content border-bottom-dashed">
      <h3 class="title-left-boder">研学内容</h3>
      <div class="content">{{detail.content}}</div>
    </div>
    <div class="base-content">
      <h3 class="title-left-boder">课程介绍</h3>
      <div class="content">{{detail.presentation}}</div>
      <div class="img-list">
        <el-image
          v-for="item in detail.attachmentVOList"
          :key="item.attachmentId"
          :src="item.viewPath"
          fit="fill"
        ></el-image>
      </div>
    </div>
  </div>
</template>

<script>
import { courseUnlimitedDetailUrl } from 'api/base'
import { get } from 'utils'
import styles from 'assets/styles/variable.scss'
export default {
  name: 'baseCourseUnlimitedDetail',
  data () {
    return {
      detail: {}
    }
  },
  computed: {
    styles () {
      return styles
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
      const { data } = await get(courseUnlimitedDetailUrl, `id=${id}`)
      data.cover = data.cover ? data.cover : require('assets/img/img_course.png')
      this.detail = data
    }
  }
}
</script>
