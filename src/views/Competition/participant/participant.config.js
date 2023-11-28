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

export const projectGroup = [
  {
    label: "男子甲组",
    value: "男子甲组"
  },
  {
    label: "女子甲组",
    value: "女子甲组"
  },
  {
    label: "男子乙组",
    value: "男子乙组"
  },
  {
    label: "女子乙组",
    value: "女子乙组"
  },
  {
    label: "男子丙组",
    value: "男子丙组"
  },
  {
    label: "女子组",
    value: "女子组"
  },
]
export const participantQuery = [
  {
    type: 'input',
    rules: [
      'playerName',
    ],
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    type: 'input',
    rules: [
      'groupName',
    ],
    label: '团体名称',
    placeholder: '请输入团体名称'
  },
  {
    type: 'select',
    rules: [
      'projectGroup',
    ],
    label: '项目组别',
    placeholder: '请选择项目组别',
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

export const participantTableColumnsAll = [
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
    title: "项目名称",
    dataIndex: 'projectNames',
    align: 'center',
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
    title: "项目名称",
    dataIndex: 'projectNames',
    align: 'center',
  },
  {
    title: "项目组别",
    align: 'center',
    dataIndex: 'projectGroup',
    customRender: text => getLabel(projectGroup, text)
  },
]