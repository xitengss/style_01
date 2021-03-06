<template>
  <div class="base-box menu-manager-box">
    <section class="left-box">
      <el-tree
        node-key="id"
        class="my-tree"
        highlight-current
        :data="treeData"
        :props="defaultProps"
        :expand-on-click-node="false"
        :default-expanded-keys="expandedKeysArr"
        @node-click="handleNodeClick"
      >
        <span class="flex-between my-custom-tree-node" slot-scope="{ node, data }">
          <span>
            <p class="txt-hidden" v-show="!data.show" style="max-width:100px">{{ data.name }}</p>
            <el-input
              v-show="data.show"
              size="small"
              v-model="data.name"
              placeholder="请输入内容"
              autofocus
              @blur="handleBlur(data)"
              :maxlength="10"
              clearable
            ></el-input>
          </span>
          <span class="my-tree-node" v-show="!data.show">
            <el-button
              v-if="data.hasChild"
              v-permission="'menuAdd'"
              type="text"
              size="mini"
              @click="append(data)"
            >
              <i class="study-icon-xinzeng" title="新增子目录"></i>
            </el-button>
            <el-dropdown trigger="click" v-if="data.id !== -1">
              <i class="study-icon-xuanxiang main-color"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-permission="'menuEdit'" @click.native="menuHandleEdit(data)">编辑</el-dropdown-item>
                <el-dropdown-item
                  v-permission="'menuDel'"
                  @click.native="menuHandleDelNode(data)"
                >删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      </el-tree>
    </section>
    <section class="right-box">
      <header class="header">
        <el-button
          v-permission="'funcAdd'"
          @click="funcHandleAdd"
          icon="el-icon-plus"
          type="primary"
        >新增功能</el-button>
        <div>
          <el-input style="width: 250px;" v-model.trim="searchContent" placeholder="请输入关键字搜索">
            <i
              style="margin: 13px 0 0 0"
              class="el-icon-search"
              slot="suffix"
              @click="handleIconSearchClick"
            ></i>
          </el-input>
        </div>
      </header>
      <el-table :data="tableData" v-loading="loading" class="my-table">
        <el-table-column show-overflow-tooltip width="50"></el-table-column>
        <el-table-column show-overflow-tooltip label="功能名称" prop="name"></el-table-column>
        <el-table-column show-overflow-tooltip label="功能标签" prop="tag"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-permission="'funcEdit'"
              type="text"
              size="small"
              @click="funchandleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="'funcCopy'"
              type="text"
              size="small"
              @click="funcHandleCopy(scope.$index, scope.row)"
            >复制</el-button>
            <el-popover width="200" trigger="click" v-model="scope.row.delViewVisible">
              <p>
                <i class="el-icon-question warning"></i>
                确定删除 {{scope.row.name}} 该功能吗？
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.delViewVisible = false">取消</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="funcHandleDel(scope.$index, scope.row)"
                >确定</el-button>
              </div>
              <el-button slot="reference" type="text" size="small" v-permission="'funcDel'">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 菜单弹窗部分 -->
    <el-dialog
      :title="menuDialogTitle"
      :visible.sync="menuDialogVisible"
      :before-close="menuHandleCancel"
      width="520px"
      :close-on-click-modal="false"
    >
      <div class="content">
        <el-form
          :model="selectedMenu"
          :rules="menuRules"
          ref="menuForm"
          size="small"
          label-width="125px"
        >
          <el-form-item label="菜单名称：" prop="name">
            <el-input v-model="selectedMenu.name" placeholder="请输入菜单名称" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="菜单标签：" prop="tag">
            <el-input v-model="selectedMenu.tag" placeholder="请输入标签" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="菜单URL：" prop="url">
            <el-input v-model.trim="selectedMenu.url" placeholder="请输入URL" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="菜单备注：" prop="comment">
            <el-input v-model="selectedMenu.comment" placeholder="请输入备注" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标：" prop="icon">
            <el-input v-model="selectedMenu.icon" placeholder="请输入图标" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="菜单次序：" prop="rank">
            <el-input v-model="selectedMenu.rank" placeholder="请输入次序"></el-input>
          </el-form-item>
          <el-form-item label="是否可见：">
            <el-radio :label="1" v-model.number="selectedMenu.showMenu">可见</el-radio>
            <el-radio :label="0" v-model.number="selectedMenu.showMenu">不可见</el-radio>
          </el-form-item>
          <el-form-item label="是否包含子菜单：">
            <el-radio :label="1" v-model.number="selectedMenu.hasChild">包含</el-radio>
            <el-radio :label="0" v-model.number="selectedMenu.hasChild">不包含</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="menuHandleCancel">取 消</el-button>
        <el-button type="primary" @click="menuHandleSave">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 功能弹窗部分 -->
    <el-dialog
      :title="funcDialogTitle"
      :visible.sync="funcDialogVisible"
      :before-close="funcHandleCancel"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="content">
        <el-form
          :model="selectedFunc"
          :rules="funcRules"
          size="small"
          ref="funcForm"
          label-width="82px"
        >
          <el-form-item label="功能名称" prop="name">
            <el-row>
              <el-col :span="19">
                <el-input v-model="selectedFunc.name" placeholder="请输入功能名称" :maxlength="50"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="功能标签" prop="tag">
            <el-row>
              <el-col :span="19">
                <el-input v-model="selectedFunc.tag" placeholder="请输入功能标签" :maxlength="50"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="接口列表" prop="interfaceIds">
            <select-options
              v-for="(item, index) in selectedFunc.baseInterfaceDOs"
              :key="index"
              :index="index"
              :options="interfaceList"
              keyName="parentInterfaceDO"
              :restore="item"
              :isShowAddBtn="selectedFunc.baseInterfaceDOs.length === 0 || index === selectedFunc.baseInterfaceDOs.length - 1"
              @addOption="addOption"
              @delOption="delOption"
              @change="handleOptionsChange"
            ></select-options>
          </el-form-item>
          <el-form-item label="目标路径" prop="menuId" v-if="funcDialogTitle === '复制功能'" class="top-10">
            <el-row>
              <el-col :span="19">
                <select-tree
                  v-model="selectedFunc.menuName"
                  :selectedChange="selMenuTreeChange"
                  placeholder="请选择目标路径"
                  :singleCheckId="selectedFunc.menuId"
                  :defaultProps="treeProps"
                  :data="treeData"
                ></select-tree>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="funcHandleCancel">取 消</el-button>
        <el-button type="primary" @click="funcHandleSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { menuListUrl, funcListUrl, funcGetInterfaceListUrl, menuDeleteUrl, menuCreateUrl, menuUpdateUrl, funcDeleteUrl, funcUpdateUrl, funcCreateUrl, funcCopyUrl } from 'api/system'
