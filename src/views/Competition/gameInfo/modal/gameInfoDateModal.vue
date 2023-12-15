<template>
  <BizModal
    title="时间管理"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    ok-text="更新"
  >
    <div class="modal">
      <h3>{{ title }}</h3>
      <a-form-model
        ref="form"
        :model="formData"
      >
        <template v-for="(item, i) in formData.data">
          <a-form-model-item
            :labelCol="{ span: 2 }"
            :wrapperCol="{ span: 19, offset: 1 }"
            :label="numToCapital(item.stageGroup)+'组'"
            :key="i"
          >
            <a-range-picker
              style='width: 100%'
              v-model="item.times"
              format="YYYY-MM-DD HH:mm"
              valueFormat="YYYY-MM-DD HH:mm"
              :showTime="{
                format: 'HH:mm',
                valueFormat: 'HH:mm'
              }"
            ></a-range-picker>
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
      this.formData.data = data.map(item => {
        return {
          ...item,
          times: [item.sgTimeStart, item.sgTimeEnd]
        }
      })
      this.title = `${data[0].projectGroup + data[0].cproName} - ${data[0].stageName}`
      this.visible = true
    },
    handleOk() {
      contest_processUpdateStageGroupTime({
        ...this.obj,
        list: this.formData.data.map(item => {
          const obj = JSON.parse(JSON.stringify(item))
          obj.sgTimeStart = item.times[0]
          obj.sgTimeEnd = item.times[1]
          delete item.times
          return obj
        })
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