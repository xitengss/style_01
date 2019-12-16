<template>
  <div class="spread-box">
    <ul class="day-list">
      <li
        :class="['text-btn', dayIndex === active ? 'active': '']"
        v-for="(item, dayIndex) in journeyVOList"
        :key="dayIndex"
        @click="handleClick(dayIndex)"
      >第{{dayIndex + 1}}天</li>
    </ul>
    <ul v-infinite-scroll="loadData" :infinite-scroll-disabled="disabled">
      <li
        v-for="item in spreadList"
        :key="item.gmtCreate"
        class="base-content border-bottom-dashed"
      >
        <h4>
          <i class="study-icon-zhanghaodenglu"></i>
          {{item.teacherName}}
        </h4>
        <p class="grey-color-l p-10">{{item.content}}</p>
        <div>
          <el-image
            class="img"
            v-for="img in item.journeySpreadAttachmentVOList"
            :key="img.attachmentId"
            :src="img.viewPath"
          ></el-image>
        </div>
        <div class="grey-color-l">
          {{date(item.gmtCreate, 'yyyy-MM-dd hh:mm:ss')}}
          <i class="study-icon-dianzan"></i>
          {{item.praise}}赞
        </div>
      </li>
    </ul>
    <empty v-if="!spreadList.length" text="暂无图文直播数据" />
  </div>
</template>

<script>
import { spreadUrl } from 'api/group'
import { post, formatDate } from 'utils'
import Empty from 'components/Empty'
export default {
  components: {
    Empty
  },
  props: {
    studyTourId: {
      type: String,
      default: ''
    },
    journeyVOList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      active: 0,
      params: {
        pageIndex: 1,
        pageSize: 10
      },
      noMore: false,
      loading: false,
      spreadList: []
    }
  },
  computed: {
    journey () {
      return this.journeyVOList[this.active]
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    async loadData () {
      this.params.studyTourId = this.studyTourId
      this.params.gmtCreate = this.journey.date
      this.loading = true
      const { data: { count = 0, data } } = await post(spreadUrl, this.params)
      this.loading = false
      this.spreadList = this.spreadList.concat(data)
      this.params.pageIndex++
      if (this.spreadList.length >= count) {
        this.noMore = true
      }
    },
    date (date, format) {
      return formatDate(new Date(date), format)
    },
    handleClick (index) {
      this.active = index
      this.params.pageIndex = 1
      this.noMore = false
      this.spreadList = []
      this.loadData()
    }
  }
}
</script>

<style lang="scss">
.spread-box {
  padding: 0 20px;
  .p-10 {
    padding: 10px 0;
  }
  .img {
    width: 120px;
    height: 120px;
    margin-right: 10px;
  }
}
</style>
