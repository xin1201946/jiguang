<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    loading="loadingBtn"
  >
    <a-form-model
      :labelCol="{span: 6}"
      :wrapperCol="{span: 14, offset: 2}"
      :rules="rules"
      ref="form"
      :model="formData"
    >

    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import BizMixins from '@views/biz/bizMixins'

export default {
  name: 'processModal',
  components: {
    BizModal
  },
  mixins: [BizMixins],
  data() {
    return {
      title: '',
      type: 0,
      visible: false,
      loadingBtn: false,
      rules: {},
      formData: {}
    }
  },
  methods: {
    handleOk() {},
    handleCancel() {
      this.visible = false
    },
  }
}
</script>


<style scoped lang="scss">

</style>