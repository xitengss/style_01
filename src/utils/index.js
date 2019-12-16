import axios from 'utils/request'
import {
  ERR_OK,
  baseUrl
} from 'api/config'

/**
 * 请求函数封装
 * @export
 * @param {*} url 请求地址
 * @param {*} params 请求体
 * @returns
 */
// const request = (methods, url, params) => new Promise((resolve, reject) => {
//   axios[methods](url, params).then(res => {
//     // 对地图接口特殊特殊处理
//     if (res.data.status === 0) {
//       resolve(res.data)
//     }
//     if (res.data.resultCode !== ERR_OK) {
//       reject(res.data)
//     }
//     resolve(res.data)
//   }).catch(e => {
//     console.log(e)
//   })
// })

const request = (methods, url, params) => new Promise((resolve, reject) => {
  // console.log(methods, url, params)
  let status = 1
  if (params && params.file) {
    status = 2
  }
  params = params || ''
  if (params.toString().indexOf('=') > -1) {
    status = 0
    let obj = {}
    let list = params.split('&')
    list.map(item => {
      let tempList = item.split('=')
      obj[tempList[0]] = tempList[1] || ''
    })
    params = obj
  }
  status = params ? status : 0
  let reParams = params ? `url=${url}&status=${status}&params=${JSON.stringify(params)}` : `url=${url}&status=${status}&params=`
  if (status === 2) {
    let form = new FormData()
    form.append('url', url)
    form.append('status', status)
    let obj = {}
    const keys = Object.keys(params)
    for (let key of keys) {
      if (key === 'file') {
        form.append(key, params[key])
      } else {
        obj[key] = params[key]
      }
    }
    if (keys.length > 1) {
      form.append('params', JSON.stringify(obj))
    }
    reParams = form
  }
  axios['post'](baseUrl, reParams).then(res => {
    // 对地图接口特殊特殊处理
    if (res.data.status === 0) {
      resolve(res.data)
    }
    if (res.data.resultCode !== ERR_OK) {
      reject(res.data)
    }
    resolve(res.data)
  }).catch(e => {
    console.log(e)
  })
})

/**
 * get请求
 * @param {*} url 请求地址
 * @param {*} params 请求体
 */
export const get = (url, params) => request('get', url, params)

/**
 * post请求
 * @param {*} url 请求地址
 * @param {*} params 请求体
 */
export const post = (url, params) => request('post', url, params)

/**
 * 获取地址中的query参数
 * @param {*} url 地址
 * @param {*} key 参数key
 */
export const getQuery = (url, key) => {
  /* eslint-disable */
  let svalue = url.match(new RegExp('[\?\&]' + key + '=([^\&]*)(\&?)', 'i'))
  return svalue ? svalue[1] : svalue
}

/**
 * 时间戳转时间显示
 *
 * @export
 * @param {*} date 时间new Date()格式
 *  * @param {*} fmt 转换时间格式 yyyy-MM-dd hh:mm:ss
 * @returns
 */
export function formatDate(date, fmt) { // 时间转化
  if (!date) return ''
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    let str = o[k] + ''
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

/**
 * 格式化金额
 * @param {*} money 金额
 */
export const formatMoney = (money) => {
  let reg = /(?=(?!(\b))(\d{3})+$)/g
  return money.replace(reg, ',')
}

/**
 * 快捷生成日期
 */
const [TODAY, YESTERDAY, WEEK, MONTH, THREEMONTH, HALFYEAR, YEAR] = ['today', 'yesterday', 'week', 'month', 'threeMonth', 'halfYear', 'year']
export function transformDate(val) {
  let resultDate = ''
  switch (val) {
    case TODAY:
      resultDate = formatDate(new Date(), 'yyyy-MM-dd')
      break
    case YESTERDAY:
      resultDate = formatDate(new Date((new Date().getTime() - 3600 * 1000 * 24 * 1)), 'yyyy-MM-dd')
      break
    case WEEK:
      resultDate = formatDate(new Date((new Date().getTime() - 3600 * 1000 * 24 * 7)), 'yyyy-MM-dd')
      break
    case MONTH:
      resultDate = formatDate(new Date((new Date().getTime() - 3600 * 1000 * 24 * 30)), 'yyyy-MM-dd')
      break
    case THREEMONTH:
      resultDate = formatDate(new Date((new Date().getTime() - 3600 * 1000 * 24 * 90)), 'yyyy-MM-dd')
      break
    case HALFYEAR:
      resultDate = formatDate(new Date((new Date().getTime() - 3600 * 1000 * 24 * 180)), 'yyyy-MM-dd')
      break
    case YEAR:
      resultDate = formatDate(new Date((new Date().getTime() - 3600 * 1000 * 24 * 365)), 'yyyy-MM-dd')
      break
    default:
      resultDate = formatDate(new Date(), 'yyyy-MM-dd')
  }
  return resultDate
}