import { post } from 'utils'
import SelectTree from 'components/SelectTree'
import SelectOptions from 'components/SelectOptions'
export default {
  name: 'menuManager',
  components: {
    SelectTree,
    SelectOptions
  },
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'sonMenuVOs',
        label: 'name'
      },
      searchContent: '',
      selectTreeItem: {},
      tableData: [],
      itemData: {},
      loading: false,
      menuDialogTitle: '',
      menuDialogVisible: false,
      tempMenuObj: {},
      clickMenuNode: {},
      selectedMenu: {
        id: '',
        name: '',
        tag: '',
        url: '',
        hasChild: '',
        showMenu: '',
        icon: '',
        rank: '',
        comment: '',
        parent: '',
        subs: []
      },
      menuRules: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' },
          { max: 36, message: '菜单名称不能超过36个字', trigger: 'blur' }
        ],
        tag: [
          { max: 36, message: '菜单标签不能超过36个字', trigger: 'blur' }
        ],
        url: [
          { required: true, max: 50, message: '菜单URL不能超过50个字', trigger: 'blur' }
        ],
        comment: [
          { max: 50, message: '菜单URL不能超过50个字', trigger: 'blur' }
        ],
        icon: [
          { max: 50, message: '菜单图标不能超过50个字', trigger: 'blur' }
        ],
        rank: [
          // { required: true, validator: SerialValidate, trigger: 'blur' }
        ]
      },
      selectedFunc: {
        name: '',
        tag: '',
        interfaceIds: []
      },
      tempFuncObj: {},
      funcRules: {
        name: [
          { required: true, message: '功能名称不能为空', trigger: 'blur' },
          { max: 36, message: '功能名称不能超过36个字', trigger: 'blur' }
        ],
        tag: [
          { max: 36, message: '功能标签不能超过36个字', trigger: 'blur' }
        ]
      },
      funcDialogTitle: '',
      funcDialogVisible: false,
      treeProps: {
        label: 'name',
        children: 'sonMenuVOs'
      },
      isLoadFlag: false,
      interfaceList: [],
      expandedKeysArr: [-1]
    }
  },
  created () {
    this.loadData()
    this.loadInterfaceList()
  },
  methods: {
    async loadData () {
      this.loading = true
      const { data } = await post(menuListUrl)
      this.loading = false
      data.map(item => {
        item.show = false
      })
      let tempArr = []
      let tempOjb = {
        id: -1,
        name: '菜单树',
        hasChild: 1,
        sonMenuVOs: data,
        baseFuncVOs: []
      }
      tempArr.push(tempOjb)
      this.treeData = tempArr
    },
    async loadBaseFuncList () {
      if (this.checkClickMenuNode()) {
        return
      }
      let params = `menuId=${this.clickMenuNode.id}&keyWord=${this.searchContent}`
      this.loading = true
      const { data } = await post(funcListUrl, params)
      this.loading = false
      data.map(item => {
        if (item.baseMenuDO) {
          item.menuId = item.baseMenuDO.id
          item.menuName = item.baseMenuDO.name
        }
        if (!item.baseInterfaceDOs.length) {
          item.baseInterfaceDOs.push({
            id: '',
            name: '',
            parentInterfaceDO: {
              id: '',
              name: ''
            }
          })
        }
      })
      this.tableData = data
    },
    async loadInterfaceList () { // 请求接口列表
      const { data } = await post(funcGetInterfaceListUrl)
      this.isLoadFlag = true
      this.interfaceList = data
    },
    handleNodeClick (data) { // 选中接口树节点
      Object.assign(this.clickMenuNode, data)
      if (this.clickMenuNode.id === -1) {
        this.tableData = []
        return
      }
      this.loadBaseFuncList()
    },
    menuHandleEdit (data) { // 编辑接口
      this.tempMenuObj = JSON.parse(JSON.stringify(data))
      this.selectedMenu = data
      this.menuDialogTitle = '编辑菜单'
      this.menuDialogVisible = true
    },
    menuHandleRename (data) { // 重命名
      this.tempMenuObj = JSON.parse(JSON.stringify(data))
      this.selectedMenu = data
      data.show = true
    },
    handleBlur (data) { // 失去焦点自动保存
      if (!data.name) {
        this.$message({
          type: 'error',
          message: '名称不能为空',
          duration: 1500
        })
        return
      }
      data.show = false
      if (data.name === this.tempMenuObj.name) {
        return
      }
      this.menuHnadleUpdate()
    },
    menuHandleDelNode (data) { // 删除树节点
      this.$confirm('永久删除' + data.name + '?无法恢复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        await post(menuDeleteUrl, `id=${data.id}`)
        this.$message({
          type: 'success',
          message: '删除成功',
          duration: 1500
        })
        this.loadData()
      }).catch(() => { })
    },
    append (data) { // 增加子节点
      let item = { parentId: 0, name: '', url: '', tag: '', comment: '', icon: '', rank: null, hasChild: 0, showMenu: 1 }
      item.parentId = data.id === -1 ? 0 : data.id
      this.selectedMenu = item
      this.tempMenuObj = JSON.parse(JSON.stringify(item))
      this.menuDialogTitle = '新增菜单'
      this.menuDialogVisible = true
    },
    menuHandleCancel () { // 菜单->取消
      this.$refs.menuForm.resetFields()
      Object.assign(this.selectedMenu, this.tempMenuObj)
      this.menuDialogVisible = false
    },
    async menuHandleSave () { // 菜单->保存
      let isSave = false
      this.$refs.menuForm.validate(val => {
        isSave = val ? 1 : false
      })
      if (!isSave) {
        return
      }
      let url = menuCreateUrl
      let params = {
        parent: this.selectedMenu.parentId,
        name: this.selectedMenu.name,
        tag: this.selectedMenu.tag,
        url: this.selectedMenu.url,
        comment: this.selectedMenu.comment,
        icon: this.selectedMenu.icon,
        rank: this.selectedMenu.rank,
        hasChild: this.selectedMenu.hasChild,
        showMenu: this.selectedMenu.showMenu
      }
      if (this.selectedMenu.id) {
        url = menuUpdateUrl
        params.id = this.selectedMenu.id
      }
      const { data, resultMessage } = await post(url, params)
      this.$message({
        type: 'success',
        message: resultMessage,
        duration: 1500
      })
      if (!this.selectedMenu.id) {
        this.loadData()
      } else {
        Object.assign(this.selectedMenu, data)
      }
      this.menuDialogVisible = false
    },
    handleIconSearchClick () { // 搜索接口
      this.loadBaseFuncList()
    },
    funcHandleAdd () { // 功能->新增
      if (this.checkClickMenuNode()) {
        return
      }
      let item = {
        menuId: this.clickMenuNode.id,
        name: '',
        tag: '',
        baseInterfaceDOs: [{
          id: '',
          name: '',
          parentInterfaceDO: {
            id: '',
            name: ''
          }
        }]
      }
      this.selectedFunc = item
      this.tempFuncObj = JSON.parse(JSON.stringify(item))
      this.funcDialogTitle = '新增功能'
      this.funcDialogVisible = true
    },
    funchandleEdit (index, row) { // 功能->编辑
      this.tempFuncObj = JSON.parse(JSON.stringify(row))
      this.selectedFunc = row
      this.funcDialogTitle = '编辑功能'
      this.funcDialogVisible = true
    },
    funcHandleCopy (index, row) { // 功能->复制
      this.tempFuncObj = JSON.parse(JSON.stringify(row))
      this.selectedFunc = JSON.parse(JSON.stringify(row))
      this.selectedFunc.name += '--副本'
      this.selectedFunc.tag += '--副本'
      this.selectedFunc.id = null
      this.funcDialogTitle = '复制功能'
      this.funcDialogVisible = true
    },
    async funcHandleDel (index, row) { // 功能->删除
      await post(funcDeleteUrl, `id=${row.id}`)
      this.$message({
        type: 'success',
        message: '删除成功',
        duration: 1500
      })
      this.loadBaseFuncList()
    },
    funcHandleCancel () { // 功能->取消
      this.$refs.funcForm.resetFields()
      Object.assign(this.selectedFunc, this.tempFuncObj)
      this.funcDialogVisible = false
    },
    async funcHandleSave () { // 功能->保存
      let isSave = false
      this.$refs.funcForm.validate(val => {
        isSave = val ? 1 : false
      })
      if (!isSave) {
        return
      }
      if (!this.selectedFunc.id) {
        if (this.funcDialogTitle === '复制功能') {
          this.copyFunc()
        } else {
          this.addFunc()
        }
      } else {
        let interfaceIds = this.getInterfaceIds(this.selectedFunc.baseInterfaceDOs)
        let params = {
          id: this.selectedFunc.id,
          menuId: this.clickMenuNode.id,
          name: this.selectedFunc.name,
          tag: this.selectedFunc.tag,
          interfaceIds: interfaceIds
        }
        await post(funcUpdateUrl, params)
        this.funcDialogVisible = false
        this.$message({
          type: 'success',
          message: '修改成功!',
          duration: 1500
        })
        this.loadBaseFuncList()
      }
    },
    async addFunc () { // 新增功能
      let interfaceIds = this.getInterfaceIds(this.selectedFunc.baseInterfaceDOs)
      let params = {
        menuId: this.clickMenuNode.id,
        name: this.selectedFunc.name,
        tag: this.selectedFunc.tag,
        interfaceIds: interfaceIds
      }
      await post(funcCreateUrl, params)
      this.funcDialogVisible = false
      this.$message({
        type: 'success',
        message: '新增成功!',
        duration: 1500
      })
      this.loadBaseFuncList()
    },
    async copyFunc () { // 复制功能
      let interfaceIds = this.getInterfaceIds(this.selectedFunc.baseInterfaceDOs)
      let params = {
        menuId: this.selectedFunc.menuId,
        name: this.selectedFunc.name,
        tag: this.selectedFunc.tag,
        interfaceIds: interfaceIds
      }
      await post(funcCopyUrl, params)
      this.funcDialogVisible = false
      this.$message({
        type: 'success',
        message: '复制成功!',
        duration: 1500
      })
      this.loadBaseFuncList()
    },
    checkClickMenuNode () { // 检查已经选中左侧节点
      if (!this.clickMenuNode.id || this.clickMenuNode.id === -1) {
        this.$message({
          type: 'error',
          message: '请先选择左侧菜单树节点',
          duration: 1500
        })
        return true
      }
      return false
    },
    selMenuTreeChange (data) { // 复制时选中树节点
      this.selectedFunc.menuId = data.id
    },
    handleOptionsChange (data, index) { // 选项改变时回调
      this.selectedFunc.baseInterfaceDOs[index] = data
    },
    addOption () { // 增加接口选项
      let lastIndex = this.selectedFunc.baseInterfaceDOs.length - 1
      if (!this.selectedFunc.baseInterfaceDOs[lastIndex].id) {
        return
      }
      this.selectedFunc.baseInterfaceDOs.push({
        id: '',
        name: '',
        parentInterfaceDO: {
          id: '',
          name: ''
        }
      })
    },
    delOption (index) { // 删除接口选项
      if (this.selectedFunc.baseInterfaceDOs.length === 1) {
        this.selectedFunc.baseInterfaceDOs.splice(index, 1, {
          id: '',
          name: '',
          parentInterfaceDO: {
            id: '',
            name: ''
          }
        })
        return
      }
      this.selectedFunc.baseInterfaceDOs.splice(index, 1)
    },
    getInterfaceIds (list) { // 获取interfaceIds
      let ids = []
      list.map(item => {
        if (item.id) {
          ids.push(item.id)
        }
      })
      return ids
    }
  }
}
</script>

<style lang="scss">
.menu-manager-box {
  .left-box {
    min-height: 65vh;
    float: left;
    overflow: hidden;
    width: 200px;
    min-width: 200px;
    border-right: 1px solid $color-border;
    .my-custom-tree-node {
      flex: 1;
      align-items: center;
      padding-right: 16px;
      .my-tree-node {
        display: none;
      }
    }
    .el-tree-node__content:hover {
      .my-tree-node {
        display: inline-block;
      }
    }
  }
  .right-box {
    padding-left: 20px;
    float: left;
    width: calc(100% - 200px);
  }
  .top-10 {
    margin-top: -10px;
  }
}
</style>
