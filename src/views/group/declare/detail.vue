<template>
  <div class="base-box group-declare-detail-box">
    <div class="header">
      <h2>
        <i class="study-icon-shu bg-icon"></i>
        {{detail.studyName}}
      </h2>
      <el-button
        v-if="detail.status === 0 || detail.status === 3"
        v-permission="'groupDeclareUpdate'"
        type="primary"
        @click="handleEdit"
      >编辑</el-button>
    </div>
    <div class="base-content">
      <el-row>
        <el-col :span="4" :xs="8" :sm="8" :md="4" :lg="4">
          <div class="img">
            <div
              class="status"
              :style="{background: statusColor[detail.status]}"
            >{{statusList[detail.status]}}</div>
            <el-image :src="detail.cover" fit="fill"></el-image>
          </div>
        </el-col>
        <el-col :span="20" :xs="16" :sm="16" :md="20" :lg="20">
          <el-row>
            <el-col :span="10" :xs="12" :sm="12" :md="10" :lg="10">
              <div class="h-30">
                i研学：
                <span class="grey-color">{{detail.baseAndTourName}}</span>
              </div>
              <div class="h-30">
                申报方：
                <span class="grey-color">{{detail.title}}</span>
              </div>
              <div class="h-30">
                联系人：
                <span class="grey-color">{{detail.name}}</span>
              </div>
            </el-col>
            <el-col :span="10" :xs="12" :sm="12" :md="10" :lg="10">
              <div class="h-30">
                申报金额：
                <span class="danger">￥{{detail.sum}}</span>
              </div>
              <div class="h-30">
                团员人数：
                <span class="grey-color">{{detail.countApply}}人</span>
              </div>
              <div class="h-30">
                联系电话：
                <span class="grey-color">{{detail.phone}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="detail.status === 3">
            <el-col>
              <el-alert :closable="false" :title="`驳回理由: ${detail.objection}`" type="error"></el-alert>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="base-content border-bottom-dashed">
      <h3 class="title-left-boder">往返交通票据或证明</h3>
      <div
        class="content grey-color"
      >往返交通票据或证明（大巴车除外），如航空公司的电子客票，船务公司出具的船票证明等，如无法提供车船票据证明，可提供双方协议和账目往来证明作为依据</div>
      <div class="img-list">
        <el-image
          v-for="item in detail.trafficList"
          :key="item.attachmentId"
          :src="item.viewPath"
          fit="fill"
        ></el-image>
      </div>
    </div>
    <div class="base-content border-bottom-dashed">
      <h3 class="title-left-boder">保险单复印件</h3>
      <div class="content grey-color">i研学或机构为团员购买的保险单据复印件</div>
      <div class="img-list">
        <el-image
          v-for="item in detail.insuranceList"
          :key="item.attachmentId"
          :src="item.viewPath"
          fit="fill"
        ></el-image>
      </div>
    </div>
    <div class="base-content border-bottom-dashed">
      <h3 class="title-left-boder">发票</h3>
      <div class="content grey-color">受委托旅行社向集美区文体广电出版旅游局开具申请奖励的有效发票</div>
      <div class="img-list">
        <el-image
          v-for="item in detail.invoiceList"
          :key="item.attachmentId"
          :src="item.viewPath"
          fit="fill"
        ></el-image>
      </div>
    </div>
    <div class="base-content">
      <h3 class="title-left-boder">收据</h3>
      <div class="content grey-color">接待对台研学旅行的集美辖区院校、基地和景区提交申请报告、与申请奖励金额相应的收据</div>
      <div class="img-list">
        <el-image
          v-for="item in detail.receiptList"
          :key="item.attachmentId"
          :src="item.viewPath"
          fit="fill"
        ></el-image>
      </div>
    </div>
  </div>
</template>

<script>
import { declareDetailUrl } from 'api/group'
import { post } from 'utils'
import styles from 'assets/styles/variable.scss'
export default {
  name: 'groupDeclareDetail',
  data () {
    return {
      detail: {
        trafficList: [],
        insuranceList: [],
        invoiceList: [],
        receiptList: []
      },
      statusColor: [styles.warningColor, styles.errorColor, styles.successColor, styles.greyColor],
      statusList: ['草稿箱', '申报审核中', '申报通过', '申报未通过']
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
      const { data } = await post(declareDetailUrl, `id=${id}`)
      this.detail = data
    },
    handleEdit (index, row) { // 修改
      this.$router.push({ name: 'groupDeclareCreate', query: { id: this.detail.studyTourDeclareId } })
    }
  }
}
</script>
