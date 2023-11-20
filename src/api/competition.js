import { deleteAction, download, getAction, postAction } from '@/api/manage'

/**
 * 赛事表
 */
export const bizContestPageList = data => postAction("bizContest/page/list", data)
export const bizContestList = (data = {}) => postAction("bizContest/list", data)
export const bizContestSave = data => postAction("bizContest/save", data)
export const bizContestUpdate = data => postAction("bizContest/update", data)
export const bizContestDelete = id => deleteAction(`bizContest/delete/${id}`)
export const bizContestQueryById = id => getAction(`bizContest/queryById/${id}`)



/**
 * 赛事项目表
 */
// 根据赛事获取项目
export const bizContestProjectPageList = data => postAction("bizContestProject/page/list", data)
export const bizContestProjectList = (data = {}) => postAction("bizContestProject/list", data)
export const bizContestProjectSave = data => postAction("bizContestProject/save", data)
export const bizContestProjectUpdate = data => postAction("bizContestProject/update", data)
export const bizContestProjectDelete = id => deleteAction(`bizContestProject/delete/${id}`)

/**
 * 项目设备表
 */
export const bizContestProjectDevicePageList = data => postAction("bizContestProjectDevice/page/list", data)
export const bizContestProjectDeviceList = (data = {}) => postAction("bizContestProjectDevice/list", data)
export const bizContestProjectDeviceSave = data => postAction("bizContestProjectDevice/saveBatch", data)
export const bizContestProjectDeviceUpdate = data => postAction("bizContestProjectDevice/update", data)
export const bizContestProjectDeviceDelete = id => deleteAction(`bizContestProjectDevice/delete/${id}`)

/**
 * 项目阶段表
 */
export const bizContestProjectStagePageList = data => postAction("bizContestProjectStage/page/list", data)
export const bizContestProjectStageList = (data = {}) => postAction("bizContestProjectStage/list", data)
export const bizContestProjectStageSave = data => postAction("bizContestProjectStage/save", data)
export const bizContestProjectStageUpdate = data => postAction("bizContestProjectStage/update", data)
export const bizContestProjectStageDelete = id => deleteAction(`bizContestProjectStage/delete/${id}`)

/**
 * 参赛人员表
 */

export const bizContestPlayerGetImportTemplate = () => download("bizContestPlayer/getImportTemplate")
export const bizContestPlayerDelete = (id) => deleteAction(`bizContestPlayer/delete/${id}`)
export const bizContestProjectPlayerPageList = (data ) => postAction('bizContestProjectPlayer/page/list', data)
export const bizContestPlayerList = data => postAction("bizContestProjectPlayer/list", data)
export const bizContestPlayerUpdate = data => postAction("bizContestPlayer/update", data)
export const bizContestProjectPlayerUpdatePlayer = data => postAction("bizContestProjectPlayer/updatePlayer", data)

export const bizContestPlayerSave = data => postAction('bizContestPlayer/save', data)

export const bizContestProjectPlayerDelete = id => deleteAction(`bizContestProjectPlayer/delete/${id}`)
/**
 * 赛事审核
 */
export const bizContestAudit = data => postAction("bizContest/audit", data)