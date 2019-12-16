import {
  PRE_API
} from './config'

/** 平台微主页管理 */
// 获取研学基地列表
export const getStudyBaseListUrl = `${PRE_API}admin/platformmicrohomepage/getStudyBaseList.jhtml`
// 发布微主页主页
export const micHomepagePublishUrl = `${PRE_API}admin/platformmicrohomepage/micHomepagePublish.jhtml`
// 获取微主页
export const getMicHomepageUrl = `${PRE_API}weixin/michomepage/getMicHomepage.jhtml`
// 微主页删除
export const micHomepageDelUrl = `${PRE_API}admin/platformmicrohomepage/delete.jhtml`
// 获取研学基地下的研学团列表
export const getStudyBaseTourListUrl = `${PRE_API}admin/platformmicrohomepage/getStudyBaseTourList.jhtml`
// 获取研学基地下的课程列表
export const getStudyBaseCourseListUrl = `${PRE_API}admin/platformmicrohomepage/getStudyBaseCourseList.jhtml`

/** 研学单元管理 */
// 列表查询（分页）
export const studybaseListUrl = `${PRE_API}admin/studybase/listPage.jhtml`
// 新增
export const studySaveUrl = `${PRE_API}admin/studybase/save.jhtml`
// 修改
export const studybaseUpdateUrl = `${PRE_API}admin/studybase/update.jhtml`
// 删除
export const studybaseDeleteUrl = `${PRE_API}admin/studybase/delete.jhtml`
// 获取畅享详情 没有接口
export const studybaseDetailUrl = `${PRE_API}admin/studybase/getStudyBase.jhtml`
// 关键字搜索腾讯地址
export const mapSeacrchUrl = `${PRE_API}common/common/getMapList.jhtml`
// 测试用研学基地名称列表
export const getBaseListUrl = `${PRE_API}admin/studybase/getBaseList.jhtml`

/** i研学 */
// 列表查询（分页）
export const studygroupListUrl = `${PRE_API}admin/tourgroup/listPage.jhtml`
// 修改
export const studygroupUpdateUrl = `${PRE_API}admin/tourgroup/update.jhtml`
// 删除
export const studygroupDeleteUrl = `${PRE_API}admin/tourgroup/delete.jhtml`
// 获取详情
export const studygroupDetailUrl = `${PRE_API}admin/tourgroup/getStudyBase.jhtml`

/** 帐号管理 */
// 账号列表
export const userListUrl = `${PRE_API}admin/studybase/user/listPage.jhtml`
// 账号新增
export const userSaveUrl = `${PRE_API}admin/studybase/user/save.jhtml`
// 账号编辑
export const userUpdateUrl = `${PRE_API}admin/studybase/user/update.jhtml`
// 账号删除
export const userDeleteUrl = `${PRE_API}admin/studybase/user/delete.jhtml`
// 重置密码
export const userResetPwdUrl = `${PRE_API}admin/studybase/user/resetPassword.jhtml`

/** 评论管理 */
// 评论列表
export const commentListUrl = `${PRE_API}admin/student/listPage.jhtml`
// 获取评论详情
export const commentDetailUrl = `${PRE_API}admin/student/getDetailAndComment.jhtml`
