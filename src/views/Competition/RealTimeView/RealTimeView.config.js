import { getLabel } from '@/utils'

export const stageStatus = [
  {
    label: '未开始',
    value: '0'
  },
  {
    label: '等待中',
    value: '1'
  },
  {
    label: '准备中',
    value: '2'
  },
  {
    label: '试射中',
    value: '3'
  },
  {
    label: '比赛中',
    value: '4'
  },
  {
    label: '成绩显示',
    value: '5'
  },
  {
    label: '已结束',
    value: '6'
  },
]
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
    rules: ['playerName'],
    placeholder: '请输入姓名',
    data: []
  },
  {
    type: 'select',
    label: '阶段名称',
    rules: ['stageName'],
    placeholder: '请选择阶段名称',
    data: [],
    value: '',
    span: 5
  },
  {
    type: 'input',
    label: '团体名称',
    rules: ['groupName'],
    placeholder: '请输入团体名称',
    span: 5
  },
]
export const RealTimeViewTableColumns = [
  {
    title: '姓名',
    align: 'center',
    dataIndex: 'playerName'
  },
  {
    title: '项目',
    align: 'center',
    dataIndex: 'projectName'
  },
  {
    title: '阶段',
    align: 'center',
    dataIndex: 'stageName'
  },
  {
    title: '团体名称',
    align: 'center',
    dataIndex: 'groupName'
  },
 /*  {
    title: '阶段状态',
    align: 'center',
    dataIndex: 'stageStatus',
    customRender: text => getLabel(stageStatus, text)
  }, */
  {
    title: '阶段组别',
    align: 'center',
    dataIndex: 'stageGroup',
    // customRender: text => getLabel(stageStatus, text)
  },
  {
    title: '项目组别',
    align: 'center',
    dataIndex: 'projectGroup',
    // customRender: text => getLabel(stageStatus, text)
  },
  {
    title: '总成绩',
    align: 'center',
    dataIndex: 'stageTotal',
    customRender: (text, record) => {
      if (record.integrationMethod === 2 || record.integrationMethod === '2') {
        // console.log(record)
        return text + '_x' + record.goodTotal
      }
      return text
    }
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
    flex: 'right',
    width: 100
  },
]