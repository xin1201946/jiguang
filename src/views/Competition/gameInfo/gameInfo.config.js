import { status } from '@views/Competition/competitionList/competitionList.config'

export const gameInfoQuery = [
  {
    type: "input",
    label: '选手姓名',
    placeholder: '请输入选手姓名',
    rules: [
      ''
    ],
    span: 4
  },
  {
    type: "input",
    label: '代表队',
    placeholder: '请输入代表队',
    rules: [
      ''
    ],
    // span: 5
  },
  {
    type: "select",
    label: '审核状态',
    placeholder: '请选择审核状态',
    rules: [
      'status'
    ],
    data: status,
    span: 5
  },
]


export const gameInfoColumns = [
  {
    dataIndex: 'serialNumber',
    title: '选手编号',
    align: 'center',
  },
  {
    dataIndex: 'playerName',
    title: '姓名',
    align: 'center',
  },
  {
    dataIndex: 'playerSex',
    customRender: (text, record, index)=>{
      return record.playerSex == '1' ? '男' : '女'
    },
    title: '性别',
    align: 'center',
  },
  {
    dataIndex: 'idCardNum',
    title: '身份证号',
    align: 'center',
  },
  {
    dataIndex: 'groupName',
    title: '团体名称',
    align: 'center',
  },
  {
    dataIndex: 'isGroup',
    title: '是否团体排名',
    align: 'center',
  },
  {
    dataIndex: 'targetSite',
    title: '靶位',
    align: 'center',
  },
  {
    dataIndex: 'totalScore',
    title: '总环数',
    align: 'center',
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'playerId',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 200
  }
]

export const gameInfoModalColumns = [
 /*  {
    title: '环数',
    align: 'center',
  }, */
  {
    title: '组数',
    align: 'center',
  },
  {
    title: '成绩',
    align: 'center',
  },
  {
    title: '发序',
    align: 'center',
  },
]