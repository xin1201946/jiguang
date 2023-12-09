import { Modal } from 'ant-design-vue'

// 获取label
export const getLabel = (arr, value) =>  {
  const a = arr.filter(item => String(item.value) === String(value))
  if (a.length) {
    return a[0].label
  }
  return ""
}

// 删除提示
export const deleteMessage = (text) => {

  return new Promise((resolve, reject) => {
    Modal.confirm({
      title: '提示',
      content:  (h) => <div style="color:red;">{text || '是否删除当前列表信息'}</div>,
      okType: 'danger',
      onOk() {
        resolve()
      },
      onCancel() {
        reject()
      }
    })
  })
}

// 警告提示
export const infoMessage = text => {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      title: "提示",
      content: h => <div>{text}</div>,
      okType: "primary",
      onOk() {
        resolve()
      },
      onCancel() {
        reject()
      }
    })
  })
}

/**
 * @function numToCapital 阿拉伯数字转换为中文大写汉字
 * @param {string | number} num
 * @param {0 | 1} type
 * @return {string}
 */
export const numToCapital = (num, type = 0) => {
  if (typeof num === 'number' || typeof num === 'string') {
    let numString = num.toString()
    // 判断是否有值
    if (numString.length) {
      // 去掉逗号
      const strNum = Number((num + '').replace(/[,，]*/g, '')) + ''
      // 单位
      let capitalAr = '零一二三四五六七八九十'
      let unitAr = ['十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千']
      if (type === 1) {
        capitalAr = '零壹贰叁肆伍陆柒捌玖拾'
        unitAr = ['拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟'] // 单位
      }
      // 转换为整数
      const numNumber = parseInt(strNum)
      let index = strNum.length - 1 //记录位数
      let idx = 0 // 记录单位
      let percent = 10
      const arr = []
      const turnNum = (num, percent, index) => {
        const unit = num / percent
        const capital = capitalAr[Number(strNum[index])]
        if (unit < 1) {
          arr.push(capital)
          // 出现11【一十一】这种情况
          if (
            Number(strNum[index]) === 1 &&
            (strNum.length === 2 || strNum.length === 6 || strNum.length === 10)
          ) {
            arr.pop()
          }
          // 结束递归
          return false
        }else{
          if (capital === '零') {
            // 万和亿单位不删除
            if (!['万', '亿'].includes(arr[arr.length - 1])) {
              arr.pop()
            }
            // 前面有零在删掉一个零
            if (arr[arr.length - 1] === '零') {
              arr.pop()
            }
          }
          arr.push(capital)
          // 过滤存在【零万】【零亿】这种情况
          if (['万', '亿'].includes(arr[arr.length - 2]) && capital === '零') {
            arr.pop()
          }
          // 过滤【1亿万】这种情况
          if (arr[0] === '万' && arr[1] === '亿') {
            arr.shift()
          }
          // 末尾【零】删掉
          if (arr[0] === '零') {
            arr.pop()
          }
          arr.push(unitAr[idx++])
          turnNum(num, percent * 10, --index)
        }
      }
      turnNum(numNumber, percent, index)
      return arr.reverse().join('')
    }
  }
  return ''
}

/**
 * @const radioStyle 左侧树样式
 */
export const radioStyle = {
  width: '100px',
  display: 'block',
  height: '30px',
  lineHeight: '30px'
}

/**
 * @function sorderFun 排序方法
 * @param {string[]} arrOrder 要排序的数组
 * @param {string[]} arr 原数组
 * @return {*[]}
 */
export function sorderFun (arrOrder, arr) {
  const array = []
  for (const item of arrOrder) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].includes(item)) {
        array.push({
          key: i,
          value: arr[i],
          order: item
        })
      }
    }
  }
  return array
}

//
export const getItem = (arr, key, value, children) => {
  for (const item of arr) {
    if (item[key] === value){
      return item
    }
    if (children) {
      if (Array.isArray(item[children]) && item[children].length){
        const i = getItem(item[children], key, value, children)
        if (i) {
          return i
        }
      }
    }
  }
}
const $ = (date) => {
  const $Y = date.getFullYear()
  const $M = date.getMonth()
  const $D = date.getDate()
  const $W = date.getDay()
  const $H = date.getHours()
  const $m = date.getMinutes()
  const $s = date.getSeconds()
  const $ms = date.getMilliseconds()
  return {
    $Y,
    $M,
    $D,
    $W,
    $H,
    $m,
    $s,
    $ms
  }
}
export const Time = (date, type = 'YYYY-MM-DD') => {
  const time = new Date(date)
  const { $Y, $M, $D, $W, $H, $m, $s, $ms } = $(time)
  // type占位符存储
  const matches = {
    // 年 后两位
    YY: String($Y).slice(-2),
    //  年
    YYYY: String($Y),
    // 月
    M: String($M + 1),
    // 月补0
    MM: String($M + 1).padStart(2, '0'),
    // 日
    D: String($D),
    // 日补0
    DD: String($D).padStart(2, '0'),
    // 1
    d: String($W),
    // 周一
    dd: String(numToCapital($W)).padStart(2 , '周'),
    // 星期一
    ddd: String(numToCapital($W)).padStart(3 , '星期'),
    // 24小时
    H: String($H),
    HH: String($H).padStart(2, '0'),
    // 12小时
    h: String($H % 12),
    hh: String($H % 12).padStart(2, '0'),
    // 分
    m: String($m),
    mm: String($m).padStart(2, '0'),
    // 秒
    s: String($s),
    ss: String($s).padStart(2, '0'),
    // 毫秒
    sss: String($ms).padStart(3, '0')
  }
  return type.replace(/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, (match, i) => {
    return i || matches[match]
  })
}
