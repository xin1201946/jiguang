<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <a-form-model :labelCol="{span: 6}" :wrapperCol="{span: 14}" :rules="rules" ref="form" :model="formData">
      <a-form-model-item label="发序">
        <a-input v-model="formData.shootCode" />
      </a-form-model-item>
      <a-form-model-item label="分数">
        <a-input v-model="formData.score" />
      </a-form-model-item>
      <a-form-model-item label="备注">
        <a-input v-model="formData.remarkPenalty" />
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
      title: '判罚',
      visible: false,
      loadingModal: false,
      formData: {},
      rules: {
        // RealTimeView
      },
      row: {},
    }
  },
  methods: {
    init(row) {
      this.visible = true
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
      this.row = row
    },
    handleOk() {
      this.$emit('confirm', { ...this.formData, ...this.row })
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style scoped lang="less">
</style>