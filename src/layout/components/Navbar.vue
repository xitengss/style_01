<template>
  <header class="navbar-container flex-between">
    <div>
      <img src="~assets/img/logo.png" class="logo" />
      <transition name="el-fade-in-linear">
        <img v-show="!collapsed" src="~assets/img/logo_text_i.png" class="logo-text" />
      </transition>
      <span class="menu-icon pointer" @click="collapse">
        <i class="study-icon-caidan"></i>
      </span>
    </div>
    <userinfo />
  </header>
</template>

<script>
import Userinfo from './Userinfo'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Navbar',
  components: {
    Userinfo
  },
  computed: {
    ...mapGetters([
      'collapsed'
    ])
  },
  mounted () {
    this.listenClientWidth()
  },
  methods: {
    listenClientWidth () {
      // 监听窗口改变，当宽度小于1024是隐藏侧边栏
      window.addEventListener('resize', () => {
        let width = document.body.clientWidth
        let collapsed = width <= 1024 ? Boolean(1) : false
        this.saveCollapsed(collapsed)
      })
    },
    collapse () { // 伸缩导航栏
      this.saveCollapsed(!this.collapsed)
    },
    ...mapActions([
      'saveCollapsed'
    ])
  }
}
</script>

<style lang="scss">
.navbar-container {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: 100%;
  height: 60px;
  padding: 0 15px;
  background: #318deb;
  .logo {
    width: 34px;
    margin: 0 16px 0 6px;
  }
  .logo-text {
    width: 104px;
    margin-left: 10px;
  }
  .menu-icon {
    height: 60px;
    line-height: 60px;
    vertical-align: middle;
    margin-left: 30px;
    color: $color-text-white;
    font-size: $font-size-large-x;
    i {
      font-size: $font-size-large-x;
    }
  }
}
</style>
