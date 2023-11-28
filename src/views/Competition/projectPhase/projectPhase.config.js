export const integrationMethod = [
  {
    value: '0',
    label: "小环"
  },
  {
    value: '1',
    label: "大环"
  },
  {
    value: '2',
    label: "大环加好十环"
  },
  {
    value: '3',
    label: "中数"
  },
  {
    value: '4',
    label: "目标积分"
  }
]

export const isAdjustment = [
  {
    value: '0',
    label: "否"
  },
  {
    value: '1',
    label: "是"
  },
]
export const isGroupRank = [
  {
    value: '0',
    label: "否"
  },
  {
    value: '1',
    label: "是"
  },
]

export const playerGroup = [
  {
    value: '0',
    label: "指定选手"
  },
  {
    value: '1',
    label: "前几名"
  },
]
export const scoreModel = [
  {
    value: '0',
    label: "记分射"
  },
]

export const rules = {
  stageName: [
    { required: true, message: '请输入阶段名称', trigger: 'blur' }
  ],
  stageOrder: [
    { required: true, message: '请输入阶段顺序', trigger: 'blur' }
  ],
  isGroupRank: [
    { required: true, message: '请选择是否团体排名', trigger: 'blur' }
  ],
  playerGroup: [
    { required: true, message: '请选择参团选手', trigger: 'blur' }
  ],
  playerNum: [
    { required: true, message: '请选择参团人数', trigger: 'blur' }
  ],
  integrationMethod: [
    { required: true, message: '请选择积分方式', trigger: 'blur' }
  ],
  scoreModel: [
    { required: true, message: '请选择计分模式', trigger: 'blur' }
  ],
  groupCount: [
    { required: true, message: '请输入默认组数', trigger: 'blur' }
  ],
  gunsPerGroup: [
    { required: true, message: '请输入每组枪数', trigger: 'blur' }
  ],
  shootPeriod: [
    { required: true, message: '请输入射击时长', trigger: 'blur' }
  ],
  isAdjustment: [
    { required: true, message: '请选择是否试射', trigger: 'blur' }
  ],
  riseNum: [
    { required: true, message: '请输入晋级名次', trigger: 'blur' }
  ]
}