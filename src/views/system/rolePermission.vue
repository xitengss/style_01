<template>
  <div class="role-permission" v-loading="loading">
    <header class="header">
      <el-button type="text" icon="el-icon-arrow-left" class="perm-back-btn" @click="back">返回角色管理</el-button>
      <h1>{{roleName}}-权限配置</h1>
    </header>
    <section class="base-box">
      <el-table :data="treeTableData" v-loading="loading" :row-style="showTr" class="my-table">
        <el-table-column show-overflow-tooltip width="55"></el-table-column>
        <el-table-column show-overflow-tooltip label="菜单导航" width="200">
          <template slot-scope="scope">
            <i v-for="(space, levelIndex) in scope.row._level" :key="levelIndex">&nbsp;&nbsp;</i>
            <span v-if="toggleIconShow(scope.row)" @click="toggle(scope.$index)">
              <i v-show="!scope.row._expanded" class="el-icon-caret-right"></i>
              <i v-show="scope.row._expanded" class="el-icon-caret-bottom"></i>
            </span>
            <i v-else>&nbsp;&nbsp;&nbsp;&nbsp;</i>
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="页面权限" width="300">
          <template slot-scope="scope">
            <el-checkbox-group
              v-model="menus"
              @change="authBaseSave"
              :disabled="!hasPermission('rolePermissionSave')"
            >
              <el-checkbox :label="scope.row.id" :key="scope.row.id">{{scope.row.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="功能权限">
          <template slot-scope="scope">
            <el-checkbox-group
              v-model="funcs"
              @change="authBaseSave"
              :disabled="!hasPermission('rolePermissionSave')"
            >
              <el-checkbox
                v-for="(item, index) in scope.row.baseFuncDOs"
                :label="item.id"
                :key="index"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script>
import { menuListUrl, authGetUrl, authSaveUrl } from 'api/system'
import Utils from 'utils/tree_utils'
import { post } from 'utils'
import { mapGetters } from 'vuex'
export default {
  name: 'rolePermission',
  data () {
    return {
      roleId: '',
      roleName: '',
      tableData: [],
      loading: false,
      funcs: [1013],
      menus: [1014]
    }
  },
  computed: {
    treeTableData () {
      let data = Utils.MSDataTransfer.treeToArray(this.tableData, null, null, false, 'sonMenuVOs')
      return data
    },
    ...mapGetters([
      'funcList'
    ])
  },
  created () {
    this.loadRole()
    this.loadAuthGetBaseMenus()
  },
  methods: {
    back () { // 返回操作
      this.$router.go(-1)
    },
    loadRole () { // 加载role
      this.roleId = this.$route.query.id
      this.roleName = this.$route.query.name
      if (!this.roleId) {
        this.$message({
          duration: 1500,
          message: '该角色数据异常',
          type: 'error'
        })
        this.back()
        return
      }
      this.loadData()
    },
    async loadData () {
      this.loading = true
      const { data } = await post(menuListUrl)
      this.loading = false
      this.tableData = data
    },
    async loadAuthGetBaseMenus () {
      let params = 'roleId=' + this.roleId
      const { data } = await post(authGetUrl, params)
      let list = data
      let funcs = []
      let menus = []
      list.map(item => {
        funcs = funcs.concat(item.funcIds)
        menus.push(item.menuId)
      })
      this.funcs = funcs
      this.menus = menus
    },
    async authBaseSave () {
      let params = {
        roleId: this.roleId,
        funcs: this.funcs,
        menus: this.menus
      }
      await post(authSaveUrl, params)
      this.$message({
        type: 'success',
        message: '保存成功',
        duration: 1500
      })
    },
    // 显示行
    showTr ({ row, rowIndex }) {
      let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
      row._show = show
      return show ? '' : 'display:none;'
    },
    // 展开下级
    toggle (trIndex) {
      let record = this.treeTableData[trIndex]
      record._expanded = !record._expanded
    },
    // 显示层级关系的空格和图标
    spaceIconShow (index) {
      if (index === 0) {
        return true
      }
      return false
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow (record) {
      if (record.sonMenuVOs && record.sonMenuVOs.length > 0) {
        return true
      }
      return false
    },
    hasPermission (val) { // 是否有权限
      return this.funcList.some(func => {
        return func.tag === val
      })
    }
  }
}
</script>

<style lang="scss">
.role-permission {
  .header {
    padding: 10px 20px;
    background: $color-background;
    border-top: 1px solid $color-border;
    .perm-back-btn {
      color: $color-text;
    }
  }
  .el-table__expanded-cell[class*="cell"] {
    padding: 12px 0;
  }
}
</style>
