import { getLabel } from '@/utils'
export const sexData = [
  {
    value: '0',
    label: '未知'
  },
  {
    value: '1',
    label: '男'
  },
  {
    value: '2',
    label: '女'
  }
]

const projectGroup = [
  {
    label: "甲组",
    value: "甲组"
  },
  {
    label: "乙组",
    value: "乙组"
  },
  {
    label: "丙组",
    value: "丙组"
  }
]
export const participantQuery = [
  {
    type: 'input',
    rules: [
      'playerSex',
    ],
    label: '姓名',
    placehorder: ''
  },
  {
    type: 'input',
    rules: [
      'groupName',
    ],
    label: '团体名称',
    placehorder: ''
  },
  {
    type: 'select',
    rules: [
      'projectGroup',
    ],
    label: '项目组别',
    placehorder: '',
    data: projectGroup
  }
]

export const participantTableColumns = [
  {
    title: "选手编号",
    dataIndex: 'serialNumber',
    align: 'center',
  },
  {
    title: "姓名",
    dataIndex: 'playerName',
    align: 'center',
  },
  {
    title: "性别",
    align: 'center',
    dataIndex: 'playerSex',
    customRender: text => {

      return getLabel(sexData, text)
    }
  },
  {
    title: "身份证号",
    align: 'center',
    dataIndex: 'idCardNum',
  },
  {
    title: "团体名称",
    align: 'center',
    dataIndex: 'groupName',
  },
  {
    title: "项目组别",
    align: 'center',
    dataIndex: 'projectGroup',
    customRender: text => getLabel(projectGroup, text)
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