<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <a-form-model :labelCol="{span: 6}" :wrapperCol="{span: 14}" :rules="rules" ref="form" :model="formData">
      <a-form-model-item label="选手编号">
        <a-input></a-input>
      </a-form-model-item>
      <a-form-model-item label="选手姓名">
        <a-input></a-input>
      </a-form-model-item>
      <a-form-model-item label="选手性别">
        <a-radio-group>
          <a-radio>男</a-radio>
          <a-radio>女</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="身份证号">
        <a-input></a-input>
      </a-form-model-item>
      <a-form-model-item label="靶位">
        <a-input></a-input>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
export default {
  name: 'gameInfoTargetModal',
  components: {
    BizModal,
  },
  data() {
    return {
      title: '编辑靶位',
      visible: false,
      loadingModal: false,
      type: 0,
      formData: {},
      rules: {
        // RealTimeView
      },
    }
  },
  methods: {
    init() {
      this.visible = true
      this.type = 0
      this.loadingModal = false
      this.$nextTick(() => {
        for (const key in this.formData) {
          if (Array.isArray(this.formData[key])) {
            this.formData[key] = []
          } else {
            this.formData[key] = ''
          }
        }
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    edit(record) {
      this.visible = true
      this.type = 1
      this.loadingModal = false
      this.$nextTick(() => {
        for (const key in this.formData) {
          this.formData[key] = record[key]
        }

        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    handleOk() {},
    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style scoped lang="less">
</style>