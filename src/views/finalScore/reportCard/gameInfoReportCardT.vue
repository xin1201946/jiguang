<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <a-form-model :labelCol="{ span: 6 }" :wrapperCol="{ span: 10 }" :rules="rules" ref="form" :model="formData">
      <a-form-model-item label="比赛状态">
        <a-radio-group v-model="formData.group" style="line-height: 35px;">
          <a-radio :value="item.group" v-for="item in groupList" :key="item.group">
            {{ `${numToCapital(item.group)}组` }}
          </a-radio>
          <!-- <a-radio value="DNS">未参加比赛-NDS</a-radio>
          <a-radio value="DSQ">成绩无效-DSQ</a-radio> -->
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { numToCapital, infoMessage, deleteMessage } from '@/utils'
import { getStagePlayerGroup } from '@api/competition'
export default {
  name: 'gameInfoReportCard',
  components: {
    BizModal,
  },
  data() {
    return {
      title: '选择组别',
      visible: false,
      loadingModal: false,
      formData: {},
      rules: {},
      groupList: [],
    }
  },
  methods: {
    numToCapital,
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
      this.formData = {}
      getStagePlayerGroup({
        contestId: row.contestId, //赛事id
        cproId: row.cproId, //赛事项目id
        stageId: row.stageId, //项目阶段id
      }).then((res) => {
        if (res.success) {
          this.groupList = res.result
        }
      })
    },
  },
}
</script>

<style scoped lang="less"></style>