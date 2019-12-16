<template>
  <div class="base-box admin-comment-detail-box">
    <div class="header">
      <h2>
        <i class="study-icon-xuesheng bg-icon"></i>
        {{info.name}}
      </h2>
    </div>
    <div class="base-content border-bottom">
      <el-row>
        <el-col :span="7" :xs="24" :sm="12" :md="7" :lg="7">
          <div class="h-30">
            研学号：
            <span class="grey-color">{{info.number}}</span>
          </div>
          <div class="h-30">
            证件类型：
            <span class="grey-color">{{info.idType}}</span>
          </div>
        </el-col>
        <el-col :span="7" :xs="24" :sm="12" :md="7" :lg="7">
          <div class="h-30">
            出生年月：
            <span class="grey-color">{{info.birthLabel}}</span>
          </div>
          <div class="h-30">
            证件号码：
            <span class="grey-color">{{info.idCard}}</span>
          </div>
        </el-col>
        <el-col :span="7" :xs="24" :sm="12" :md="7" :lg="7">
          <div class="h-30">
            性别：
            <span class="grey-color">{{info.sexLabel}}</span>
          </div>
          <div class="h-30">
            地区：
            <span class="grey-color">{{info.region}}</span>
          </div>
        </el-col>
        <el-col :span="3" :xs="8" :sm="12" :md="3" :lg="3">
          <div class="img fr">
            <el-image v-if="info.cover" :src="info.cover" fit="fill"></el-image>
            <i v-else class="study-icon-xuesheng icon"></i>
          </div>
        </el-col>
      </el-row>
    </div>
    <ul class="margin-20">
      <li
        :class="['text-btn', index === active ? 'active': '']"
        v-for="(item, index) in tourComment"
        :key="item.studyName"
        @click="active = index"
      >{{item.studyName}}</li>
    </ul>
    <ul>
      <li
        v-for="item in commentList"
        :key="item.gmtCreate"
        class="base-content border-bottom-dashed"
      >
        <h4 class="main-color"># {{item.courseName}} ( {{item.time}} ) #</h4>
        <p class="grey-color padding-tb-10">{{item.content}}</p>
        <div class="grey-color-l">{{date(item.gmtCreate)}}</div>
      </li>
    </ul>
    <empty v-if="isEmpty" text="暂无评论数据" />
  </div>
</template>

<script>
import { commentDetailUrl } from 'api/admin'
import { get, formatDate } from 'utils'
import Empty from 'components/Empty'
export default {
  name: 'adminCommentDetail',
  components: {
    Empty
  },
  data () {
    return {
      studyStudentId: '',
      info: {},
      active: 0,
      tourComment: []
    }
  },
  created () {
    this.init()
  },
  computed: {
    commentList () {
      return this.tourComment[this.active] && this.tourComment[this.active].commentVOList
    },
    isEmpty () {
      return !this.tourComment.length || !this.commentList.length
    }
  },
  methods: {
    init () { // 初始化
      const { id } = this.$route.query
      if (!id) {
        this.$message.error('数据异常')
        this.$router.back()
        return
      }
      this.studyStudentId = id
      this.loadData()
    },
    async loadData () { // 加载数据
      const { data } = await get(`${commentDetailUrl}`, `studyStudentId=${this.studyStudentId}`)
      data.birthLabel = `${formatDate(new Date(data.birth), 'yyyy-MM-dd')}`
      data.sexLabel = data.sex === 1 ? '男' : '女'
      data.idType = data.idTypeVO && data.idTypeVO.name
      data.profession = data.professionVO && data.professionVO.name
      data.region = data.regionVO && data.regionVO.name
      Object.assign(this.info, data)
      this.tourComment = data.tourCommentVOList ? data.tourCommentVOList : []
    },
    date (date) {
      return formatDate(new Date(date), 'yyyy-MM-dd hh:mm:ss')
    }
  }
}
</script>

<style lang="scss">
.admin-comment-detail-box {
  .text-btn {
    width: inherit;
    padding: 0 10px;
  }
  .img {
    margin: -10px 20px 0 0;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: $color-text-ll;
    padding-right: 0;
    background: #f2f2f2;
    i {
      font-size: 50px;
      color: $color-text-lll;
    }
    img {
      height: 80px;
    }
  }
}
</style>
