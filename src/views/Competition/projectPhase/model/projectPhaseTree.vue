<template>
  <div class="trees">
    <a-form-model
      ref="form"
      :labelCol="{span: 6}"
      :wrapperCol="{span: 18}"
    >
      <a-form-model-item label="赛事名称" prop="contestName">
        <a-input disabled style="width: 100%" v-model="data.contestName"></a-input>
      </a-form-model-item>
      <a-form-model-item label="主办方" prop="sponsor">
        <a-input disabled style="width: 100%" v-model="data.sponsor"></a-input>
      </a-form-model-item>
      <a-form-model-item label="赛事类型" prop="contestType">
        <a-input disabled style="width: 100%" v-model="data.contestType"></a-input>
      </a-form-model-item>
      <a-form-model-item label="选手类型" prop="playerType">
        <a-select
          v-model="data.playerType"
          disabled
        >
          <a-select-option
            v-for="item in playerType"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="报名时间" prop="registTime">
        <a-range-picker
          style="width: 100%"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          :showTime="true"
          v-model="data.registTime"
          disabled
        ></a-range-picker>
      </a-form-model-item>
      <a-form-model-item label="比赛时间" prop="contestTime">
        <a-range-picker
          v-model="data.contestTime"
          style="width: 100%"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          :showTime="true"
          disabled
        ></a-range-picker>
      </a-form-model-item>
      <a-form-model-item
        label="比赛地点"
        prop="location"
      >
        <a-input
          v-model="data.location"
          type="textarea"
          :maxLength="100"
          disabled
        ></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="赛事简介"
        prop="briefIntro"
        :wrapperCol="{span: 24}"
      >
        <VueEditor v-model="data.briefIntro" disabled></VueEditor>
      </a-form-model-item>
      <a-form-model-item
        label="赛事详情"
        prop="content"
        :wrapperCol="{span: 24}"
      >
        <VueEditor v-model="data.content" disabled></VueEditor>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { playerType } from '@views/Competition/competitionList/competitionList.config'
export default {
  name: 'projectPhaseTree',
  props: ["data"],
  components: {
    VueEditor
  },
  data() {
    return {
      playerType
    }
  }
}
</script>


<style scoped lang="less">
.trees{
  height: 100%;
  overflow-y: auto;
  padding-right: 20px;
  /deep/.ant-input.ant-input-disabled,
  /deep/.ant-select.ant-select-disabled{
    color: #333;
    cursor: not-allowed;
  }
  /deep/.ql-container.ql-snow.ql-disabled{
    user-select: none;
    cursor: not-allowed;
  }
}
</style>