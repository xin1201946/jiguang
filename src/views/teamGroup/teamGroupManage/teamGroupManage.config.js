
export const chineseRegexp = /^[\u4E00-\u9FA5]+$/
export const teamGroupManageQuery = [
 /*  {
    type: 'search',
    label: '赛事名称',
    rules: ['contestId'],
    placeholder: '请选择赛事名称',
    data: []
  }, */
  {
    type: 'input',
    label: '团队名称',
    rules: ['teamGroupName'],
    placeholder: '请输入团队名称',
    span: 5
  }
]

export const teamGroupManageTable = [
  {
    title: '团队名称',
    align: 'center',
    dataIndex: 'groupName'
  },
  {
    title: '教练',
    align: 'center',
    dataIndex: 'coachName'
  },
  {
    title: '领队',
    align: 'center',
    dataIndex: 'leaderName'
  },
  {
    title: '团队人数',
    align: 'center',
    dataIndex: 'groupPlayerCount'
  },
  {
    title: '团队分数',
    align: 'center',
    dataIndex: 'groupScore'
  },

  {
    title: '操作',
    align: 'center',
    dataIndex: 'entryFormId',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 200
    // dataIndex: ''
  },
]