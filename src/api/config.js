export const PROJECT_NANE = '/studyforward/api/'
export const PRE_API = 'api/'
export const BASE_URL = process.env.VUE_APP_BASE_API + PROJECT_NANE // 基础请求
export const BASE_TEMPLATE_URL = `${process.env.VUE_APP_BASE_API}/studyforward/template/`
export const ERR_OK = 200 // 请求成功
export const ERR_USER_TOKEN = 300 // token失效

export const TX_MAP_KEY = 'YBMBZ-HSHL6-VLDSB-EAAD6-CK7LO-VMFOQ' // 腾讯地图key

// 不缓存页面
export const excludeAliveArr = []

// 数据字典
export const REGION = 'region' // 地区
export const ID_TYPE = 'ID_Type' // 证件类型
export const PROFESSION = 'profession' // 职业

/**
 * 统一管理接口
 */
export const baseUrl = `${BASE_URL}common/study.jhtml`
