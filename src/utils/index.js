import { Modal } from 'ant-design-vue'
export const getLabel = (arr, value) =>  arr.filter(item => item.value === value)[0].label

export const deleteMessage = () => {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      title: '提示',
      content:  (h) => <div style="color:red;">是否删除当前列表信息</div>,
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