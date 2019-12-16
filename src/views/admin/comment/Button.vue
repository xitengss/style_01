<template>
  <el-form-item label-width="0">
    <span>
      <i class="study-icon-zengjia main-color" v-if="isShowAddBtn" @click="add"></i>
      <i class="study-icon-jianshao danger" v-if="isShowDelBtn" @click="del"></i>
    </span>
  </el-form-item>
</template>

<script>
export default {
  name: 'Button',
  props: {
    button: {
      type: Object,
      required: true,
      default: () => ({
      })
    },
    isShowAddBtn: {
      default: true
    },
    isShowDelBtn: {
      default: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    add () {
      // 增加
      this.$emit('add')
    },
    del () {
      // 减少
      this.$emit('del', this.index)
    }
  }
}
</script>
