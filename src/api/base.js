import {
  PRE_API
} from './config'

/** 课程管理 */
// 列表查询（分页）
export const courseListUrl = `${PRE_API}admin/course/listPage.jhtml`
// 新增
export const courseSaveUrl = `${PRE_API}admin/course/save.jhtml`
// 修改
export const courseUpdateUrl = `${PRE_API}admin/course/update.jhtml`
// 删除
export const courseDeleteUrl = `${PRE_API}admin/course/delete.jhtml`
// 获取详情
export const courseDetailUrl = `${PRE_API}admin/course/getDetail.jhtml`
// 获取畅享课程详情
export const courseUnlimitedDetailUrl = `${PRE_API}unlimited/course/getDetail.jhtml`
// 获取下拉选择课程列表
export const getCourseTreeUrl = `${PRE_API}admin/course/getListTree.jhtml`
// 测试用课程列表
export const getCreateCourseListUrl = `${PRE_API}admin/course/getCourseList.jhtml`

/** 确认上课 */
// 确认上课列表
export const getAffirmCourseListUrl = `${PRE_API}admin/course/getAffirmCourseList.jhtml`
// 确认课程
export const affirmCourseUrl = `${PRE_API}admin/course/affirmCourse.jhtml`

/** 基地申报 */
// 基地申报-列表（分页）
export const declareListUrl = `${PRE_API}admin/course/declare/listPage.jhtml`
// 基地申请-编辑
export const declareUpdateUrl = `${PRE_API}admin/course/declare/update.jhtml`
