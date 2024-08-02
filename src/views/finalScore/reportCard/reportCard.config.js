// 决赛表
export const reportCardFinalColumns = [
  {
    title: '排名',
    align: 'center',
    dataIndex: "i"
  },
  {
    title: '代表队',
    align: 'center',
    dataIndex: 'groupName'
  },
  {
    title: '代表队总成绩',
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
    dataIndex: 'targetSiteStr'
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
    title: '代表队',
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
  {
    title: ' ',
    align: 'center',
    dataIndex: 'goodTotal',
    customRender: (text, record, index) => {
      return record.goodTotal + 'x'
    },
  },
]
