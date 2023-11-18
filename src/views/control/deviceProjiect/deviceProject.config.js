export const deviceProjectQuery = [
  {
    type: "input",
    rules: [
      'tabletPcNum',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '平板编号',
    placehorder: '请输入平板编号'
  },
  {
    type: "input",
    rules: [
      'tabletPcNum',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '项目名称',
    placehorder: '请输入平板编号'
  },
]
export const deviceProjectTableColumns = [
  {
    title: '平板编号',
    align: 'center',
    dataIndex: "tabletPcNum"
  },
  {
    title: '项目名称',
    align: 'center',
    dataIndex: "aimCurveShow",
  },
  {
    title: '组数',
    align: 'center',
    dataIndex: "autoAmplify",
  },
  {
    title: '弹药',
    align: 'center',
    dataIndex: "clearTargetWay",
  },
]