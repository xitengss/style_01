<template>
  <div class="empty-box">
    <img src="~assets/img/empty_img.png" class="empty-img" />
    <p class="main-color text">{{text}}</p>
  </div>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    text: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  .text {
    font-size: 18px;
    margin-top: 20px;
  }
}
</style>
