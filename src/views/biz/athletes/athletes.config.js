import { getLabel } from '@/utils'
export const sexData = [
  {
    value: '1',
    label: '男'
  },
  {
    value: '2',
    label: '女'
  }
]
export const typeData = [
  {
    value: '0',
    label: '运动员'
  },
  {
    value: '1',
    label: '教练'
  }
]

export const athletesQuery = [
  {
    type: 'input',
    rules: [
      'entryName',
      { rules: [{ required: false, message: '请输入姓名' }] }
    ],
    label: '姓名',
    placeholder: '请输入姓名',
  },
  {
    type: 'select',
    rules: [
      'entrySex',
      { rules: [{ required: false, message: '请选择性别' }] }
    ],
    label: '性别',
    placeholder: '请选择性别',
    data: sexData
  },
  {
    type: 'select',
    rules: [
      'entryType',
      { rules: [{ required: false, message: '请选择类型' }] }
    ],
    label: '类别',
    placeholder: '请选择类别',
    data: typeData
  }
]
export const athletesColumns = [
  {
    title: "姓名",
    dataIndex: 'entryName',
    align: 'center'
  },
  {
    title: "身份证号",
    dataIndex: 'entryIdCardNum',
    align: 'center'
  },
  {
    title: "性别",
    dataIndex: 'entrySex',
    align: 'center',
    customRender: (text, record, index) => {
      const sex = getLabel(sexData, text)
      return sex
    }
  },
  {
    title: "类别",
    dataIndex: 'entryType',
    align: 'center',
    customRender: (text, record, index) => {
      const type = getLabel(typeData, text)
      return type
    }
  },
  {
    title: "单位",
    dataIndex: 'entryCompany',
    align: 'center'
  },
  {
    title: "注册号",
    dataIndex: 'entryNum',
    align: 'center'
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
