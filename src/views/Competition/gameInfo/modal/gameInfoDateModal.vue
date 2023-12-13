<template>
  <BizModal
    title="时间管理"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    ok-text="更新"
    :width="700"
  >
    <div class="modal">
      <h3>{{ title }}</h3>
      <a-form-model
        ref="form"
        :model="formData"
      >
        <template v-for="(item, i) in formData.data">
          <a-form-model-item
            :label="numToCapital(item.stageGroup)+'组'" :key="i">
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item
                  label="开始时间"
                  :labelCol="{ span: 6 }"
                  :wrapperCol="{ span: 17, offset: 1 }"
                >
                  <a-date-picker
                    style="width: 100%"
                    v-model="item.sgTimeStart"
                    format="YYYY-MM-DD HH:mm:ss"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                  ></a-date-picker>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="结束时间"
                  :labelCol="{ span: 6 }"
                  :wrapperCol="{ span: 17, offset: 1 }"
                >
                  <a-date-picker
                    style="width: 100%"
                    v-model="item.sgTimeEnd"
                    format="YYYY-MM-DD HH:mm:ss"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                  ></a-date-picker>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model-item>
        </template>
      </a-form-model>
    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { numToCapital } from '@/utils'
import { contest_processUpdateStageGroupTime } from '@api/competition'

export default {
  name: 'gameInfoDateModal',
  components: {
    BizModal
  },
  data() {
    return {
      visible: false,
      formData: {
        data: []
      },
      title: '',
      obj: {}
    }
  },
  methods: {
    numToCapital,
    init(data, obj) {
      this.obj = obj
      this.formData.data = data
      this.title = `${data[0].projectGroup + data[0].cproName} - ${data[0].stageName}`
      this.visible = true
    },
    handleOk() {
      contest_processUpdateStageGroupTime({
        ...this.obj,
        list: this.formData.data
      }).then(res => {
        if (res.success) {
          this.$message.success(res.message || "更新成功")
          this.handleCancel()
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
.modal{
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>