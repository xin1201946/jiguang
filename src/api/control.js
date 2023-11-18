import { deleteAction, getAction, postAction } from '@/api/manage'

/**
 * 设备控制
 */
export const controlSave = (data) => postAction("bizDeviceControl/save", data)

export const controlPageList = data => postAction('bizDeviceControl/page/list', data)

export const controlDelete = id => deleteAction(`bizDeviceControl/delete/${id}`)

export const controlUpdate = data => postAction('bizDeviceControl/update', data)

export const bizDeviceControlControl = data => postAction("bizDeviceControl/control", data)

/**
 * 设备显示
 */

export const displaySave = data => postAction('bizDeviceDisplay/save', data)
export const displayPageList = data => postAction("bizDeviceDisplay/page/list", data)

export const displayUpdate = data => postAction('bizDeviceDisplay/update', data)

export const displayDelete = id => deleteAction(`bizDeviceDisplay/delete/${id}`)

export const bizDeviceDisplayControl = data => postAction("bizDeviceDisplay/control", data)

export const bizTabletProjectControl = data => postAction("bizTabletProject/control", data)

export const bizTabletPcQueryDeviceControlById = id => getAction(`bizTabletPc/queryDeviceControlById/${id}`)