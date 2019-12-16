<template>
  <section class="app-main" :style="{left: positionLeftWidth}">
    <breadcrumb />
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </section>
</template>

<script>
import Breadcrumb from 'components/Breadcrumb'
import { menuShrinkWidth, menuEunfoldWidth } from 'assets/styles/variable.scss'
import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  components: {
    Breadcrumb
  },
  computed: {
    positionLeftWidth () {
      return this.collapsed ? menuShrinkWidth : menuEunfoldWidth
    },
    ...mapGetters([
      'collapsed'
    ])
  }
}
</script>

<style lang="scss">
.app-main {
  /*60 = navbar  */
  position: absolute;
  top: 60px;
  left: 210px;
  right: 0;
  bottom: 0;
  height: calc(100vh - 60px);
  background: $color-highlight-background;
  transition: left 0.8s ease-in-out;
}
</style>
