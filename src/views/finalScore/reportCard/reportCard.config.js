// 决赛表
export const reportCardFinalColumns = [
  {
    title: '排名',
    align: 'center',
    dataIndex: "i"
  },
  {
    title: '团队',
    align: 'center',
    dataIndex: 'groupName'
  },
  {
    title: '团队总成绩',
    align: 'center',
    dataIndex: 'stageTotal'
  },
]
// 阶段赛表
export const reportCardStageColumns = [
  {
    title: '排名',
    align: 'center',
    dataIndex: 'i'
  },
  {
    title: '靶位',
    align: 'center',
    dataIndex: 'targetSite'
  },
  /* {
    title: '选手编号',
    align: 'center'
  }, */
  {
    title: '姓名',
    align: 'center',
    dataIndex: 'playerName'
  },
  {
    title: '团体',
    align: 'center',
    dataIndex: 'groupName'
  },
  {
    title: '组',
    children: [],
    align: 'center'
  },
  {
    title: '总计',
    align: 'center',
    dataIndex: 'stageTotal'
  },
]
