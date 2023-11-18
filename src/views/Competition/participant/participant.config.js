import { getLabel } from '@/utils'

export const participantQuery = [
  {
    type: 'input',
    rules: [
      '',
    ],
    label: '选手姓名',
    placehorder: ''
  },
  {
    type: 'input',
    rules: [
      '',
    ],
    label: '代表队',
    placehorder: ''
  },
  {
    type: 'select',
    rules: [
      '',
    ],
    label: '审核状态',
    placehorder: '',
    data: []
  }
]

export const participantTableColumns = [
  {
    title: "选手编号",
    align: 'center',
  },
  {
    title: "姓名",
    align: 'center',
  },
  {
    title: "性别",
    align: 'center',
  },
  {
    title: "身份证号",
    align: 'center',
  },
  {
    title: "团体名称",
    align: 'center',
  },
  {
    title: "是否团体排名",
    align: 'center',
  //   customRender: (text) =>
  },
  {
    title: "操作",
    align: 'center',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 200
  },
]

export const participantModalUserTableColumns = [
  {
    title: "姓名",
     align: 'center',
  },
  {
    title: "性别",
     align: 'center',
  },
  {
    title: "身份证",
     align: 'center',
  },
  {
    title: "团体名称",
     align: 'center',
  },
  {
    title: "是否团体排名",
    align: 'center',
    //   customRender: (text) =>
  },
]