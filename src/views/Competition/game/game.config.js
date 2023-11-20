export const gameQuery = [
  {
    type: 'input',
    label: "项目名称",
    rules: [
      "projectName"
    ],
    placeholder: ''
  }
]

export const gameTableColumns = [
  {
    title: '项目名称',
    align: 'center',
  },
  {
    title: '选手上限',
    align: 'center',
  },
  {
    title: '团队人数',
    align: 'center',
  },
  {
    title: '比赛模式',
    align: 'center',
  },
  {
    title: '枪靶数量',
    align: 'center',
  },
  {
    title: '比赛时间',
    align: 'center',
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'contestId',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 140,
    fixed: 'right'
  }
]