<template>
  <BizModal
    title="查看详情"
    :visible="visible"
    @cancel="visible = false"
  >
    <div>
      <a-descriptions>
        <a-descriptions-item span="1" label="项目名称"></a-descriptions-item>
        <a-descriptions-item span="1" label="选手名称"></a-descriptions-item>
        <a-descriptions-item span="1" label="射击状态"></a-descriptions-item>
        <a-descriptions-item span="1" label="组数"></a-descriptions-item>
        <a-descriptions-item span="1" label="总组数"></a-descriptions-item>
        <a-descriptions-item span="1" label="总环数"></a-descriptions-item>
      </a-descriptions>
    </div>
    <div>
      <a-table bordered :columns="columns"></a-table>
    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
export default {
  name: 'targetMapModal',
  components: {
    BizModal
  },
  data() {
    return {
      visible: false,
      columns: [
        {
          title: "No",
          align: 'center',
          className: 'tableHeaders',
          width: 80
        },
        {
          title: "整环",
          align: 'center',
          className: 'tableHeaders'
        },
        {
          title: "小数环",
          align: 'center',
          className: 'tableHeaders'
        }
      ]
    }
  },
  methods: {
    init(data) {
      this.visible = true
      console.log(data)
    }
  }
}
</script>

<style scoped lang="less">
/deep/.tableHeaders{
  background: #888888 !important;
  color: #fff !important;
}
/deep/.ant-table-body{
  margin: 0 !important;
}
</style>