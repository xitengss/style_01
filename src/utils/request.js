import axios from 'axios'
import {
  ERR_OK,
  ERR_USER_TOKEN
} from 'api/config'
import {
  Message
} from 'element-ui'
import store from 'store'
import router from 'routers'

const request = axios.create()
// 封装axios请求
request.defaults.timeout = 20000 // 响应时间
request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' // 配置请求头
request.defaults.validateStatus = status => {
  return status >= 200
}

// 发送请求之前调用拦截器
request.interceptors.request.use(config => {
  // 请求header加token
  if (!config.url.endsWith('login')) {
    if (store.getters.token) {
      config.headers.token = store.getters.token
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 请求成功经过拦截器
request.interceptors.response.use(response => {
  if (response.data.resultCode !== ERR_OK) {
    if (response.data.resultMessage && response.data.resultCode !== ERR_USER_TOKEN) {
      Message({
        type: 'error',
        message: response.data.resultMessage,
        duration: 1500
      })
    }
    if (response.data.resultCode === ERR_USER_TOKEN) {
      let query = {}
      router.push({
        path: '/login',
        query
      })
    }
  }
  return response
}, error => {
  return Promise.reject(error)
})

export default request
