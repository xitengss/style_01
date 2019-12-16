<template>
  <div>
    <journey-item v-for="item in journey.detailsVOList" :key="item.dateType" :journeyItem="item"></journey-item>
  </div>
</template>

<script>
import JourneyItem from './JourneyItem'
export default {
  name: 'Journey',
  components: {
    JourneyItem
  },
  props: {
    journey: {
      type: Object,
      required: true,
      default: () => ({
        detailsVOList: []
      })
    }
  }
}
</script>
