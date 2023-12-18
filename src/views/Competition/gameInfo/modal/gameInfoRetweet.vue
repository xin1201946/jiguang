<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <a-form-model :labelCol="{span: 6}" :wrapperCol="{span: 14}" :rules="rules" ref="form" :model="formData">
      <a-form-model-item label="原靶位" prop="targetSite">
        <a-input v-model="formData.targetSite" disabled/>
      </a-form-model-item>
      <a-form-model-item label="新靶位" prop="score">
        <a-input v-model="formData.score" />
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
        shootCode: {
          required: true,
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback('请填写发序！')
            }
          },
        },
        score: {
          required: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback('请填写分数！')
            } else if (value < 0) {
              callback('分数不得小于0！')
            }
            if (value > 10.9) {
              callback('分数不得大于10.9！')
            } else {
              callback()
            }
          },
        },
        remarkPenalty: {
          required: true,
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback('请填写备注！')
            }
          },
        },
      },
      row: {},
    }
  },
  methods: {
    init(row) {
      this.visible = true
      this.loadingModal = false
      this.$nextTick(() => {
        this.formData = row
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    handleOk() {
      this.$emit('confirm', { ...this.formData })
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style scoped lang="less">
</style>