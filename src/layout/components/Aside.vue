<template>
  <div class="aside-container">
    <el-menu
      unique-opened
      default-active="0"
      :collapse="collapsed"
      :active-text-color="mainColor"
      class="menu-box"
      :style="{width: menusWidth}"
    >
      <template v-for="(item,index) in menus">
        <el-submenu v-if="item.showMenu && item.hasChild" :index="index+''" :key="index">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">&nbsp;{{item.name}}</span>
          </template>
          <template v-for="term in item.sonMenuVOs">
            <el-menu-item
              v-if="term.showMenu"
              :key="term.id"
              :index="term.url"
              :active-text-color="$route.path===term.url?'menu-active':'menu-no-active'"
              @click.native="menuClick(term)"
            >
              <i :class="term.icon"></i>
              <span slot="title">{{term.name}}</span>
            </el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item
          v-else-if="item.showMenu"
          :index="item.url"
          :active-text-color="$route.path===item.url?'menu-active':'menu-no-active'"
          :key="index"
          @click.native="menuClick(item)"
        >
          <i :class="item.icon"></i>
          <span slot="title">&nbsp;{{item.name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mainColor, menuShrinkWidth, menuEunfoldWidth } from 'assets/styles/variable.scss'
import { post } from 'utils'
import { baseMenusUrl } from 'api'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Aside',
  data () {
    return {
      menus: []
    }
  },
  computed: {
    mainColor () {
      return mainColor
    },
    menusWidth () {
      return this.collapsed ? menuShrinkWidth : menuEunfoldWidth
    },
    ...mapGetters(['collapsed'])
  },
  created () {
    this.loadMenus()
  },
  methods: {
    async loadMenus () {
      const { data } = await post(baseMenusUrl)
      this.menus = data
    },
    menuClick (item) {
      this.saveCurrentMenuId(item.id)
      this.$router.push({ path: item.url })
    },
    ...mapActions(['saveCurrentMenuId'])
  }
}
</script>

<style lang="scss">
.aside-container {
  position: fixed;
  top: 60px;
  bottom: 0;
  left: 0;
  z-index: 9;
  overflow: hidden;
  background: $color-background;
  box-shadow: 2px 0 6px rgba(21, 54, 85, 0.35);
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .menu-box {
    width: 210px;
    transition: width 0.3s ease-in-out;
    .el-menu-item,
    .el-submenu__title {
      i {
        color: $color-text-d;
      }
      height: 40px !important;
      line-height: 40px !important;
    }
    .menu-active {
      color: $main-color !important;
      background-color: $color-highlight-background !important;
      border-right: 4px solid $main-color;
      i {
        color: $main-color !important;
      }
    }
    .menu-no-active {
      color: $color-text !important;
      background: $color-background !important;
    }
    .el-menu-item:hover,
    .el-submenu .el-menu-item:hover,
    .el-submenu__title:hover {
      background-color: $color-background !important;
      i,
      span {
        color: $main-color !important;
      }
    }
  }
}
</style>
