export const scoreQuery = [
  {
    type: "input",
    rules: [
      'name',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '姓名',
    placehorder: '请输入姓名'
  },
  {
    type: "input",
    rules: [
      'xh',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '学号',
    placehorder: '请输入学号'
  },
  {
    type: 'range',
    rules: [
      'time',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '时间',
    placehorder: '请选择时间',
    // start, end默认
    range: ['start', 'end']
  }
]

export const scoreTableColums = [
  {
    title: '射击人员',
    align: 'center',
  },
  {
    title: '设备编号',
    align: 'center',
  },
  {
    title: '总成绩',
    align: 'center',
  },
  {
    title: '组数',
    align: 'center',
  },
  {
    title: '开始时间',
    align: 'center',
  },
  {
    title: '操作',
    align: 'center',
  },
]