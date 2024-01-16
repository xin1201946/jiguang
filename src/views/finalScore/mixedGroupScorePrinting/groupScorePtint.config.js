export const groupCardColumns = [
  {
    title: '排名',
    align: 'center',
    dataIndex: '',
    key: 'rowIndex',
    width: 80,
    customRender: function (t, r, index) {
      return parseInt(index) + 1
    },
  },
  {
    title: '代表队',
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
    dataIndex: 'score'
  },
]
export const groupCardInnerColumns = [
  {
    title: '排名',
    align: 'center',
    dataIndex: '',
    key: 'rowIndex',
    width: 80,
    customRender: function (t, r, index) {
      return parseInt(index) + 1
    },
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
    dataIndex: 'stageTotal',
    // fixed: 'right',
  },
]