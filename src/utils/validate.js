/* eslint-disable */
import idCard from 'idcard'

// 字母，数字，字符组合验证正则
const passwordRegexp = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{6,20}$/
// 字母，数字或字母数字组合正则
const numOrAlphaRegexp = /^[0-9a-zA-Z]*$/
// 纯数字正则
const numberRegexp = /^[0-9]*[0-9][0-9]*$/
// 纯数字正则
const positiveIntegerRegexp = /^[1-9]\d*$/
// 金额验证 
export const prcieRegexp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
// 手机号码正则
const phoneRegexp = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
// 邮箱验证
const emailRegexp = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
// 中国电话号码（包括移动和固定电话
const allPhoneRegexp = /^(0\d{2,3}-\d{7,8})|(1[345789]\d{9})$/
// ip地址正则
const ipRegexp = /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/
// 经度正则
const lngRegexp = /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,10})?)|180(([.][0]{1,10})?))$/
// 纬度正则
const latRegexp = /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,10})?)|90(([.][0]{1,10})?))$/
// 校验dat文件正则
export const isDatFile = /.(dat|DAT)$/
// 图片正则
export const isImageRegexp = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/
export const isPhotoRegexp = /^image\/(jpeg|png)$/

// excel格式中xlsx和xls校验
export const excelValidate = type => {
  let xlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  let xls = 'application/vnd.ms-excel'
  if (type !== xlsx && type !== xls) {
    return false
  }
  return true
}

// 密码验证
export const passwordValidate = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('密码不能为空'))
  }
  if (value.length < 6 || value.length > 20) {
    return callback(new Error('密码长度需要6-20个字符'))
  }
  if (!passwordRegexp.test(value)) {
    return callback(new Error('密码须由数字、字母、字符密码组合'))
  }
  callback()
}

// 正整数
export const positiveIntegerValidate = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  if (!positiveIntegerRegexp.test(value)) {
    return callback(new Error('请输入正整数'))
  }
  callback()
}

// 手机号码验证
export const phoneValidate = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  if (!phoneRegexp.test(value)) {
    return callback(new Error('联系电话有误'))
  }
  callback()
}

// 身份证验证
export const idcardValidate = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  if (!idCard.verify(value)) {
    return callback(new Error('身份证号码有误'))
  }
  callback()
}

// 中国电话号码（包括移动和固定电话）号码验证
export const allPhoneValidate = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  if (!allPhoneRegexp.test(value)) {
    return callback(new Error('请输入手机号或"0592-xxxxxxx"格式号码'))
  }
  callback()
}

// 邮箱验证
export const emailValidate = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  if (!emailRegexp.test(value)) {
    return callback(new Error('邮箱有误'))
  }
  callback()
}

// 金额验证
export const prcieValidate = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  if (!prcieRegexp.test(value)) {
    return callback(new Error('请输入小数点后两位的非负数字金额'))
  }
  callback()
}