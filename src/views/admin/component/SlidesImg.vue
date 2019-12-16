<template>
  <div class="slides-img-box">
    <div class="img-list" v-for="(img,index) in imgList" :key="index">
      <div>
        <img :src="img.viewPath" :width="imgWidth" :height="imgHeight" />
        <i class="iconfont study-icon-shanchu1 icon danger" @click="imgDel(index)"></i>
      </div>
      <el-input class="input" v-model="img.pictureDescription"></el-input>
    </div>
    <el-upload
      v-if="imgList.length < num"
      :headers="headers"
      class="slides-upload"
      :action="imgUploadUrl"
      :show-file-list="false"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :http-request="uploadSectionFile"
    >
      <div>
        <i class="study-icon-ic_join_dialing_norm"></i>
        <br />
        <span class="grey-color-l">请上传（750像素（宽）* 280像素（高））不大于500k的封面图片</span>
      </div>
    </el-upload>
  </div>
</template>
<script>
import { uploadUrl } from 'api'
import { post } from 'utils'
import { isPhotoRegexp } from 'utils/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'SlidesImg',
  props: {
    num: {
      type: Number,
      default: 1
    },
    imgWidth: {
      type: Number,
      default: 240
    },
    imgHeight: {
      type: Number,
      default: 140
    },
    imgList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    imgUploadUrl () {
      return uploadUrl
    },
    headers () {
      return {
        token: this.token
      }
    },
    ...mapGetters([
      'token'
    ])
  },
  methods: {
    async uploadSectionFile (param) { // 自定义上传图片方法
      const reParams = {
        file: param.file
      }
      const res = await post(uploadUrl, reParams)
      param.onSuccess(res)
    },
    handleSuccess (res, file, fileList) { // 图片上传成功
      if (!res) {
        return
      }
      const { data } = res
      this.imgList.push({ attachmentId: data.id, pictureDescription: '', viewPath: data.viewPath })
    },
    beforeUpload (file) { // 图片上传前
      this.active = 2
      const isphoto = isPhotoRegexp.test(file.type)
      const isLt500k = file.size / 1024 < 500
      if (!isphoto) {
        this.$message.error('上传图片只能是jpg和png格式!')
        return false
      }
      if (!isLt500k) {
        this.$message.error('上传图片大小不能超过 500k!')
      }
      return isphoto && isLt500k
    },
    imgDel (index) { // 删除图片
      this.imgList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.slides-img-box {
  display: flex;
  flex-direction: row;
  padding: 20px 0;
  overflow: auto;
  .img-list {
    position: relative;
    margin-right: 20px;
    .icon {
      position: absolute;
      top: -6px;
      right: -6px;
    }
    .input {
      margin-top: 10px;
      width: 240px;
    }
  }
  .slides-upload {
    padding-top: 40px;
    display: block;
    width: 240px;
    height: 140px;
    text-align: center;
    border: 1px solid $color-border;
    border-radius: 4px;
    .study-icon-ic_join_dialing_norm {
      font-size: 24px;
      color: $color-grey;
    }
  }
}
</style>
