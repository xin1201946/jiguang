import { deleteAction, download, getAction, postAction, downFile } from '@/api/manage'

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
export const bizContestPlayerDelete = (param) => {
  return getAction(`bizContestPlayer/delete`, param)
}
// 全部删除
export const bizContestPlayerDeleteAll = param => getAction("bizContestPlayer/deleteAll", param)

export const bizContestProjectPlayerPageList = (data) => postAction('bizContestProjectPlayer/page/list', data)
export const bizContestPlayerList = data => postAction("bizContestProjectPlayer/list", data)
export const bizContestPlayerUpdate = data => postAction("bizContestPlayer/update", data)
export const bizContestProjectPlayerUpdatePlayer = data => postAction("bizContestProjectPlayer/updatePlayer", data)

export const bizContestPlayerSave = data => postAction('bizContestPlayer/save', data)

export const bizContestProjectPlayerDelete = id => deleteAction(`bizContestProjectPlayer/delete/${id}`)
/**
 * 赛事审核
 */
export const bizContestAudit = data => postAction("bizContest/audit", data)

/**
 * 赛事成绩
 */

export const bizPlayerFinalScorePageList = data => postAction('bizPlayerFinalScore/page/list', data)
// 运动员列表
export const bizPlayerFinalScoreSportsList = data => postAction('bizPlayerFinalScore/sportsList', data)
// 混团
export const bizPlayerFinalScoreSportsListGroup = data => postAction("bizPlayerFinalScore/sportsListGroup", data)
// 成绩详情
export const bizPlayerFinalScoreSportsScoresList = data => postAction('bizPlayerFinalScore/sportsScoresList', data)
// 成绩详情混团
export const bizPlayerFinalScoreSportsScoresListGroup = data => postAction("bizPlayerFinalScore/sportsScoresListGroup", data)
export const bizPlayerFinalScoreQueryById = id => getAction(`bizPlayerFinalScore/queryById/${id}`)

export const selectStageStatusList = (data) => postAction("contest-process/selectStageStatusList", data)
// contest-process/selectStageStatusList

/**
 * 比赛安排
 */
//查询阶段人员列表
export const getStagePlayerGroup = data => postAction("contest-process/getStagePlayerGroup", data)
//给阶段导入运动员列表
export const addStagePlayer = data => postAction("contest-process/addStagePlayer", data)
// 分組
export const stagePlayerGroup = data => postAction("contest-process/stagePlayerGroup", data)
//抽签
export const drawing = data => postAction("contest-process/drawing", data)
//将抽签结果推送至平板
export const propePlayerSiteToPad = data => postAction("contest-process/propePlayerSiteToPad", data)
//准备
export const ready = data => postAction("contest-process/ready", data)
//试射
export const fireAdjust = data => postAction("contest-process/fireAdjust", data)
//比赛开始
export const startFire = data => postAction("contest-process/startFire", data)
//结束比赛
export const endFire = data => postAction("contest-process/endFire", data)
//下一阶段
export const nextStage = data => postAction("contest-process/nextStage", data)
//查询运动员详细成绩
export const getScoresByFinalScoreId = data => postAction("contest-process/getScoresByFinalScoreId", data)
//停止运动员的比赛状态
export const stopPlayer = data => postAction("contest-process/stopPlayer", data)
//删除运动员信息
export const delPlayerShootScore = data => getAction("contest-process/delPlayerShootScore", data)
//修改成績
export const updateScore = data => postAction("contest-process/updateScore", data)
//判罚
export const penalty = data => postAction("contest-process/penalty", data)
// 备注
export const remark = data => postAction("contest-process/remark", data)
//查询编辑人员
export const getStageInPlayerList = data => postAction("contest-process/getStageInPlayerList", data)
//编辑人员确认接口
export const editStagePlayer = data => postAction("contest-process/editStagePlayer", data)

//屏幕展示 ---- 个人赛
export const littleScreen = data => getAction("contest-process/littleScreen", data)
//屏幕展示 ---- 混团赛决赛
export const getMixeTeamFinalsListAPI = data => postAction("largeScreen/getTeamGoldList", data)
//屏幕展示 ---- 团队赛
export const getTeamScoresAPI = data => postAction("largeScreen/getTeamScores", data)
//屏幕展示 ---- 团队综合排名
export const getTeamTotalScores = data => postAction("largeScreen/getTeamTotalScores", data)
//屏幕展示 ---- 混团资格赛排名
export const getMassingScores = data => postAction("largeScreen/getMassingScores", data)

//查询数据大屏接口 ---- 大屏列表
export const getDataScreenList = data => postAction("bizConfig/list", data)
// 混团金铜牌赛id查询
export const bizTeamGoldScoreQueryById = id => getAction(`bizTeamGoldScore/queryById/${id}`)


//阶段最终成绩
export const bizPlayerFinalScoreFinalSportsList = data => postAction('bizPlayerFinalScore/finalSportsList', data)
// 团队最终成绩
export const bizPlayerFinalScoreTeamSports = data => postAction('bizPlayerFinalScore/teamSports', data)

// 导出抽签pdf
// downloadFile
export const contest_processGetSitePdf = param => downFile("contest-process/getSitePdf", param)

// 查询组别比赛时间
export const contest_processGetStageGroupTime = data => postAction("contest-process/getStageGroupTime", data)
//更新组别比赛时间
export const contest_processUpdateStageGroupTime = data => postAction("contest-process/updateStageGroupTime", data)
// 更换靶位
export const retarget = data => postAction("contest-process/retarget", data)
// 查询空闲靶位
export const selectTargetList = data => postAction("contest-process/selectTargetList", data)
// 查询换靶记录
export const getChangeListAPI = data => postAction("bizContestRetarget/page/list", data)
// 添加发序成绩
export const saveScore = data => postAction("contest-process/saveScore", data)
// 淘汰
export const eliminationFinal = data => postAction("contest-process/eliminationFinal", data)
// 同分
export const sameFinals = data => postAction("contest-process/sameFinals", data)
// 切换分组
export const changeGroup = data => postAction("contest-process/changeGroup", data)
// 变更分组
export const changeGroupContest = data => postAction("contest-process/changeGroupContest", data)

// 导出参赛人员
export const downloadProjectItem = param => downFile("bizContestPlayer/downloadProjectItem", param)

// 混团成绩打印 资格赛
export const massingSportsList = data => postAction("bizPlayerFinalScore/massingSportsList", data)

