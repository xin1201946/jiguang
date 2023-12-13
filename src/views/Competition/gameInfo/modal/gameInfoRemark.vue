<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <a-form-model :labelCol="{ span: 6 }" :wrapperCol="{ span: 14 }" :rules="rules" ref="form" :model="formData">
      <a-form-model-item label="比赛状态">
        <a-radio-group v-model="formData.status">
          <a-radio value="DNF">未完成比赛</a-radio>
          <a-radio value="DNS">未参加比赛</a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
export default {
  name: 'gameInfoDrawModal',
  components: {
    BizModal,
  },
  data() {
    return {
      title: '备注',
      visible: false,
      loadingModal: false,
      formData: {},
      rules: {
        score: {
          validator: (rule, value, callback) => {
            if (value < 0) {
              callback('分数不得小于0！')
            } else if (value > 10.9) {
              callback('分数不得大于10.9！')
            } else {
              callback()
            }
          },
        },
      },
    }
  },
  methods: {
    handleOk() {
      this.$refs.form.validate((data) => {
        if (data) {
          this.$emit('ok', this.formData)
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    init(row) {
      this.visible = true
      this.formData = { ...row }
    },
  },
}
</script>

<style scoped lang="less">
</style>