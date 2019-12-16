import {
  PRE_API,
  BASE_TEMPLATE_URL
} from './config'

/** 研学团管理 */
// 列表查询（分页）
export const tourListUrl = `${PRE_API}admin/studytour/listPage.jhtml`
// 新增
export const tourSaveUrl = `${PRE_API}admin/studytour/save.jhtml`
// 修改
export const tourUpdateUrl = `${PRE_API}admin/studytour/update.jhtml`
// 删除
export const tourDeleteUrl = `${PRE_API}admin/studytour/delete.jhtml`
// 获取详情
export const tourDetailUrl = `${PRE_API}admin/studytour/get.jhtml`
// 获取畅享详情  没有接口
export const unlimitedDetailUrl = `${PRE_API}unlimited/course/getDetail.jhtml`
// 图文直播
export const spreadUrl = `${PRE_API}admin/studytour/listSpreadPage.jhtml`
// 图片相册
export const photoUrl = `${PRE_API}admin/studytour/listPhotoPage.jhtml`
// 保存模板
export const tourTemplateUrl = `${PRE_API}admin/studytour/saveTemplate.jhtml`
// 名单列表
export const applyListUrl = `${PRE_API}admin/apply/listPage.jhtml`
// 名单人员新增
export const applySaveUrl = `${PRE_API}admin/apply/saveStudent.jhtml`
// 名单人员修改
export const applyUpdateUrl = `${PRE_API}admin/apply/updateStudent.jhtml`
// 名单人员删除
export const applyDeleteUrl = `${PRE_API}admin/apply/delete.jhtml`
// 获取名单人员详情
export const applyDetailUrl = `${PRE_API}admin/apply/getDetail.jhtml`
// 获取研学人员对象详情
export const getStudentUrl = `${PRE_API}admin/student/getStudent.jhtml`
// 新增工作人员
export const staffSaveUrl = `${PRE_API}admin/apply/saveStaff.jhtml`
// 修改工作人员
export const staffUpdateUrl = `${PRE_API}admin/apply/updateStaff.jhtml`
// 学员导入
export const applyImportUrl = `${PRE_API}admin/apply/importApply.jhtml`
// 住宿异常情况列表
export const stayAnomalyListUrl = `${PRE_API}admin/apply/stayAnomalyListPage.jhtml`
// 获取研学团行程日期列表
export const getJourneyListUrl = `${PRE_API}admin/studytour/getJourneyList.jhtml`
// 导入模板
export const applyTemplateUrl = `${BASE_TEMPLATE_URL}研学团学员名单导入模板.xlsx`

/** 模版管理 */
// 列表查询（分页）
export const templateListUrl = `${PRE_API}admin/template/listPage.jhtml`
// 新增
export const templateSaveUrl = `${PRE_API}admin/template/save.jhtml`
// 修改
export const templateUpdateUrl = `${PRE_API}admin/template/update.jhtml`
// 删除
export const templateDeleteUrl = `${PRE_API}admin/template/delete.jhtml`
// 获取详情
export const templateDetailUrl = `${PRE_API}admin/template/get.jhtml`
// 获取模板列表
export const listTemplateUrl = `${PRE_API}admin/template/listTemplate.jhtml`

/** 人员管理 */
// 列表查询（分页）
export const teacherListUrl = `${PRE_API}admin/teacher/list.jhtml`
// 新增
export const teacherSaveUrl = `${PRE_API}admin/teacher/save.jhtml`
// 修改
export const teacherUpdateUrl = `${PRE_API}admin/teacher/update.jhtml`
// 删除
export const teacherDeleteUrl = `${PRE_API}admin/teacher/delete.jhtml`
// 解绑微信
export const teacherUnbindUrl = `${PRE_API}admin/teacher/unbind.jhtml`
// 获取详情
export const teacherDetailUrl = `${PRE_API}admin/teacher/detail.jhtml`
// 接团老师列表
export const listTeacherUrl = `${PRE_API}admin/teacher/listTeacher.jhtml`

/** 申报管理 */
// 列表查询（分页）
export const declareListUrl = `${PRE_API}admin/declare/listPage.jhtml`
// 修改
export const declareUpdateUrl = `${PRE_API}admin/declare/update.jhtml`
// 获取详情
export const declareDetailUrl = `${PRE_API}admin/declare/getDeclare.jhtml`

// 活动对象抽出来
export const journey = {
  date: '',
  detailsVOList: [{
    title: '',
    dateType: 1,
    courseVOList: [{
      studyCourseId: '',
      time: '05:00-12:00'
    }],
    attachmentIds: [],
    attachmentVOList: []
  },
  {
    title: '',
    dateType: 2,
    courseVOList: [{
      studyCourseId: '',
      time: '12:00-18:00'
    }],
    attachmentIds: [],
    attachmentVOList: []
  },
  {
    title: '',
    dateType: 3,
    courseVOList: [{
      studyCourseId: '',
      time: '18:00-23:00'
    }],
    attachmentIds: [],
    attachmentVOList: []
  }
  ]
}

// 研学学院对象
export const applyModel = {
  name: '',
  sex: 1,
  birth: '',
  region: '',
  idType: '',
  idCard: '',
  profession: '',
  phone: '',
  registerProvince: '',
  registerCity: '',
  registerAddress: '',
  school: '',
  first: true,
  coverId: '',
  imgList: [],
  guardianList: [{
    guardian: '',
    guardianPhone: '',
    relation: ''
  }]
}
