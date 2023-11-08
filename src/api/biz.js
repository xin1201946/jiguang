import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'


// 平板分页查询
export const bizTabletPcPageList = (data) => postAction('bizTabletPc/page/list', data)
// 平板添加
export const bizTabletPcSave = data => postAction("/bizTabletPc/save", data)

// 报名表分页查询
export const bizEntryFormPageList = data => postAction('/bizEntryForm/page/list',data)
// 报名保存
export const bizEntryFormSave = data => postAction('/bizEntryForm/save',data)
// 报名删除
export const bizEntryFormDelete = id => deleteAction(`/bizEntryForm/delete/${id}`)
// 报名修改
export const bizEntryFormUpdate = data => postAction("/bizEntryForm/update", data)
// 报名查询不分页
export const bizEntryFormList = data => postAction("/bizEntryForm/list", data)

/**
 * 项目
 */
// 项目分页查询
export const bizProjectPageList = data => postAction('bizProject/page/list', data)
// 项目添加

// 项目修改
// 项目删除
// 项目不分页查询
