<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
  >
    <a-form-model
      :labelCol="{span: 6}"
      :wrapperCol="{span: 14}"
      :rules="rules"
      ref="form"
      :model="formData"
    >
      <a-form-model-item label="选手编号">
        <a-input></a-input>
      </a-form-model-item>
      <a-form-model-item label="姓名">
        <a-input></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="性别"
        :wrapperCol="{span: 12, offset: 1}"
      >
        <a-radio-group>
          <a-radio>男</a-radio>
          <a-radio>女</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="身份证号">
        <a-input></a-input>
      </a-form-model-item>
      <a-form-model-item label="团队名称">
        <a-input></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="是否团队排名"
        :wrapperCol="{span: 12, offset: 1}"
      >
        <a-radio-group>
          <a-radio>是</a-radio>
          <a-radio>否</a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import BizMixins from '@views/biz/bizMixins'
export default {
  name: 'participantModal',
  components: {
    BizModal
  },
  mixins: [BizMixins],
  data() {
    return {
      title: '编辑',
      visible: false,
      type: 1,
      formData: {

      },
      rules: {

      }
    }
  },
  methods: {
    handleOk() {},
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">

</style>