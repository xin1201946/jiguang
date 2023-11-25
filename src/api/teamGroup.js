import { deleteAction, download, getAction, postAction } from '@/api/manage'

export const bizGroupPageList = data => postAction('bizGroup/page/list', data)
export const bizGroupSave = data => postAction('bizGroup/save', data)
export const bizGroupUpdate = data => postAction('bizGroup/update', data)
export const bizGroupQueryById = id => getAction(`bizGroup/queryById/${id}`)