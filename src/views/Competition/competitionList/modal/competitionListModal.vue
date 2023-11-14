<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
    :width="600"
  >
    <div class="modal">
      <a-form-model
        :labelCol="{span: 6}"
        :wrapperCol="{span: 14}"
        :rules="rules"
        ref="form"
        :model="formData"
      >
        <a-form-model-item label="赛事名称">
          <a-input style="width: 100%" v-model="formData.name"></a-input>
        </a-form-model-item>
        <a-form-model-item label="主办方">
          <a-input  style="width: 100%" v-model="formData.sponsor"></a-input>
        </a-form-model-item>
        <a-form-model-item label="赛事类型">
          <a-input  style="width: 100%" v-model="formData.conType"></a-input>
        </a-form-model-item>
        <a-form-model-item label="报名时间">
          <a-range-picker
            style="width: 100%"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            :showTime="true"
          ></a-range-picker>
        </a-form-model-item>
        <a-form-model-item label="比赛时间">
          <a-range-picker
            style="width: 100%"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            :showTime="true"
          ></a-range-picker>
        </a-form-model-item>
        <a-form-model-item label="选手类型">
          <a-select v-model="formData.playerType">
            <a-select-option
              v-for="item in playerType"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="比赛地点">
          <a-input type="textarea"></a-input>
        </a-form-model-item>
        <a-form-model-item label="赛事简介">
          <a-input></a-input>
        </a-form-model-item>
        <a-form-model-item label="赛事详情">
          <a-input></a-input>
        </a-form-model-item>
      </a-form-model>
    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import BizMixins from '@views/biz/bizMixins'
import { playerType } from '@views/Competition/competitionList/competitionList.config'
export default {
  name: 'competitionListModal',
  components: {
    BizModal
  },
  mixins: [BizMixins],
  data() {
    return {
      playerType,
      title: '',
      visible: false,
      formData: {
        name: "",
        conType: "",
        sponsor: '',
        playerType: ""
      },
      rules: {}
    }
  },
  methods: {
    handleOk() {

    },
    handleCancel() {

    }
  }
}
</script>

<style scoped lang="less">
.modal{
  height: 500px;
  overflow-y: auto;
}
</style>