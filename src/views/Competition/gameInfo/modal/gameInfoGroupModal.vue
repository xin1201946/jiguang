<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
  >

  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
export default {
  name: 'gameInfoGroupModal',
  components: {
    BizModal
  },
  data() {
    return {
      title: '分组',
      visible: false,
      loadingModal: false,
      type: 0,
    }
  },
  methods: {
    init() {
      this.visible = true
      this.type = 0
      this.loadingModal = false
    },
    edit() {
      this.visible = true
      this.type = 1
      this.loadingModal = false
    },
    handleOk() {
      this.visible = false
      this.$emit('list')
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">

</style>