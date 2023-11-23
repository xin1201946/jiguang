
export const RealTimeViewTreeStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
  width: '100%',
  // 单行打点
  // width: '200px',
  // textOverflow: 'ellipsis',
  // whiteSpace: 'nowrap',
  // overflow: 'hidden'
}

export const RealTimeViewQuery = [
  {
    type: 'search',
    label: '姓名',
    rules: ['a'],
    placeholder: '请输入姓名',
    data: [
      {
        label: "张三",
        value: "张三"
      },
      {
        label: "cs1",
        value: "cs1"
      },
      {
        label: "as1",
        value: "as1"
      },
      {
        label: "李思",
        value: "李思"
      },
      {
        label: "李一",
        value: "李一"
      },
      {
        label: "王五",
        value: "王五"
      },
      {
        label: "赵六",
        value: "赵六"
      },
      {
        label: "七八",
        value: "七八"
      },
      {
        label: "测试",
        value: "测试"
      },
      {
        label: "阿萨德",
        value: "阿萨德"
      },
    ]
  },
  {
    type: 'select',
    label: '阶段名称',
    rules: ['c'],
    placeholder: '请选择阶段名称',
    data: [],
    value: ''
  },
  {
    type: 'input',
    label: '团体名称',
    rules: ['d'],
    placeholder: '请输入团体名称'
  },
]
export const RealTimeViewTableColumns = [
  {
    title: '姓名',
    align: 'center',
    dataIndex: 'name'
  },
  {
    title: '项目',
    align: 'center',
    dataIndex: 'project'
  },
  {
    title: '阶段',
    align: 'center',
    dataIndex: 'stage'
  },
  {
    title: '团体名称',
    align: 'center',
    dataIndex: 'tuan'
  },
  {
    title: '靶位',
    align: 'center',
    dataIndex: 'bawei'
  },
  {
    title: '总成绩',
    align: 'center',
    dataIndex: 'total',
    /* scopedSlots: {
      customRender: 'total'
    }, */
  },
  {
    title: "比赛成绩",
    children: []
  },
  {
    title: "操作",
    align: 'center',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 100
  },
]