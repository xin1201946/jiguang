import { getLabel } from '@/utils'
export const sexData = [
  /* {
    value: '0',
    label: '未知'
  }, */
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
    label: "甲组男子",
    value: "甲组男子"
  },
  {
    label: "甲组女子",
    value: "甲组女子"
  },
  {
    label: "乙组男子",
    value: "乙组男子"
  },
  {
    label: "乙组女子",
    value: "乙组女子"
  },
  {
    label: "丙组男子",
    value: "丙组男子"
  },
  {
    label: "丙组女子",
    value: "丙组女子"
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
    label: '代表队',
    placeholder: '请输入代表队'
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
    title: "代表队",
    align: 'center',
    dataIndex: 'groupName',
  },
  {
    title: "项目组别",
    align: 'center',
    dataIndex: 'projectGroup',
    // customRender: text => getLabel(projectGroup, text)
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

  },
  {
    title: "身份证号",
    align: 'center',
    dataIndex: 'idCardNum',
  },
  {
    title: "代表队",
    align: 'center',
    dataIndex: 'groupName',
  },
  {
    title: "项目名称",
    dataIndex: 'projectNames',
    align: 'center',
    width: '160px',
    customRender: (text, row) => {
      if (!row.projectNames) {
        return `${row.project1 ? row.project1 : ''} ${row.project2 ? row.project2 : ''}`
      } else {
        return row.projectNames
      }
      // return `${row.project1 ? row.project1 : ''}  ${row.project2?row.project2:''} ${row.projectNames?row.projectNames:''}`
    }
  },
  {
    title: "项目组别",
    align: 'center',
    dataIndex: 'projectGroup',
    // customRender: text => getLabel(projectGroup, text)
  },
  {
    title: "操作",
    align: 'center',
    scopedSlots: {
      customRender: 'operation'
    },
    fixed: 'right',
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
    title: "代表队",
    align: 'center',
    dataIndex: 'groupName',
  },
  {
    title: "项目名称",
    dataIndex: 'projectNames',
    align: 'center',
    width: '160px',
    customRender: (text, row) => {
      if (!row.projectNames) {
        return `${row.project1 ? row.project1 : ''} ${row.project2 ? row.project2 : ''}`
      } else {
        return row.projectNames
      }
      // return `${row.project1 ? row.project1 : ''} ${row.project2 ? row.project2 : ''} ${row.projectNames ? row.projectNames : ''}`
    }
  },
  {
    title: "项目组别",
    align: 'center',
    dataIndex: 'projectGroup',
    // customRender: text => getLabel(projectGroup, text)
  },
]