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
    rules: ['cproStageId'],
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
    dataIndex: 'playerName',
    width: 100
  },
  {
    title: '项目',
    align: 'center',
    dataIndex: 'projectName',
    width: 200
  },
  {
    title: '阶段',
    align: 'center',
    dataIndex: 'stageName',
    width: 150
  },
  {
    title: '团体名称',
    align: 'center',
    dataIndex: 'groupName',
    width: 150
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
    width: 100
    // customRender: text => getLabel(stageStatus, text)
  },
  {
    title: '项目组别',
    align: 'center',
    dataIndex: 'projectGroup',
    width: 150
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
    },
    width: 100
    /* scopedSlots: {
      customRender: 'total'
    }, */
  },
  {
    title: "比赛成绩",
    children: [],
    width: 600
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


export const RealTimeViewTableColumnsPrint = [
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
  // {
  //   title: '阶段',
  //   align: 'center',
  //   dataIndex: 'stageName'
  // },
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
  // {
  //   title: '阶段组别',
  //   align: 'center',
  //   dataIndex: 'stageGroup',
  //   // customRender: text => getLabel(stageStatus, text)
  // },
  {
    title: '项目组别',
    align: 'center',
    dataIndex: 'projectGroup',
    // customRender: text => getLabel(stageStatus, text)
  },
  /* {
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
    /!* scopedSlots: {
      customRender: 'total'
    }, *!/
  }, */
  // {
  //   title: "比赛成绩",
  //   children: []
  // },
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

export const RealTimeViewQueryPrint = [
  {
    type: 'search',
    label: '姓名',
    rules: ['playerName'],
    placeholder: '请输入姓名',
    data: []
  },
 /*  {
    type: 'select',
    label: '阶段名称',
    rules: ['cproStageId'],
    placeholder: '请选择阶段名称',
    data: [],
    value: '',
    span: 5
  }, */
  {
    type: 'input',
    label: '团体名称',
    rules: ['groupName'],
    placeholder: '请输入团体名称',
    span: 5
  },
]


export function autoPaginate(el) {
  var printContent = document.getElementById(el);
  var children = printContent.childNodes;
  var i = 0, len = children.length;
  var pageCount = 1;
  var wrapper;

  for (; i < len; i++) {
    if (isElement(children[i])) {
      // 如果元素相对于视窗的距离加上元素的自身高度大于
      // 视窗的高度，则新建一个wrapper并插入分页符。
      if (children[i].offsetTop + children[i].offsetHeight > pageCount * window.innerHeight) {
        wrapper = document.createElement("div");
        wrapper.className = "print-page";
        printContent.insertBefore(wrapper, children[i]);
        pageCount++;
      }
      wrapper.appendChild(children[i].cloneNode(true));
    }
  }
}

function isElement(obj) {
  return obj.nodeType === 1;
}


export const massingColumns = [
  {
    title: '代表队',
    align: 'center',
    dataIndex: 'groupName'
  },
  {
    title: '姓名',
    align: 'center',
    dataIndex: 'playerName',
    scopedSlots: {
      customRender: 'playerName'
    },
  },
  {
    title: '发序',
    align: 'center',
    dataIndex: 'shootCode'
  },
  {
    title: '环数',
    align: 'center',
    dataIndex: 'playerScore',
    scopedSlots: {
      customRender: 'playerScore'
    },
  },
  {
    title: '总环数',
    align: 'center',
    dataIndex: 'stageTotal'
  },
  {
    title: '总分',
    align: 'center',
    dataIndex: 'total'
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: {
      customRender: 'info'
    },
    fixed: 'right',
    width: 200
  }
  // {
  //   title: '目标分',
  //   align: 'center',
  //   dataIndex: ''
  // }
]