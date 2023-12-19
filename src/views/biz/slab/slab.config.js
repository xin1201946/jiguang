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
      "tabletPcNum",
    ],
    label: '平板编号',
    placeholder: '请输入平板编号'
  },
  {
    type: "input",
    rules: [
      'tabletPcNum',
      { rules: [{ required: false, message: '请输入平板编号' }] },
    ],
    label: '平板编号',
    placeholder: '请输入平板编号'
  },
  {
    type: "input",
    rules: [
      'tabletPcName',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '平板名称',
    placeholder: '请输入平板名称'
  },
  {
    type: 'select',
    rules: [
      'tabletPcStatus',
      { rules: [{ required: false, message: '请选择当前模式' }] },
    ],
    label: '平板状态',
    placeholder: '请选择平板状态',
    data: tabletPcStatus,
  },
  {
    type: 'select',
    rules: [
      'tabletPcModel',
      { rules: [{ required: false, message: '请选择当前模式' }] },
    ],
    label: '当前模式',
    placeholder: '请选择当前模式',
    data: tabletPcModel,
  }
]

export const slabTableColumns = [
  {
    title: '平板编号',
    dataIndex: 'tabletPcNum',
    align: 'center'
  },
  {
    title: '平板名称',
    dataIndex: 'tabletPcName',
    align: 'center'
  },

  {
    title: '激光训练器编号',
    dataIndex: 'deviceNum0',
    align: 'center',
  },
  {
    title: '激光训练器类型',
    dataIndex: 'deviceGunType',
    align: 'center',
    customRender: (text, item) => {
      return item.deviceGunType === '0'? '长款激光训练器' : item.deviceGunType === '1'? '短款激光训练器' : ''
    }
  },
  {
    title: '激光接收靶编号',
    dataIndex: 'deviceNum1',
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
    fixed: 'right',
    width: 200
  }
]