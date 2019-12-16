<template>
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
                ID号：
                <span class="grey-color">{{detail.teacherId}}</span>
              </div>
              <div class="h-30">
                姓名：
                <span class="grey-color">{{detail.name}}</span>
              </div>
              <div class="h-30">
                性别：
                <span class="grey-color">{{detail.sex===1?"男":"女"}}</span>
              </div>
              <div class="h-30">
                角色：
                <span class="grey-color">{{detail.role===1?"接团老师":""}}</span>
              </div>
              <div class="h-30">
                手机号：
                <span class="grey-color">{{detail.phone}}</span>
              </div>
              <div class="h-30">
                身份证号：
                <span class="grey-color">{{detail.idCard}}</span>
              </div>
            </el-col>
            <el-col :span="10" :xs="12" :sm="12" :md="10" :lg="10">
              <!-- <tx-map :position="position"></tx-map> -->
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { teacherDetailUrl } from 'api/group'
import { post } from 'utils'
export default {
  name: 'groupTeacherDetail',
  data () {
    return {
      detail: {}
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
      const { data } = await post(teacherDetailUrl, `id=${id}`)
      //   console.log(data)
      this.detail = data
    }
  }
}
</script>
