<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
  >
    <div style="height: 100%;overflow-y: auto;overflow-x: hidden">
      <a-form-model
        :labelCol="{span: 6}"
        :wrapperCol="{span: 14}"
        :rules="rules"
        ref="form"
        :model="formData"
      >
        <a-form-model-item label="靶机编号">
          <a-input></a-input>
        </a-form-model-item>
        <a-form-model-item label="靶位">
          <a-input></a-input>
        </a-form-model-item>
        <a-form-model-item label="靶机状态">
          <a-input></a-input>
        </a-form-model-item>
      </a-form-model>
    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import bizMixins from '@views/biz/bizMixins'
export default {
  name: 'targetDroneModal',
  components: {
    BizModal
  },
  mixins: [bizMixins],
  data() {
    return {
      title: "",
      visible: false,
      type: 0,
      formData: {

      },
      rules: {

      }
    }
  },
  methods: {
    handleOk() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.type === 0) {

          }
          if (this.type === 1) {

          }
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">

</style>