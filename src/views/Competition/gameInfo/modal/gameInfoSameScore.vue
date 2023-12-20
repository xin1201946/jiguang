<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <a-form-model :labelCol="{span: 6}" :wrapperCol="{span: 14}" :rules="rules" ref="form" :model="formData">
      <a-form-model-item label="同分选手">
        <template v-for="(item,index) in data">
          <span :key="item.playerId">{{item.playerName}}<span v-if="data.length - 1 != index">,</span></span>
        </template>
      </a-form-model-item>
      <a-form-model-item label="当前发序">
        <a-select style="width: 100%" v-model="formData.sameShootCode">
          <a-select-option :value="12">12</a-select-option>
          <a-select-option :value="14">14</a-select-option>
          <a-select-option :value="16">16</a-select-option>
          <a-select-option :value="18">18</a-select-option>
          <a-select-option :value="20">20</a-select-option>
          <a-select-option :value="22">22</a-select-option>
          <a-select-option :value="24">24</a-select-option>
        </a-select>
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
      title: '同分',
      visible: false,
      loadingModal: false,
      type: 0,
      formData: {},
      rules: {
        // RealTimeView
      },
      data: [],
    }
  },
  methods: {
    init(row) {
      this.visible = true
      this.type = 0
      this.loadingModal = false
      this.$nextTick(() => {
        console.log(row)
        this.data = row
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    handleOk() {
      this.formData['playerIds'] = this.data.map(item => item.playerId)
      this.$emit('ok', this.formData)
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style scoped lang="less">
</style>