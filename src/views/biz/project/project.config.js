
export const projectQuery = [
  {
    type: 'input',
    rules: [
      "projectName",
      { rules: [{ required: false, message: '请输入项目名称' }] }
    ],
    label: '项目名称',
    placeholder: '请输入项目名称',
  },
  {
    type: 'number',
    rules: [
      "groupCount",
      { rules: [{ required: false, message: '请输入组数' }] }
    ],
    label: '组数',
    placeholder: '请输入组数',
  },
  {
    type: 'number',
    rules: [
      "ammo",
      { rules: [{ required: false, message: '请输入组数' }] }
    ],
    label: '弹药数量',
    placeholder: '请输入弹药数量',
  },
]
export const projectColumns = [
  {
    title: "项目名称",
    align: 'center',
    dataIndex: 'projectName'
  },
  // {
  //   title: "平板编号",
  //   align: 'center',
  //   // dataIndex: 'groupCount'
  // },
  {
    title: "组数",
    align: 'center',
    dataIndex: 'groupCount'
  },
  {
    title: "弹药数量",
    align: 'center',
    dataIndex: 'ammo'
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