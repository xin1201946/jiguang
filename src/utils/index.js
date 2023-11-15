import { Modal } from 'ant-design-vue'
export const getLabel = (arr, value) =>  {
  const a = arr.filter(item => String(item.value) === String(value))
  if (a.length) {
    return a[0].label
  }
  return ""
}

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