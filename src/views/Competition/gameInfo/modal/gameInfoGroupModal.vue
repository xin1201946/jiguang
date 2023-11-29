<template>
  <BizModal
    :title="title"
    :visible="visible"
    @cancel="handleCancel"
    :loading="loadingModal"
    :footer="false"
    widths="50%"
  >
    <div class="modal">
      <a-descriptions bordered :columns="4" title="个人信息">
        <a-descriptions-item label="姓名" :span="1">{{formData.playerName}}</a-descriptions-item>
        <a-descriptions-item label="性别" :span="1">{{formData.playerSex == '1' ? '男' : '女'}}</a-descriptions-item>
        <a-descriptions-item label="团体名称" :span="1">{{formData.groupName}}</a-descriptions-item>
        <a-descriptions-item label="靶位" :span="1">{{formData.targetSite}}</a-descriptions-item>
        <a-descriptions-item label="总成绩" :span="1"></a-descriptions-item>
        <a-descriptions-item label="总环数" :span="1"></a-descriptions-item>
<!--        <a-descriptions-item label="组数" :span="1"></a-descriptions-item>-->
      </a-descriptions>
      <h3>每次射击信息</h3>
      <div>
        <a-table
          size="middle"
          :columns="columns"
          :pagination="false"
          bordered
        ></a-table>
      </div>
    </div>
  </BizModal>
</template>

<script>
import { gameInfoModalColumns } from '@views/Competition/gameInfo/gameInfo.config'

import BizModal from '@comp/modal/BizModal.vue'
export default {
  name: 'gameInfoGroupModal',
  components: {
    BizModal
  },
  data() {
    return {
      title: '成绩详情',
      visible: false,
      loadingModal: false,
      type: 0,
      columns: gameInfoModalColumns,
      formData: {}
    }
  },
  methods: {
    edit(record) {
      this.visible = true
      this.type = 1
      this.loadingModal = false
      this.formData = record
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
.modal{
  height: 100%;
  overflow-y: auto;
  h3{
    margin-top: 20px;
    font-weight: 800;
  }
}
</style>