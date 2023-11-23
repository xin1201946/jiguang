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