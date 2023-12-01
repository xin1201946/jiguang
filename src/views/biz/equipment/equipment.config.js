import { getLabel } from '@/utils'

export const deviceType = [
  {
    value: '0',
    label: '激光训练器'
  },
  {
    value: '1',
    label: '激光接收靶'
  }
]

export const deviceGunType = [
  {
    value: '0',
    label: '长款激光训练器'
  },
  {
    value: '1',
    label: '短款激光训练器'
  }
]

export const deviceStatus = [
  {
    value: '0',
    label: '离线'
  },
  {
    value: '1',
    label: '在线'
  }
]


export const equipmentQuery = [
  {
    type: 'input',
    rules: [
      'deviceNum',
      { rules: [{ required: false, message: '请输入设备编号' }] }
    ],
    label: '设备编号',
    placeholder: '请输入设备编号',
  },
  {
    type: 'select',
    rules: [
      'deviceStatus',
      { rules: [{ required: false, message: '请选择设备状态' }] }
    ],
    label: '设备状态',
    placeholder: '请选择设备状态',
    data: deviceStatus
    // data: deviceType
  },
  {
    type: 'select',
    rules: [
      'deviceGunType',
      { rules: [{ required: false, message: '请选择激光训练器' }] }
    ],
    label: '激光训练器类型',
    placeholder: '请选择激光训练器类型',
    data: deviceGunType
  },
  {
    type: 'select',
    rules: [
      'deviceType',
      { rules: [{ required: false, message: '请选择设备类型' }] }
    ],
    label: '设备类型',
    placeholder: '请选择设备类型',
    data: deviceType
  },
]

export const equipmentColumns = [
  {
    title: '设备编号',
    dataIndex: 'deviceNum',
    align: 'center'
  },
  {
    title: '设备电量',
    dataIndex: 'deviceVoltage',
    align: 'center',
    customRender: (text) => `${text}%`,
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    align: 'center',
    customRender: (text, record, index) => {
      const type = getLabel(deviceType, text)
      return type
    },
  },
  {
    title: '激光训练器类型',
    dataIndex: 'deviceGunType',
    align: 'center',
    scopedSlots: {
      customRender: 'deviceGunType'
    },
    customRender: (text, record, index) => {
      const type = getLabel(deviceGunType, text)
      return type
    },
  },
  {
    title: '设备状态',
    dataIndex: 'deviceStatus',
    align: 'center',
    customRender: (text, record, index) => {
      const type = getLabel(deviceStatus, text)
      return type
    },
  },
  {
    title: '操作',
    dataIndex: 'deviceId',
    align: 'center',
    scopedSlots: {
      customRender: 'operation'
    },
    fixed: 'right',
    width: 200
  }
]