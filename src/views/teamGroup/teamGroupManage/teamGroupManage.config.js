
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
    placeholder: '请输入团队名称'
  }
]

export const teamGroupManageTable = [
  {
    title: '教练员',
    align: 'center',
    dataIndex: 'a'
  },
  {
    title: '团队编号',
    align: 'center',
    dataIndex: 'contestName'
  },
  {
    title: '团队名称',
    align: 'center',
    dataIndex: 'teamGroupName'
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