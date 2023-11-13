<template>
  <BizModal
    title="项目控制"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  ></BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
export default {
  name: 'ProjectModal',
  components: {
    BizModal
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    init() {
      this.visible = true
    },
    handleOk() {

    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">

</style>