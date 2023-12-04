import { deleteAction, downFile, download, getAction, postAction } from '@/api/manage'

export const bizConfigList = (data = {}) => postAction('bizConfig/list', data)

//批量更新
export const bizConfigUpdateBatch = data => postAction("bizConfig/updateBatch", data)