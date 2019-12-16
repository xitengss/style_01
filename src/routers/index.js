import Vue from 'vue'
import Router from 'vue-router'
import store from 'store'
import {
  post
} from 'utils'
import {
  basefuncsUrl
} from 'api'
import {
  SET_FUNCLIST
} from 'store/mutation-types'

const Layout = () => import('layout')
const Login = () =>
  import('views/login')

// 平台微主页
const AdminHome = () =>
  import('views/admin/home') // 微主页管理
// 平台微主页
const AdminIntroduce = () =>
  import('views/admin/introduce') // 微主页管理

/** 平台管理员 */
const AdminGroup = () => import('views/admin/group') // 研学单元管理
const AdminBae = () => import('views/admin/base') // 研学单元管理
const AdminDetail = () => import('views/admin/detail') // 研学单元管理/详情
const AdminUser = () => import('views/admin/user') // 帐号管理
const AdminComment = () => import('views/admin/comment') // 评论管理
const AdminCommentDetail = () => import('views/admin/comment/detail') // 查看评论

/** 研学单元 */
const BaseCourse = () => import('views/base/course') // 课程管理
const BaseCourseCrete = () => import('views/base/course/create') // 课程管理/新增
const BaseCourseDetail = () => import('views/base/course/detail') // 课程管理/详情
const BaseCourseUnlimitedDetail = () =>
  import('views/base/course/unlimitedDetail') // 畅享课程管理/详情
const BaseAffirm = () =>
  import('views/base/affirm') // 确认课程
const BaseDeclare = () =>
  import('views/base/declare') // 基地申报

/** i研学 */
const GroupTour = () =>
  import('views/group/tour') // 研学团管理
const GroupTourCreate = () =>
  import('views/group/tour/create') // 研学团管理/增改
const GroupTourDetail = () =>
  import('views/group/tour/detail') // 研学团管理/详情
const GroupTourUnlimitedDetail = () =>
  import('views/group/tour/unlimitedDetail') // 研学团畅享管理/详情
const GroupTourUser = () =>
  import('views/group/tour/user') // 研学团管理/人员管理
const GroupTourAnomaly = () =>
  import('views/group/tour/anomaly') // 研学团管理/住宿异常情况
const GroupTemplate = () =>
  import('views/group/template') // 模版管理
const GroupTemplateCreate = () =>
  import('views/group/template/create') // 模版团管理/增改
const GroupTemplateDetail = () =>
  import('views/group/template/detail') // 模版团管理/详情
const GroupTeacher = () =>
  import('views/group/teacher') // 人员管理
const GroupTeacherDetail = () =>
  import('views/group/teacher/detail') // 人员管理/详情
const GroupDeclare = () =>
  import('views/group/declare') // 申报管理
const GroupDeclareCreate = () =>
  import('views/group/declare/create') // 申报管理/编辑
const GroupDeclareDetail = () =>
  import('views/group/declare/detail') // 申报管理/详情

/** 系统设置 */
const User = () =>
  import('views/system/user') // 人员管理
const Department = () =>
  import('views/system/department') // 接口管理
const Role = () =>
  import('views/system/role') // 角色管理
const RolePermission = () =>
  import('views/system/rolePermission') // 角色权限控制
const Dictionary = () =>
  import('views/system/dictionary') // 数据字段

/** 开发设置 */
const Menu = () =>
  import('views/devconfig/menu') // 菜单管理
const Interface = () =>
  import('views/devconfig/interface') // 接口管理

Vue.use(Router)

