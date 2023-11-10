import { getLabel } from '@/utils'

export const tabletPcStatus = [
  {
    value: '0',
    label: '未连接'
  },
  {
    value: '1',
    label: '已连接'
  }
]
export const tabletPcModel = [
  {
    value: '0',
    label: '试射'
  },
  {
    value: '1',
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
    label: '平板状态',
    placehorder: '请选择当前模式',
    data: tabletPcStatus,
  },
  {
    type: 'select',
    rules: [
      'tabletPcModel',
      { rules: [{ required: false, message: '请选择当前模式' }] },
    ],
    label: '当前模式',
    placehorder: '请选择当前模式',
    data: tabletPcModel,
  }
]

export const slabTableColumns = [
  {
    title: '平板对应设备编号枪',
    dataIndex: 'deviceNum0',
    align: 'center'
  },
  {
    title: '平板对应设备编号靶',
    dataIndex: 'deviceNum1',
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
    title: '平板状态',
    dataIndex: 'tabletPcStatus',
    align: 'center',
    customRender: (text) => getLabel(tabletPcStatus, text)
  },
  {
    title: '当前模式',
    dataIndex: 'tabletPcModel',
    align: 'center',
    customRender: (text) => getLabel(tabletPcModel, text)
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'entryFormId',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 200
  }
]