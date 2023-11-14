<template>
  <BizModal
    :title="title"
    :visible="visible"
    :loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model></a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
export default {
  name: 'projectPhaseStageTableModal',
  components: {
    BizModal
  },
  data() {
    return {
      title: "",
      visible: false,
      loading: false,
      type: 0,
      cproId: ""
    }
  },
  methods: {
    handleOk() {

    },
    handleCancel() {

    },
    init(id) {
      this.cproId = id
      this.type = 0
      this.loading = false
      this.title = "添加"
      this.visible = true
    },
    edit(id) {
      this.cproId = id
      this.type = 1
      this.title = "编辑"
      this.loading = false
      this.visible = true
    }
  }
}
</script>

<style scoped lang="less">

</style>