<template>
  <div class="photo-box">
    <ul>
      <li
        :class="['text-btn', dayIndex === active ? 'active': '']"
        v-for="(item, dayIndex) in journeyVOList"
        :key="dayIndex"
        @click="handleClick(dayIndex)"
      >第{{dayIndex + 1}}天</li>
    </ul>
    <h4 class="margin-10">第{{active + 1}}天 ({{date(journey.date)}})</h4>
    <div v-infinite-scroll="loadData" :infinite-scroll-disabled="disabled">
      <el-image class="img" v-for="img in photoList" :key="img.attachmentId" :src="img.viewPath"></el-image>
    </div>
    <empty v-if="!photoList.length" text="暂无图片数据" />
  </div>
</template>

<script>
import { photoUrl } from 'api/group'
import { post, formatDate } from 'utils'
import Empty from 'components/Empty'
export default {
  components: {
    Empty
  },
  props: {
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
      photoList: []
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
      this.params.studyTourJourneyId = this.journey.studyTourJourneyId
      this.loading = true
      const { data: { count = 0, data } } = await post(photoUrl, this.params)
      this.loading = false
      this.photoList = this.photoList.concat(data)
      this.params.pageIndex++
      if (this.photoList.length >= count) {
        this.noMore = true
      }
    },
    date (date) {
      return formatDate(new Date(date), 'yyyy-MM-dd')
    },
    handleClick (index) {
      this.active = index
      this.params.pageIndex = 1
      this.noMore = false
      this.photoList = []
      this.loadData()
    }
  }
}
</script>

<style lang="scss">
.photo-box {
  .img {
    margin: 10px;
    width: 250px;
    height: 160px;
    border-radius: 10px;
  }
}
</style>
