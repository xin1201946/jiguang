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
    customRender: (text, record, index) => {
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
    width: 220,
    fixed: 'right',
  }
]
const renderContent = (value, row, index) => {
  console.log(value, row, index, this)
  return
  // 循环
  for (var i = 0; i < data.length; i++) {
    // 循环的第一行默认角标给个0，合并数给个1，因为rowspan和colspan需要默认是1，如果是0的话就不显示这个单元格了
    if (i === 0) {
      this.spanArr.push(1)
      this.pos = 0
    } else {
      //这里已经循环到第二行了才会走这里
      // 判断当前行的某一个字段和上一行的某一个字段是否相同？
      if (data[i].number === data[i - 1].number) {
        //如果相同代表要合并，就给上一个元素合并数+1。
        this.spanArr[this.pos] += 1 //这里pos是0。所以是给spanArr内第一条数据的合并数加了1，变成了2，代表从第一行开始合并1格，记住，1是默认有一格，没加1代表合并一格
        this.spanArr.push(0) //然后再往spanArr内添加一个0。为什么要这么做呢，因为这里push进去0是加在第二个数据上的。合并的方法内写法是，1代表有数据，每加1代表合并一格，如果是0代表隐藏这一格，上面我们已经变成2了，所以合并一格，合并的就是第二格的数据，如果我们不给第二格的数据改为0.那么第二格的数据会显示，但是被挤在边上，所以这里给0让第二格数据隐藏
      } else {
        this.spanArr.push(1) //反之，如果不等于那就正常给个1显示数据但是不合并。
        this.pos = i //pos的角标也改为当前的循环。方便下一次循环的时候如果两个字段相同，合并数直接从下一个角标算起
      }
    }
  }
}
export const gameInfoModalColumns = [
  /*  {
     title: '环数',
     align: 'center',
   }, */
  {
    dataIndex: 'groupCount',
    title: '组数',
    align: 'center',
    customRender: renderContent,
  },
  {
    dataIndex: 'shootCode',
    title: '发序',
    align: 'center',
  },
  {
    dataIndex: 'score',
    title: '成绩',
    align: 'center',
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: {
      customRender: 'operation'
    },
  }
]