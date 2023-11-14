import { deleteAction, downFile, download, postAction } from '@/api/manage'

/**
 * 平板
 */
// 平板分页查询
export const bizTabletPcPageList = (data) => postAction('bizTabletPc/page/list', data)
// 平板添加
export const bizTabletPcSave = data => postAction("/bizTabletPc/save", data)
// 平板修改
export const bizTabletPcUpdate = data => postAction("bizTabletPc/update", data)
// 平板删除
export const bizTabletPcDelete = id => deleteAction(`bizTabletPc/delete/${id}`)
// 平板列表
export const bizTabletPcList = () => postAction("bizTabletPc/list", {})

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
// 下载
export const bizEntryFormGetImportTemplate = () => download("bizEntryForm/getImportTemplate")
// export const bizEntryFormGetImportTemplate = () =
/**
 * 项目
 */
// 项目分页查询
export const bizProjectPageList = data => postAction('bizProject/page/list', data)
// 项目添加
export const bizProjectSave = data => postAction('bizProject/save', data)
// 项目修改
export const bizProjectUpdate = data => postAction('bizProject/update', data)
// 项目删除
export const bizProjectDelete = id => deleteAction(`bizProject/delete/${id}`)
// 项目不分页查询
export const bizProjectList = (data = {}) => postAction("bizProject/list", data)

/**
 * 设备
 */
export const bizDevicePageList = data => postAction('bizDevice/page/list', data)
export const bizDeviceSave = data => postAction('bizDevice/save', data)
export const bizDeviceUpdate = data => postAction('bizDevice/update',data)
export const bizDeviceDelete = id => deleteAction(`bizDevice/delete/${id}`)
export const bizDeviceList = data => postAction("bizDevice/list", data)