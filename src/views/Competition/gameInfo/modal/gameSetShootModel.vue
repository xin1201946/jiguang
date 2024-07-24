<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal" destroyOnClose>
    <a-form-model :labelCol="{span: 6}" :wrapperCol="{span: 14}" :rules="rules" ref="form" :model="formData">
      <a-form-model-item label="发序组数" prop="groupCount">
        <a-input v-model="formData.groupCount" />
      </a-form-model-item>
      <a-form-model-item label="要取消的发序" prop="shootCode">
        <a-input v-model="formData.shootCode" />
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import { selectTargetList } from '@/api/competition'
import BizModal from '@comp/modal/BizModal.vue'
export default {
  name: 'gameInfoTargetModal',
  components: {
    BizModal,
  },
  data() {
    return {
      title: '设置发序',
      visible: false,
      loadingModal: false,
      formData: {},
      rules: {
        groupCount: {
          required: true,
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback('请填写发序组数！')
            }
          },
        },
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
      },
      row: {},
      selectList: [],
    }
  },
  methods: {
    init(row) {
      this.visible = true
      this.loadingModal = false
      this.$nextTick(() => {
        this.formData = { ...row }
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
      this.formData = {}
      console.log(111)
    },
  },
}
</script>

<style scoped lang="less">
</style>