import { deleteAction, download, getAction, postAction } from '@/api/manage'

export const bizGroupPageList = data => postAction('bizGroup/page/list', data)
export const bizGroupSave = data => postAction('bizGroup/save', data)
export const bizGroupUpdate = data => postAction('bizGroup/update', data)
export const bizGroupQueryById = id => getAction(`bizGroup/queryById/${id}`)
// 更新按钮
export const bizGroupUpdateBtn = (params = {}) => getAction('bizGroup/updateBtn', params)
// 更新教练
export const bizGroupUpdateCoachName = data => postAction('bizGroup/updateCoachName', data)
