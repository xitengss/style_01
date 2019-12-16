<template>
  <div class="userinfo-box">
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="name">
        <i class="study-icon-zhanghaodenglu"></i>
        &nbsp;{{user.company}}({{user.account}})
        <i class="el-icon-caret-bottom"></i>
      </span>
      <el-dropdown-menu slot="dropdown" class="drop-menu">
        <el-dropdown-item divided command="changePwd">修改密码</el-dropdown-item>
        <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog title="修改密码" :visible.sync="dialogPwd" :modal="false" width="520px">
      <div class="content">
        <el-form :model="pwdModel" :rules="pwdRules" label-width="100px" ref="pwdForm">
          <el-form-item label="原密码：" prop="oldPwd">
            <el-input v-model="pwdModel.oldPwd" placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码：" prop="newPwd">
            <el-input v-model="pwdModel.newPwd" placeholder="请输入至少6个字符 字母数字下划线组合"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="againPwd">
            <el-input v-model="pwdModel.againPwd" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogPwd = false">取消</el-button>
        <el-button @click="handleSave" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { passwordValidate } from 'utils/validate'
import { updatePwdUrl } from 'api'
import { post } from 'utils'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Userinfo',
  data () {
    const againPwdValidate = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请再次输入密码'))
      }
      if (value !== this.pwdModel.newPwd) {
        return callback(new Error('两次输入密码不一致!'))
      }
      callback()
    }
    return {
      dialogPwd: false,
      pwdModel: {
        oldPwd: '',
        newPwd: '',
        againPwd: ''
      },
      pwdRules: {
        oldPwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, validator: passwordValidate, trigger: 'blur' }
        ],
        againPwd: [
          { required: true, validator: againPwdValidate, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    handleCommand (command) { // 选中回调
      this[command]()
    },
    changePwd () {
      this.dialogPwd = true
    },
    logout () { // 退出登录
      this.$confirm('确认退出吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.deleteUser()
        this.deleteToken()
        this.$router.push('/login')
      }).catch(() => {

      })
    },
    handleSave () { // 修改密码
      this.$refs.pwdForm.validate(async valid => {
        if (valid) {
          const params = {
            oldpass: this.pwdModel.oldPwd,
            newpass: this.pwdModel.againPwd
          }
          const { resultMessage } = await post(updatePwdUrl, params)
          this.$message({
            message: resultMessage,
            type: 'success',
            duration: 1500
          })
        }
      })
    },
    ...mapActions([
      'deleteUser',
      'deleteToken'
    ])
  }
}
</script>

<style lang="scss">
.userinfo-box {
  .name {
    color: $color-text-white;
  }
}
</style>
