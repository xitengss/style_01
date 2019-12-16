import Vue from 'vue'
import App from './App.vue'
import store from 'store'
import router from 'routers'
import permission from 'utils/permission'
import ElementUI from 'element-ui'
import 'assets/styles/index.scss'

Vue.use(ElementUI, {
  size: 'medium'
})

// 全局权限指令
Vue.use(permission)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
