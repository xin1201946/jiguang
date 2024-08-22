
import { deleteAction, downFile, download, getAction, postAction } from '@/api/manage'
//赛程监控列表数据
export const contestProcess = param => getAction("contest-process/contestProcess", param)