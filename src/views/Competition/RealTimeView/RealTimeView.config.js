
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
    data: []
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