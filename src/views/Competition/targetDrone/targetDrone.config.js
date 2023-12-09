export const targetDroneQuery = [
  {
    type: "input",
    rules: [
      'b',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '靶机编号',
    placeholder: '请输入平板名称'
  },
  {
    type: "input",
    rules: [
      'a',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '靶位',
    placeholder: '请输入平板名称'
  },

]
export const targetDroneColumns = [
  {
    title: '靶机编号',
    align: 'center',
  },
  {
    title: '靶位',
    align: 'center',
  },
  {
    title: '靶机状态',
    align: 'center',
  },
  {
    title: '操作',
    align: 'center',
  }
]