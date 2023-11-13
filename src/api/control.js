import { deleteAction, downFile, download, postAction } from '@/api/manage'

/**
 * 设备控制
 */
export const controlSave = (data) => postAction("bizDeviceControl/save", data)

export const controlPageList = data => postAction('bizDeviceControl/page/list', data)

export const controlDelete = id => deleteAction(`bizDeviceControl/delete/${id}`)

export const controlUpdate = data => postAction('bizDeviceControl/update', data)

/**
 * 设备显示
 */

export const displaySave = data => postAction('bizDeviceDisplay/save', data)
export const displayPageList = data => postAction("bizDeviceDisplay/page/list", data)

export const displayUpdate = data => postAction('bizDeviceDisplay/update', data)

export const displayDelete = id => deleteAction(`bizDeviceDisplay/delete/${id}`)