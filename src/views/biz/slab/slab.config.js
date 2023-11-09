export const tabletPcStatus = [
  {
    value: 0,
    label: '试射'
  },
  {
    value: 1,
    label: '比赛'
  }
]

export const slabQuery = [
  {
    type: "input",
    rules: [
      'tabletPcName',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '平板名称',
    placehorder: '请输入平板名称'
  },
  {
    type: 'select',
    rules: [
      'tabletPcStatus',
      { rules: [{ required: false, message: '请选择当前模式' }] },
    ],
    label: '模式',
    placehorder: '请选择当前模式',
    data: tabletPcStatus,
  }
]

export const slabTableColumns = [
  {
    title: '设备编号',
    dataIndex: 'deviceNum',
    align: 'center'
  },
  {
    title: '平板名称',
    dataIndex: 'tabletPcName',
    align: 'center'
  },
  {
    title: '平板编号',
    dataIndex: 'tabletPcNum',
    align: 'center'
  },
  {
    title: '当前模式',
    dataIndex: 'tabletPcStatus',
    align: 'center'
  },
]