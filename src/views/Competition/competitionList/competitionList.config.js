import { getLabel } from '@/utils'

export const status = [
  {
    label: "草稿中",
    value: "0"
  },
  {
    label: "待审核",
    value: "1"
  },
  {
    label: "审核通过",
    value: "2"
  },
  {
    label: "进行中",
    value: "3"
  },
  {
    label: "已结束",
    value: "4"
  },
]
export const playerType = [
  {
    label: "业余",
    value: "0"
  },
  {
    label: "专业",
    value: "1"
  },
]
export const competitionListQuery = [
  {
    type: "input",
    label: "赛事名称",
    placeholder: "请输入赛事名称",
    rules: [
      "name",
      {}
    ]
  },
  {
    type: "input",
    label: "赛事类型",
    placeholder: "请输入赛事名词",
    rules: [
      "conType",
      {}
    ]
  },
  {
    type: "select",
    label: "当前状态",
    placeholder: "请输入赛事名词",
    rules: [
      "status",
      {}
    ],
    data: status
  }
]

export const competitionListTableColumns = [
  {
    title: "赛事名称",
    dataIndex: "contestName",
    align: 'center'
  },
  {
    title: "赛事类型",
    dataIndex: "contestType",
    align: 'center'
  },
  {
    title: "选手类型",
    dataIndex: "playerType",
    align: 'center',
    customRender: text => getLabel(playerType, text)
  },
  {
    title: "报名时间",
    dataIndex: "registTime",
    align: 'center',
    customRender: (text, record) => {
      return `${record.registTimeStart} - ${record.registTimeEnd}`
    }
  },
  {
    title: "比赛时间",
    dataIndex: "contestTime",
    align: 'center',
    customRender: (text, record) => {
      return `${record.contestTimeStart} - ${record.contestTimeEnd}`
    }
  },
  {
    title: "主办方",
    dataIndex: "sponsor",
    align: 'center'
  },
  {
    title: "比赛地点",
    dataIndex: "location",
    align: 'center'
  },
  {
    title: "当前状态",
    dataIndex: "contestStatus",
    align: 'center',
    customRender: text => getLabel(status, text)
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'contestId',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 400,
    fixed: 'right'
  }
]