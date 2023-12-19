<template>
  <BizModal title="时间管理" :visible="visible" @ok="handleOk" @cancel="handleCancel" ok-text="更新">
    <div class="modal">
      <h3>{{ title }}</h3>
      <a-form-model ref="form" :model="formData">
        <template v-for="(item, i) in formData.data">
          <a-form-model-item :labelCol="{ span: 2 }" :wrapperCol="{ span: 19, offset: 1 }" :label="numToCapital(item.stageGroup)+'组'" :prop="'data.' + i + '.times'" :rules="{
              message: '请选择开始时间和结束时间',
              required: true,
              trigger: 'change'
            }" :key="i">
            <a-range-picker style='width: 100%' v-model="item.times" format="YYYY-MM-DD HH:mm" valueFormat="YYYY-MM-DD HH:mm" :showTime="{
                format: 'HH:mm',
                valueFormat: 'HH:mm'
              }" :input-read-only="true" :disabledTime="(dates, partial) => disabledTime(dates, partial, i)"></a-range-picker>
            <!--            :disabled-date="(c) => disabledDate(c, i)"-->
            <!--             -->
          </a-form-model-item>
        </template>
      </a-form-model>
    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { numToCapital, Time } from '@/utils'
import { contest_processUpdateStageGroupTime } from '@api/competition'
import dayjs from 'dayjs'
import moment from 'dayjs'
export default {
  name: 'gameInfoDateModal',
  components: {
    BizModal,
  },
  data() {
    return {
      visible: false,
      formData: {
        data: [],
      },
      title: '',
      obj: {},
    }
  },
  methods: {
    numToCapital,
    init(data, obj) {
      this.obj = obj
      this.formData.data = data.map((item) => {
        return {
          ...item,
          times: [item.sgTimeStart, item.sgTimeEnd],
        }
      })
      this.title = `${data[0].projectGroup + data[0].cproName} - ${data[0].stageName}`
      this.visible = true
    },
    handleOk() {
      this.$refs.form.validate((v) => {
        if (v) {
          contest_processUpdateStageGroupTime({
            ...this.obj,
            list: this.formData.data.map((item) => {
              const obj = JSON.parse(JSON.stringify(item))
              obj.sgTimeStart = item.times[0]
              obj.sgTimeEnd = item.times[1]
              delete item.times
              return obj
            }),
          }).then((res) => {
            if (res.success) {
              this.$message.success(res.message || '更新成功')
              this.handleCancel()
            }
          })
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    range(count) {
      return Array.from(Array(count).keys())
    },
    disabledDate(current, i) {
      // return current && current < moment(this.formData.data[i].times[0]).endOf('day');
      return false
    },
    disabledTime(dates, partial, i) {
      const start = dayjs(this.formData.data[i].times[0]) // 获取开始时间
      const end = dayjs(this.formData.data[i].times[1]) // 获取结束时间

      if (partial === 'start') {
        return {
          disabledHours: () => {
            const startDate = new Date(this.formData.data[i].times[0]).getDate()
            const endDate = new Date(this.formData.data[i].times[1]).getDate()
            if (startDate === endDate) {
              return this.range(24).slice(end.hour() + 1, 24)
            }
            return []
          },
          disabledMinutes: () => [],
        }
      }
      if (partial === 'end') {
        return {
          disabledHours: () => {
            const startDate = new Date(this.formData.data[i].times[0]).getDate()
            const endDate = new Date(this.formData.data[i].times[1]).getDate()
            console.log(this.range(24).slice(0, start.hour() + 1))
            if (startDate === endDate) {
              return this.range(24).slice(0, start.hour() + 1)
            }
            return []
          },
          disabledMinutes: () => [],
        }
      }
    },
  },
}
</script>

<style scoped lang="less">
.modal {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>