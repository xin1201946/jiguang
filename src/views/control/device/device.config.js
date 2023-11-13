import { getLabel } from '@/utils'
// 报靶控制
export const indicateTargetControl = [
  {
    value: 0,
    label: '开'
  },
  {
    value: 1,
    label: '关'
  },
]
// 击发控制
export const shootControl = [
  {
    value: 0,
    label: '正常射击'
  },
  {
    value: 1,
    label: '轨迹扫描'
  },
]
// 音效控制
export const soundControl = [
  {
    value: 0,
    label: '开'
  },
  {
    value: 1,
    label: '关'
  },
]
// 靶机倾角采集
export const targetCollect = [
  {
    value: 0,
    label: '开'
  },
  {
    value: 1,
    label: '关'
  },
]
// 扳机预压采集
export const triggerCollect = [
  {
    value: 0,
    label: '开'
  },
  {
    value: 1,
    label: '关'
  },
]

export const deviceQuery = [
  {
    type: "input",
    rules: [
      'tabletPcNum',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '编号',
    placehorder: '请输入平板编号'
  },
  {
    type: 'select',
    rules: [
      'indicateTargetControl',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    data: indicateTargetControl,
    label: '报靶控制',
    placehorder: '请选择报靶控制'
  },
  {
    type: 'select',
    rules: [
      'shootControl',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    data: shootControl,
    label: '击发控制',
    placehorder: '请选择击发控制'
  },
  {
    type: 'select',
    rules: [
      'soundControl',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    data: soundControl,
    label: '音效控制',
    placehorder: '请选择音效控制'
  },
  {
    type: 'select',
    rules: [
      'targetCollect',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    data: targetCollect,
    label: '靶机倾角采集',
    placehorder: '请选择靶机倾角采集',
    span: 4
  },
  {
    type: 'select',
    rules: [
      'triggerCollect',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    data: triggerCollect,
    label: '扳机预压采集',
    placehorder: '请选择扳机预压采集',
    span: 4
  }
]
export const deviceTableColumns = [
  {
    title: '平板编号',
    align: 'center',
    dataIndex: "tabletPcNum"
  },
  {
    title: '报靶控制',
    align: 'center',
    dataIndex: "indicateTargetControl",
    customRender: (text) => getLabel(indicateTargetControl, text)
  },
  {
    title: '击发控制',
    align: 'center',
    dataIndex: "shootControl",
    customRender: (text) => getLabel(shootControl, text)
  },
  {
    title: '音效控制',
    align: 'center',
    dataIndex: "soundControl",
    customRender: (text) => getLabel(soundControl, text)
  },
  {
    title: '靶机倾角采集',
    align: 'center',
    dataIndex: "targetCollect",
    customRender: (text) => getLabel(targetCollect, text)
  },
  {
    title: '扳机预压采集',
    align: 'center',
    dataIndex: "triggerCollect",
    customRender: (text) => getLabel(triggerCollect, text)
  },
  /* {
    title: '操作',
    align: 'center',
    dataIndex: 'deviceControlId',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 200
  } */
]