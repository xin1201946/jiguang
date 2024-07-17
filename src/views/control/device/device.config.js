import { getLabel } from '@/utils'
import { tabletPcModel, tabletPcStatus } from '@views/biz/slab/slab.config'
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

  /*    {
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
   } */
  {
    type: "input",
    rules: [
      'tabletPcNum',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '平板编号',
    placeholder: '请输入平板编号'
  },
  {
    type: "input",
    rules: [
      'tabletPcName',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '平板名称',
    placeholder: '请输入平板名称'
  },
  {
    type: 'select',
    rules: [
      'tabletPcStatus',
      { rules: [{ required: false, message: '请选择当前模式' }] },
    ],
    label: '平板状态',
    placeholder: '请选择平板状态',
    data: tabletPcStatus,
  },
  {
    type: 'select',
    rules: [
      'tabletPcModel',
      { rules: [{ required: false, message: '请选择当前模式' }] },
    ],
    label: '当前模式',
    placeholder: '请选择当前模式',
    data: tabletPcModel,
  }
]
export const deviceTableColumns = [
  {
    title: '平板编号',
    align: 'center',
    dataIndex: "tabletPcNum"
  },
  {
    title: '平板名称',
    dataIndex: 'tabletPcName',
    align: 'center'
  },
  {
    title: '激光训练器编号',
    dataIndex: 'deviceNum0',
    align: 'center'
  },
  {
    title: '激光接收靶编号',
    dataIndex: 'deviceNum1',
    align: 'center'
  },
  {
    title: '平板状态',
    dataIndex: 'tabletPcStatus',
    align: 'center',
    customRender: (text) => getLabel(tabletPcStatus, text)
  },
  {
    title: '当前模式',
    dataIndex: 'tabletPcModel',
    align: 'center',
    customRender: (text) => getLabel(tabletPcModel, text)
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'tabletPcId',
    scopedSlots: {
      customRender: 'operation'
    },
    fixed: 'right',
    width: 200
  }
]

export const clearTargetMode = [
  {
    value: '0',
    label: '不清理'
  },
  {
    value: '1',
    label: '自动'
  },
  {
    value: '2',
    label: '手动'
  },
]

export const isAutoBlowUp = [
  {
    value: '0',
    label: '非自动放大'
  },
  {
    value: '1',
    label: '自动放大'
  },
]

export const isShowAimTrack = [
  {
    value: '0',
    label: '隐藏'
  },
  {
    value: '1',
    label: '显示'
  },
]

export const isShowFastCtrl = [
  {
    value: '0',
    label: '不显示'
  },
  {
    value: '1',
    label: '显示'
  },
]

export const isShowHistoryTargetSpot = [
  {
    value: '0',
    label: '正常显示'
  },
  {
    value: '1',
    label: '只显示最新靶点'
  },
]

export const isShowTargetSerial = [
  {
    value: '0',
    label: '不显示发序'
  },
  {
    value: '1',
    label: '显示发序'
  },
]

export const targetSpotSize = [
  {
    value: '0',
    label: '大'
  },
  {
    value: '1',
    label: '小'
  },
  {
    value: '2',
    label: '混合'
  },
]
