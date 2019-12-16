import {
  PRE_API
} from './config'

// 登录
export const loginUrl = `${PRE_API}user/login.jhtml`
// 获取i厦门PC端法人登录页面地址
export const getLoginUrlUrl = `${PRE_API}common/common/ixm/getLoginUrl.jhtml`
// i厦门法人登录
export const ixmLoginUrl = `${PRE_API}common/common/ixm/login.jhtml`
// 修改密码
export const updatePwdUrl = `${PRE_API}user/updatePass.jhtml`
// 获取用户菜单
export const baseMenusUrl = `${PRE_API}auth/getBaseMenus.jhtml`
// 根据菜单获取用户权限
export const basefuncsUrl = `${PRE_API}auth/getBaseFuncs.jhtml`
// 文件上传
export const uploadUrl = `${PRE_API}common/attachment/upload.jhtml`
// 获取数据字段
export const dictionaryUrl = `${PRE_API}dictionary/children/listByCategory.jhtml`
// 获取当前用户公司名称
export const getCompanyNameUrl = `${PRE_API}admin/studybase/user/getCompanyName.jhtml`
