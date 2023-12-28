<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <a-form-model :labelCol="{span: 6}" :wrapperCol="{span: 14}" :rules="rules" ref="form" :model="formData">
      <a-form-model-item label="切换分组选手">
        <template v-for="(item,index) in data">
          <span :key="item.playerId">{{item.playerName}}<span v-if="data.length - 1 != index">,</span></span>
        </template>
      </a-form-model-item>
      <a-form-model-item label="新分组">
        <a-input v-model="formData.startNo"></a-input>
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
      title: '切换分组',
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
        this.formData = {}
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    handleOk() {
      console.log(this.formData,'123');
      this.formData['playerIds'] = this.data.map((item) => item.playerId)
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