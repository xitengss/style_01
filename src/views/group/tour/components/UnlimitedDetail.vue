<template>
  <div class="detail-conent">
    <div class="base-content border-bottom-solid">
      <h3 class="title-left-boder">基地确认情况</h3>
      <ul class="content">
        <el-row v-for="(row, rowIndex) in detail.baseList" :key="rowIndex">
          <el-col :span="8" v-for="(col, colIndex) in row" :key="colIndex">
            <li class="h-30 font_cont" :title="`${col.baseName}${col.course}`">
              <i :class="iconList[col.ratify]" :style="{color: iconColor[col.ratify]}"></i>
              {{col.baseName}}({{col.course}})
            </li>
          </el-col>
        </el-row>
      </ul>
    </div>
    <div class="base-content border-bottom-solid">
      <h3 class="title-left-boder">研学团信息</h3>
      <div class="content">
        <el-row>
          <el-col :span="13">
            <div class="mg-bm">
              联系人员：
              <span class="grey-color">{{detail.relationPeople}}</span>
            </div>
            <div class="mg-bm">
              联系电话：
              <span class="grey-color">{{detail.relationPhone}}</span>
            </div>
            <div class="mg-bm">
              咨询电话：
              <span class="grey-color">{{detail.phone}}</span>
            </div>
            <div class="mg-bm">
              联系地址：
              <span class="grey-color h-30">{{detail.address}}</span>
            </div>
            <div class="mg-bm">
              接团老师：
              <span class="grey-color">{{detail.teacherList}}</span>
            </div>
            <div class="mg-bm">
              研学住宿：
              <span class="grey-color">{{detail.grogshop}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="14">
                海报：
                <canvas-img @sonImg="getImgFromSon" class="canvas-img" :data="data"/>
              </el-col>
              <el-col :span="5">
                <div class="w-downl">
                  <a href="msgFromSon" download>下载海报</a>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="base-content">
      <h3 class="title-left-boder">路线安排</h3>
      <div class="content">
        <line-plan :journeyVOList="detail.journeyVOList"/>
      </div>
    </div>
  </div>
</template>

<script>
import LinePlan from '../../components/LInePlan'
import CanvasImg from 'components/CanvasImg'
import styles from 'assets/styles/variable.scss'
export default {
  components: {
    LinePlan,
    CanvasImg
  },
  props: {
    detail: {
      type: Object,
      default: () => ({
        baseList: []
      })
    }
  },
  data () {
    return {
      msgFromSon: '',
      iconList: ['study-icon-daiqueren', 'study-icon-yiqueding', 'study-icon-cuowu'],
      iconColor: [styles.warningColor, styles.mainColor, styles.errorColor]
    }
  },
  computed: {
    data () { // 绘制canvas
      return {
        title1: this.detail.name,
        title2: this.detail.content,
        time: this.detail.time,
        price: this.detail.preferentialPrice,
        address: this.detail.address,
        image: this.detail.viewPath,
        qrimg: this.detail.url,
        phone: this.detail.phone,
        alliance: this.detail.baseOrTourName
      }
    }
  },
  methods: {
    // 子组件传来的图片路径值
    getImgFromSon (e) {
      this.msgFromSon = e
    }
  }
}
</script>

<style lang="scss">
.mg-bm {
  margin-bottom: 13px;
}
.detail-conent {
  padding: 0 20px;
  .canvas-img {
    display: inline-block;
    vertical-align: top;
    width: 180px;
    height: 200px;
    .w-downl a {
      text-decoration: none;
      height: 100%;
      width: 40px;
    }
  }
}
</style>