const routes = [{
  path: '*', // 未匹配到路由时重定向
  redirect: '/login',
  meta: {
    // auth: true,
    // keepAlive: true
  }
}, {
  name: 'login',
  path: '/login',
  component: Login,
  meta: {
    notLoadFunc: true
  }
}, {
  path: '/',
  component: Layout,
  children: [{
    name: 'adminGroup',
    path: '/admin/group',
    meta: {
      name: 'i研学'
    },
    component: AdminGroup
  },
  {
    name: 'adminGroupUser',
    path: '/admin/group/user',
    meta: {
      name: '帐号管理',
      notLoadFunc: true
    },
    component: AdminUser
  },
  {
    name: 'adminBase',
    path: '/admin/base',
    meta: {
      name: '研学单元管理'
    },
    component: AdminBae
  },
  // 新增基地详情
  {
    name: 'adminDetail',
    path: '/admin/base/detail',
    meta: {
      name: '基地详情',
      notLoadFunc: true
    },
    component: AdminDetail
  },
  {
    name: 'adminBaseUser',
    path: '/admin/base/user',
    meta: {
      name: '帐号管理',
      notLoadFunc: true
    },
    component: AdminUser
  },
  {
    name: 'adminComment',
    path: '/admin/comment',
    meta: {
      name: '评论管理'
    },
    component: AdminComment
  },
  {
    name: 'adminCommentDetail',
    path: '/admin/comment/detail',
    meta: {
      name: '查看评论',
      notLoadFunc: true
    },
    component: AdminCommentDetail
  },
  {
    name: 'baseCourse',
    path: '/base/course',
    meta: {
      name: '课程管理'
    },
    component: BaseCourse
  },
  {
    name: 'baseCourseCreate',
    path: '/base/course/create',
    meta: {
      name: '新增课程',
      notLoadFunc: true
    },
    component: BaseCourseCrete
  },
  {
    name: 'baseCourseDetail',
    path: '/base/course/detail',
    meta: {
      name: '课程详情',
      notLoadFunc: true
    },
    component: BaseCourseDetail
  },
  // 畅享课程详情
  {
    name: 'baseCourseUnlimitedDetail',
    path: '/base/course/unlimitedDetail',
    meta: {
      name: '课程详情',
      notLoadFunc: true
    },
    component: BaseCourseUnlimitedDetail
  },
  {
    name: 'baseAffirm',
    path: '/base/affirm',
    meta: {
      name: '确认课程'
    },
    component: BaseAffirm
  },
  //  平台微主页
  {
    name: 'adminHome',
    path: '/admin/home',
    meta: {
      name: '平台微主页'
    },
    component: AdminHome
  },
  // 基地介绍
  {
    name: 'adminIntroduce',
    path: '/admin/introduce',
    meta: {
      name: '基地介绍'
    },
    component: AdminIntroduce
  },
  {
    name: 'baseDeclare',
    path: '/base/declare',
    meta: {
      name: '基地申报'
    },
    component: BaseDeclare
  },
  {
    name: 'groupTour',
    path: '/group/tour',
    meta: {
      name: '研学团管理'
    },
    component: GroupTour
  },
  {
    name: 'groupTourCreate',
    path: '/group/tour/create',
    meta: {
      name: '新增研学团',
      notLoadFunc: true
    },
    component: GroupTourCreate
  },
  {
    name: 'groupTourDetail',
    path: '/group/tour/detail',
    meta: {
      name: '研学团详情',
      notLoadFunc: true
    },
    component: GroupTourDetail
  },
  {
    name: 'groupTourUnlimitedDetail',
    path: '/group/tour/unlimitedDetail',
    meta: {
      name: '研学团畅享详情',
      notLoadFunc: true
    },
    component: GroupTourUnlimitedDetail
  },
  {
    name: 'groupTourUser',
    path: '/group/tour/user',
    meta: {
      name: '研学团人员管理',
      notLoadFunc: true
    },
    component: GroupTourUser
  },
  {
    name: 'groupTourAnomaly',
    path: '/group/tour/anomaly',
    meta: {
      name: '住宿异常情况',
      notLoadFunc: true
    },
    component: GroupTourAnomaly
  },
  {
    name: 'groupTemplate',
    path: '/group/template',
    meta: {
      name: '模版管理'
    },
    component: GroupTemplate
  },
  {
    name: 'groupTemplateCreate',
    path: '/group/template/create',
    meta: {
      name: '新增模版',
      notLoadFunc: true
    },
    component: GroupTemplateCreate
  },
  {
    name: 'groupTemplateDetail',
    path: '/group/template/detail',
    meta: {
      name: '模版详情',
      notLoadFunc: true
    },
    component: GroupTemplateDetail
  },
  {
    name: 'groupTeacher',
    path: '/group/teacher',
    meta: {
      name: '人员管理'
    },
    component: GroupTeacher
  },
  {
    name: 'groupTeacherDetail',
    path: '/group/teacher/detail',
    meta: {
      name: '人员详情',
      notLoadFunc: true
    },
    component: GroupTeacherDetail
  },
  {
    name: 'groupDeclare',
    path: '/group/declare',
    meta: {
      name: '申报管理'
    },
    component: GroupDeclare
  },
  {
    name: 'groupDeclareCreate',
    path: '/group/declare/create',
    meta: {
      name: '编辑申报材料',
      notLoadFunc: true
    },
    component: GroupDeclareCreate
  },
  {
    name: 'groupDeclareDetail',
    path: '/group/declare/detail',
    meta: {
      name: '申报详情',
      notLoadFunc: true
    },
    component: GroupDeclareDetail
  },
  {
    name: 'user',
    path: '/sys/user',
    meta: {
      name: '人员管理'
    },
    component: User
  },
  {
    name: 'department',
    path: '/sys/department',
    meta: {
      name: '人员管理'
    },
    component: Department
  },
  {
    name: 'role',
    path: '/sys/role',
    meta: {
      name: '角色管理'
    },
    component: Role
  },
  {
    name: 'rolePermission',
    path: '/sys/role/permission',
    meta: {
      name: '角色管理',
      notLoadFunc: true
    },
    component: RolePermission
  },
  {
    name: 'menu',
    path: '/sys/menu',
    meta: {
      name: '菜单管理'
    },
    component: Menu
  },
  {
    name: 'interface',
    path: '/sys/interface',
    meta: {
      name: '接口管理'
    },
    component: Interface
  },
  {
    name: 'dictionary',
    path: '/sys/dictionary',
    meta: {
      name: '数据字典'
    },
    component: Dictionary
  }
  ]
}]

const router = new Router({
  mode: 'history',
  base: '/study-pc/',
  routes,
  scrollBehavior (to, from, saveTop) {
    if (saveTop) {
      return saveTop
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  const title = to.meta && to.meta.title
  if (title) {
    document.title = title
  }
  // 不需要加载权限接口
  if (!to.meta.notLoadFunc) {
    const {
      data
    } = await post(basefuncsUrl, `menuId=${store.getters.currentMenuId}`)
    store.commit(SET_FUNCLIST, data || [])
  }
  next()
})

export default router
