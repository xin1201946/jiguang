import { getLabel } from '@/utils'

export const deviceType = [
  {
    value: '0',
    label: '枪'
  },
  {
    value: '1',
    label: '靶'
  }
]

export const deviceGunType = [
  {
    value: '0',
    label: '气步枪'
  },
  {
    value: '1',
    label: '气手枪'
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
    placehorder: '请输入设备编号',
  },
  {
    type: 'input',
    rules: [
      'deviceStatus',
      { rules: [{ required: false, message: '请输入设备状态' }] }
    ],
    label: '设备状态',
    placehorder: '请输入设备状态',
    // data: deviceType
  },
  {
    type: 'select',
    rules: [
      'deviceGunType',
      { rules: [{ required: false, message: '请选择枪支类型' }] }
    ],
    label: '枪支类型',
    placehorder: '请选择枪支类型',
    data: deviceGunType
  },
  {
    type: 'select',
    rules: [
      'deviceType',
      { rules: [{ required: false, message: '请选择设备类型' }] }
    ],
    label: '设备类型',
    placehorder: '请选择设备类型',
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
    title: '枪支类型',
    dataIndex: 'deviceGunType',
    align: 'center',
    customRender: (text, record, index) => {
      const type = getLabel(deviceGunType, text)
      return type
    }
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    align: 'center',
    customRender: (text, record, index) => {
      const type = getLabel(deviceType, text)
      return type
    }
  },
  {
    title: '设备电压',
    dataIndex: 'deviceVoltage',
    align: 'center'
  },
  {
    title: '设备状态',
    dataIndex: 'deviceStatus',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'deviceId',
    align: 'center',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 200
  }
]