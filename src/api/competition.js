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
// 阶段组别
export const processSelectGroupList = data => postAction('contest-process/selectGroupList', data)
// 查询空闲靶位
export const processSelectTargetList = data => postAction('contest-process/selectTargetList', data)
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
//屏幕展示----所有组别成绩
export const littleScreenByTotal = data => getAction("contest-process/littleScreenByTotal", data)
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

// 大屏配置
export const getDataScreenConfigApi = data => postAction("bizScreen/list", data)
// 大屏更新
export const getDataScreenConfigUpdataApi = data => postAction("bizScreen/update", data)
// 大屏当前配置
export const getDataScreenCurrentConfigApi = data => postAction("bizScreen/queryScreen", data)

//阶段最终成绩
export const bizPlayerFinalScoreFinalSportsList = data => postAction('bizPlayerFinalScore/finalSportsList', data)
export const bizPlayerFinalScoreFinalPdfListByTarget = data => postAction('bizPlayerFinalScore/finalPdfListByTarget', data)
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


// 比赛安排  成统裁判员列表
export const bizUnifiedUserList = data => postAction("bizUnified/userList", data)
// 分配裁判员
export const bizUnifiedSaveUnified = data => postAction("bizUnified/saveUnified", data)
// 查询运动员每组详细成绩
export const processGetPlayerScore = data => postAction("contest-process/getPlayerScore", data)
// 修改组别成绩
export const processEditGroupScore = data => postAction("contest-process/editGroupScore", data)
// 切换靶图--查询运动员及运动员详细成绩信息
export const processGetPlayerTargetScores = data => postAction("contest-process/getPlayerTargetScores", data)
// 切换靶图---获取阶段运动员组别及弹药组别
export const processGetStageGroups = data => getAction("contest-process/getStageGroups", data)


// 首页
export const homeGetHomeList = data => postAction("home/getHomeList", data)


// 设置发序无效
export const grabShot = data => postAction("contest-process/grabShot", data)

//删除多余发序
export const deleteSurplusShoot = data => getAction("bizPlayerScore/deleteSurplusShoot", data)
//设置混团发序无效
export const grabShotGroup = data => postAction("contest-process/grabShotGroup", data)
//混团积分监控
export const getDetailList = data => postAction("bizTeamGoldScore/getDetailList", data)
//混团变更组别
export const changeGroupContestGroup = data => postAction("contest-process/changeGroupContestGroup", data)

// 混团变更组别下拉框数据
export const changeGroupList = data => postAction("contest-process/changeGroupList", data)
//阶段打印分组打印
export const qualificationScorePdfByGroup = data => postAction("bizPlayerFinalScore/qualificationScorePdfByGroup", data)

//资格赛 决赛添加运动员
export const savePlayer = data => postAction("contest-process/savePlayer", data)
//资格赛编辑人员信息

export const updatePlayer = data => postAction("contest-process/updatePlayer", data)
//删除运动员

export const deletePlayer = data => postAction("contest-process/deletePlayer", data)

//发送资格赛成绩
export const bizSendScoreSend = data => getAction("/bizSendScore/send", data)
//发送决赛成绩
export const bizSendScoreSendFinal = data => getAction("bizSendScore/sendFinal", data)
//发送混团成绩

export const bizSendScoreSendTeam = data => getAction("bizSendScore/sendTeam", data)
//混团添加运动员

export const savePlayerGroup = data => postAction("contest-process/savePlayerGroup", data)
//混团删除运动员
export const deletePlayerGroup = data => postAction("contest-process/deletePlayerGroup", data)
//混团删除运动员代表队集合
export const getGroupNameList = data => postAction("bizTeamGoldScore/getGroupNameList", data)
//混团添加运动员 运动员集合数据
export const getPlayerList = data => postAction("bizTeamGoldScore/getPlayerList", data)


/**
 *  自定义 查询大屏当前配置列表 大屏用
 * */
export const getDatabizCustomScreenConfigApi = data => postAction("bizCustomScreen/queryScreen", data)

/**
 * 自定义配置 开始
 * 自定义大屏配置列表
*/
export const getDatabizCustomScreenListApi = data => postAction("bizCustomScreen/list", data)

/**
 * 自定义大屏配置 更新=编辑
*/
export const getDatabizCustomScreenUpdateApi = data => postAction("bizCustomScreen/update", data)
/**
 * 自定义配置 结束
 */