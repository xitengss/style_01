<template>
  <div class="app-wrapper">
    <navbar />
    <Aside></Aside>
    <app-main />
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import Aside from './components/Aside'
import AppMain from './components/AppMain'
export default {
  name: 'Layout',
  components: {
    Aside,
    Navbar,
    AppMain
  }
}
</script>

<style lang="scss">
.app-wrapper {
  @include clearfix;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
