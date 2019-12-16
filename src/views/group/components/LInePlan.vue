<template>
  <div class="line-plan">
    <ul class="day-list">
      <li
        :class="['text-btn', dayIndex === active ? 'active': '']"
        v-for="(item, dayIndex) in journeyVOList"
        :key="dayIndex"
        @click="active = dayIndex"
      >第{{dayIndex + 1}}天</li>
    </ul>
    <div class="day-content">
      <div
        class="progress-item"
        v-for="(item, detailIndex) in journey.detailsVOList"
        :key="item.studyTourJourneyDetailsId"
      >
        <div class="left">
          <div v-if="journey.date">{{date(journey.date)}}</div>
          <div class="text-r">{{list[item.dateType]}}</div>
        </div>
        <div class="middle">
          <i class="icon"></i>
          <div class="line" v-if="detailIndex !== journey.detailsVOList.length -1"></div>
        </div>
        <div class="right">
          <h4 class="h-30">{{item.title}}</h4>
          <div class="h-30 grey-color-l">课程：{{course(item.courseVOList)}}</div>
          <div>
            <el-image
              class="img"
              v-for="img in item.attachmentVOList"
              :key="img.attachmentId"
              :src="img.viewPath"
            ></el-image>
          </div>
        </div>
      </div>
      <empty v-if="!journey.detailsVOList.length" text="暂无路线安排" />
    </div>
  </div>
</template>

<script>
import { formatDate } from 'utils'
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
  computed: {
    journey () {
      return this.journeyVOList[this.active]
    }
  },
  data () {
    return {
      active: 0,
      list: ['', '上午', '下午', '晚上']
    }
  },
  methods: {
    date (date) {
      return formatDate(new Date(date), 'yyyy-MM-dd')
    },
    course (list) {
      return list.map(item => `${item.course}(${item.time})`).join(',')
    }
  }
}
</script>

<style lang="scss">
.line-plan {
  display: flex;
  .day-list {
    flex: 0 0 70px;
    width: 70px;
    .text-btn {
      display: block;
      width: 70px;
      padding-right: 10px;
    }
  }
  .day-content {
    flex: 1;
    .progress-item {
      display: flex;
      padding: 0 10px;
      .left {
        padding-top: 6px;
      }
      .middle {
        position: relative;
        display: flex;
        padding: 10px;
        .icon {
          position: relative;
          z-index: 1;
          left: 1px;
          width: 10px;
          height: 10px;
          font-size: 14px;
          box-sizing: border-box;
          background: #fff;
          transition: 0.15s ease-out;
          color: #c0c4cc;
          border-radius: 50%;
          border: 1px solid #c0c4cc;
          border-color: inherit;
        }
        .line {
          position: absolute;
          left: 50%;
          top: 28px;
          width: 2px;
          height: 85%;
          background: $color-border;
        }
      }
      .right {
        flex: 1;
        padding: 5px 0;
        background: #fff;
        border-radius: 4px;
        .img {
          width: 120px;
          height: 120px;
        }
      }
    }
  }
}
</style>
