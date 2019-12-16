import {
  PRE_API
} from './config'

/* 用户管理模块接口 */
// 获取用户列表
export const userListUrl = `${PRE_API}user/list.jhtml`
// 新增角色
export const userCreateUrl = `${PRE_API}user/create.jhtml`
// 删除角色
export const userDeleteUrl = `${PRE_API}user/delete.jhtml`
// 更新角色
export const userUpdateUrl = `${PRE_API}user/update.jhtml`
// 获取角色列表
export const roleListAllUrl = `${PRE_API}role/listAll.jhtml`
// 重置密码
export const userResetPasswordUrl = `${PRE_API}user/resetPasswordOthers.jhtml`
// 改变账号状态
export const userChangeStatusUrl = `${PRE_API}user/changeStatus.jhtml`

/* 部门模块接口 */
// 获取部门前两层树
export const deptTreeUrl = `${PRE_API}dept/getDeptTree.jhtml`
// 通过根节点获取其节点下得所有子节点
export const deptChildernTreeUrl = `${PRE_API}dept/getDpChildreTree.jhtml`
// 根据级别获取该级别的所有节点
export const deptParentTreeUrl = `${PRE_API}dept/getParentTree.jhtml`
// 新增树
export const deptCreateUrl = `${PRE_API}dept/create.jhtml`
// 检查新增节点名称是否重复
export const deptCheckSameNodeUrl = `${PRE_API}dept/checkSameNode.jhtml`
// 删除节点
export const deptDeleteUrl = `${PRE_API}dept/delete.jhtml`
// 部门重命名
export const deptRenameUrl = `${PRE_API}dept/rename.jhtml`
// 节点移动
export const deptMoveUrl = `${PRE_API}dept/move.jhtml`
// 部门模糊查询
export const deptFilterUrl = `${PRE_API}dept/listDeptFilterName.jhtml`
// 获取整个树
export const deptCacheTreeUrl = `${PRE_API}dept/getCacheTree.jhtml`

/* 角色管理模块接口 */
// 获取角色列表
export const roleListUrl = `${PRE_API}role/list.jhtml`
// 新增角色
export const roleCreateUrl = `${PRE_API}role/create.jhtml`
// 删除角色
export const roleDeleteUrl = `${PRE_API}role/delete.jhtml`
// 更新角色
export const roleUpdateUrl = `${PRE_API}role/update.jhtml`
// 获取角色权限
export const authGetUrl = `${PRE_API}auth/getUserAuth.jhtml`
// 保存角色权限
export const authSaveUrl = `${PRE_API}auth/baseSave.jhtml`
// 获取用户特有的功能
export const getFuncsUrl = `${PRE_API}auth/getFuncs.jhtml`

/* 菜单管理模块接口 */
// 菜单列表
export const menuListUrl = `${PRE_API}base/menu/list.jhtml`
// 新增菜单
export const menuCreateUrl = `${PRE_API}base/menu/create.jhtml`
// 删除菜单
export const menuDeleteUrl = `${PRE_API}base/menu/delete.jhtml`
// 更新菜单
export const menuUpdateUrl = `${PRE_API}base/menu/update.jhtml`
// 功能列表
export const funcListUrl = `${PRE_API}base/func/list.jhtml`
// 创建功能
export const funcCreateUrl = `${PRE_API}base/func/create.jhtml`
// 删除功能
export const funcDeleteUrl = `${PRE_API}base/func/delete.jhtml`
// 编辑功能
export const funcUpdateUrl = `${PRE_API}base/func/update.jhtml`
// 复制功能
export const funcCopyUrl = `${PRE_API}base/func/copy.jhtml`
// 编辑功能时获取接口列表
export const funcGetInterfaceListUrl = `${PRE_API}base/func/getInterfaceList.jhtml`

/* 接口管理模块接口 */
// 获取接口树
export const interfaceTreeUrl = `${PRE_API}base/interface/getInterfaceTree.jhtml`
// 关键字搜索列表接口
export const interfaceListUrl = `${PRE_API}base/interface/list.jhtml`
// 新增接口
export const interfaceCreateUrl = `${PRE_API}base/interface/create.jhtml`
// 删除接口
export const interfaceDeleteUrl = `${PRE_API}base/interface/delete.jhtml`
// 修改接口
export const interfaceUpdateUrl = `${PRE_API}base/interface/update.jhtml`
// 接口重命名
export const interfaceRenameUrl = `${PRE_API}base/interface/rename.jhtml`

/* 数据字典模块接口 */
// 获取数据字典(非系统内置)
export const dictionaryListUrl = `${PRE_API}dictionary/listWithChildren.jhtml.jhtml`
// 获取数据字典
export const dictionaryListByTagUrl = `${PRE_API}dictionary/listByTag.jhtml`
// 新增数据字典
export const dictionarySaveUrl = `${PRE_API}dictionary/save.jhtml`
// 新增字类型
export const dictionaryChildrenUrl = `${PRE_API}dictionary/children/save.jhtml`
// 修改数据字典
export const dictionaryUpdateUrl = `${PRE_API}dictionary/update.jhtml`
// 删除数据字典
export const dictionaryRemoveUrl = `${PRE_API}dictionary/batchRemove.jhtml`
// 新增子节点
export const dictionarySaveChildrenUrl = `${PRE_API}dictionary/saveChildren.jhtml`
// 修改子节点
export const dictionaryUpdateChildrenUrl = `${PRE_API}dictionary/updateChildren.jhtml`
