<template>
  <div class="login-index">
    <div class="login-box">
      <div class="bg"></div>
      <div class="left">
        <div class="title-box">
          <img class="img-logo" src="../../assets/img/login_logo.png" alt>
          <span class="title">i研学公共服务平台</span>
        </div>
        <div class="img-box">
          <img src="../../assets/img/login_conImg.png">
        </div>
      </div>
      <div class="right">
        <el-popover placement="right" width="200" trigger="hover">
          <div>
            <img class="qrcode-popover" src="~assets/img/QR_code.jpg">
            &nbsp;微信扫描添加微信公众平台
          </div>
          <img class="qrcode" src="../../assets/img/login_QRcode.png" slot="reference">
        </el-popover>
        <el-form
          ref="loginForm"
          :model="account"
          :rules="rules"
          label-position="left"
          label-width="0px"
          class="demo-ruleForm login-container"
        >
          <h3 class="title">登录LOGIN</h3>
          <el-form-item prop="name">
            <el-input
              class="login-name"
              type="text"
              v-model="account.name"
              prefix-icon="study-icon-zhanghaodenglu"
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              class="login-password"
              type="password"
              v-model="account.password"
              prefix-icon="study-icon-mima"
              placeholder="请输入密码"
              @keyup.enter.native="handleLogin"
            ></el-input>
          </el-form-item>
          <el-form-item class="check-box">
            <el-checkbox v-model="checked" checked>下次自动登录</el-checkbox>
            <el-button type="text" class="fr" @click="handleClick">i厦门法人账号登录</el-button>
          </el-form-item>
          <el-form-item class="login-btn">
            <el-button style="width: 100%" type="primary" @click="handleLogin">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { post, get } from 'utils'
import { loginUrl, baseMenusUrl, getLoginUrlUrl, ixmLoginUrl, getCompanyNameUrl } from 'api'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      account: {
        name: '',
        password: ''
      },
      checked: true,
      rules: {
        name: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created () {
    this.isImxLogin()
  },
  methods: {
    handleLogin () { // 登录
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          const { data } = await post(loginUrl, this.account)
          this.getUserInfo(data)
        }
      })
    },
    async isImxLogin () { // 是否从i厦门法人登录
      const { JMYXFWPTTOKEN } = this.$route.query
      if (!JMYXFWPTTOKEN) {
        return
      }
      const { data } = await post(ixmLoginUrl, `accessToken=${JMYXFWPTTOKEN}`)
      this.getUserInfo(data)
    },
    async handleClick () { // 跳转i厦门登录
      const { data } = await get(getLoginUrlUrl)
      window.location.href = data
    },
    getUserInfo (data) { // 登录后操作
      this.$message({
        duration: 1500,
        message: '登录成功！',
        type: 'success'
      })
      this.saveUser(data)
      this.saveToken(data.token)
      this.loadMenus()
      this.loadCompanyName()
    },
    async loadMenus () { // 获取登录权限
      const { data } = await post(baseMenusUrl)
      if (!data || !data.length) {
        this.$message({
          type: 'error',
          message: '该用户没有权限登录'
        })
        return
      }
      const jumpToUrl = !data[0].url ? data[0].sonMenuVOs[0].url : data[0].url
      const menuId = !data[0].url ? data[0].sonMenuVOs[0].id : data[0].id
      this.saveCurrentMenuId(menuId)
      this.$router.replace({ path: jumpToUrl })
    },
    async loadCompanyName () { // 获取当前用户公司名称
      const { data } = await post(getCompanyNameUrl)
      let user = this.user
      user.company = data
      this.saveUser(user)
    },
    ...mapActions([
      'saveUser',
      'saveToken',
      'saveCurrentMenuId'
    ])
  }
}
</script>

<style lang="scss">
.login-index {
  background: url("../../assets/img/login.jpg") center center no-repeat fixed;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  @media screen and (max-width: 1400px) {
    .login-box {
      width: 900px !important;
      padding: 50px 60px !important;
      height: 500px !important;
    }
    .left {
      .img-logo {
        width: 50px !important;
        margin-top: -10px !important;
        margin-right: 10px !important;
      }
      .title {
        display: inline-block;
        font-size: 25px !important;
        color: #318deb;
        font-weight: bold;
        margin-bottom: 50px;
      }
      .img-box {
        width: 400px !important;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .bg {
      width: 200px !important;
      height: 200px !important;
    }
  }
  .bg {
    position: absolute;
    top: 0;
    right: 0;
    width: 340px;
    height: 340px;
    background: url("../../assets/img/login_conTop_bg.png") transparent center
      center no-repeat;
    background-size: 100%;
    z-index: -1;
  }
  .login-box {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    bottom: 0;
    width: 1150px;
    padding: 50px 60px 50px 80px;
    height: 600px;
    display: flex;
    overflow: hidden;
    z-index: 1;
    background: #fff;
    border-radius: 80px;
    box-shadow: -6px 1px 15px #5387fa, 1px 0px 15px #5387fa;
    margin: -300px auto;
  }
  .left,
  .right {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .left {
    .img-logo {
      width: 60px;
      margin-top: -20px;
      margin-right: 20px;
    }
    .title {
      display: inline-block;
      font-size: 32px;
      color: #318deb;
      font-weight: bold;
      margin-bottom: 50px;
    }
    .img-box {
      width: 480px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .right {
    position: relative;
    padding: 100px 0 0 110px;
    .qrcode {
      position: absolute;
      top: -20px;
      right: 0;
      width: 100px;
    }

    .title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 50px;
    }
  }
  .login-name input,
  .login-password input {
    border-top: none;
    border-right: none;
    border-left: none;
    border-radius: 0;
    background: transparent;
  }
  .check-box {
    margin-bottom: 12px;
  }
}
.qrcode-popover {
  width: 180px;
}
</style>
