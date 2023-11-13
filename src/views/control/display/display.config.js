import { getLabel } from '@/utils'

export const aimCurveShow = [
  {
    value: 0,
    label: '显'
  },
  {
    value: 1,
    label: '隐'
  }
]

export const autoAmplify = [
  {
    value: 0,
    label: '显'
  },
  {
    value: 1,
    label: '隐'
  }
]

export const clearTargetWay = [
  {
    value: 1,
    label: '一组一清'
  },
  {
    value: 2,
    label: '手动清靶'
  }
]
export const sequenceShow = [
  {
    value: 0,
    label: '显'
  },
  {
    value: 1,
    label: '隐'
  }
]

export const stressCurveShow = [
  {
    value: 0,
    label: '显'
  },
  {
    value: 1,
    label: '隐'
  }
]

export const targetShow = [
  {
    value: 0,
    label: '显'
  },
  {
    value: 1,
    label: '隐'
  }
]

export const targetSize = [
  {
    value: 0,
    label: '大'
  },
  {
    value: 1,
    label: '小'
  }
]
export const displayQuery = [
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
    type: "select",
    rules: [
      'aimCurveShow',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '瞄准曲线',
    placehorder: '请选择瞄准曲线',
    data: aimCurveShow
  },
  {
    type: "select",
    rules: [
      'autoAmplify',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '自动放大',
    placehorder: '请选择自动放大',
    data: autoAmplify
  },
  {
    type: "select",
    rules: [
      'clearTargetWay',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '清靶模式',
    placehorder: '请选择清靶模式',
    data: clearTargetWay
  },
  {
    type: "select",
    rules: [
      'sequenceShow',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '发序',
    placehorder: '请选择发序',
    data: sequenceShow
  },
  {
    type: "select",
    rules: [
      'stressCurveShow',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '压力曲线',
    placehorder: '',
    data: stressCurveShow
  },
  {
    type: "select",
    rules: [
      'targetShow',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '靶点显隐',
    placehorder: '',
    data: targetShow
  },
  {
    type: "select",
    rules: [
      'targetSize',
      { rules: [{ required: false, message: '请输入平板名称' }] },
    ],
    label: '靶点大小',
    placehorder: '',
    data: targetSize
  },
]

export const displayTableColumns = [
  {
    title: '平板编号',
    align: 'center',
    dataIndex: "tabletPcNum"
  },
  {
    title: '瞄准曲线',
    align: 'center',
    dataIndex: "aimCurveShow",
    customRender: text => getLabel(aimCurveShow, text)
  },
  {
    title: '自动放大',
    align: 'center',
    dataIndex: "autoAmplify",
    customRender: text => getLabel(autoAmplify, text)
  },
  {
    title: '清靶模式',
    align: 'center',
    dataIndex: "clearTargetWay",
    customRender: text => getLabel(clearTargetWay, text)
  },
  {
    title: '发序',
    align: 'center',
    dataIndex: "sequenceShow",
    customRender: text => getLabel(sequenceShow, text)
  },
  {
    title: '压力曲线',
    align: 'center',
    dataIndex: "stressCurveShow",
    customRender: text => getLabel(stressCurveShow, text)
  },
  {
    title: '靶点显隐',
    align: 'center',
    dataIndex: "targetShow",
    customRender: text => getLabel(targetShow, text)
  },
  {
    title: '靶点大小',
    align: 'center',
    dataIndex: "targetSize",
    customRender: text => getLabel(targetSize, text)
  },
 /*  {
    title: '操作',
    align: 'center',
    dataIndex: 'deviceDisplayId',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 200
  } */
]