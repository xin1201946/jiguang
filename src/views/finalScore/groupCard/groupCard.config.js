export const groupCardColumns = [
  {
    title: '排名',
    align: 'center',
    dataIndex: 'i'
  },
  {
    title: '团队',
    align: 'center',
    dataIndex: 'groupName'
  },
  {
    title: '组',
    align: 'center',
    children: []
  },
  {
    title: '总计',
    align: 'center',
    dataIndex: 'teamStageTotal'
  },
]
export const groupCardInnerColumns = [
  {
    title: '排名',
    align: 'center',
    dataIndex: 'i'
  },
  {
    title: '姓名',
    align: 'center',
    dataIndex: 'playerName'
  },
  {
    title: '组',
    align: 'center',
    children: []
  },
  {
    title: '总计',
    align: 'center',
    dataIndex: 'total',
    // fixed: 'right',
  },
]