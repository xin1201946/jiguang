<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
    :width="820"
  >
<!--    :labelCol="{span: 6}"
        :wrapperCol="{span: 14}"-->
    <div class="modal">
      <a-form-model
        :labelCol="{span: 6}"
        :wrapperCol="{span: 18}"
        :rules="rules"
        ref="form"
        :model="formData"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="赛事名称" prop="contestName">
              <a-input style="width: 100%" v-model="formData.contestName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="主办方" prop="sponsor">
              <a-input  style="width: 100%" v-model="formData.sponsor"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="赛事类型" prop="contestType">
              <a-input  style="width: 100%" v-model="formData.contestType"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="选手类型" prop="playerType">
              <a-select v-model="formData.playerType">
                <a-select-option
                  v-for="item in playerType"
                  :key="item.value"
                  :value="item.value"
                >{{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="报名时间" prop="registTime">
              <a-range-picker
                style="width: 100%"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                :showTime="true"
                v-model="formData.registTime"
              ></a-range-picker>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="比赛时间" prop="contestTime">
              <a-range-picker
                v-model="formData.contestTime"
                style="width: 100%"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                :showTime="true"
              ></a-range-picker>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item
              :labelCol="{span: 3}"
              :wrapperCol="{span: 21}"
              label="比赛地点"
              prop="location"
            >
              <a-input
                v-model="formData.location"
                type="textarea"
                :maxLength="100"
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item
              label="赛事简介"
              :labelCol="{span: 3}"
              :wrapperCol="{span: 21}"
              prop="briefIntro"
            >
              <VueEditor v-model="formData.briefIntro"></VueEditor>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item
              :labelCol="{span: 3}"
              :wrapperCol="{span: 21}"
              label="赛事详情"
              prop="content"
            >
              <VueEditor v-model="formData.content"></VueEditor>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import BizMixins from '@views/biz/bizMixins'
import { playerType } from '@views/Competition/competitionList/competitionList.config'
import { VueEditor } from 'vue2-editor'
import { editorToolBar } from '@/utils/editor'
import { bizContestSave, bizContestUpdate } from '@api/competition'
export default {
  name: 'competitionListModal',
  components: {
    BizModal,
    VueEditor
  },
  mixins: [BizMixins],
  data() {
    return {
      editorToolBar,
      playerType,
      title: '',
      type: 0,
      visible: false,
      formData: {
        contestId: "",
        contestName: "",
        sponsor: '',
        contestType: "",
        playerType: "",
        registTime: [],
        contestTime: [],
        location: "",
        briefIntro: "",
        content: ""
      },
      rules: {
        contestName: [
          { required: true, message: '请输入赛事名称', trigger: 'blur' }
        ],
        sponsor: [
          { required: true, message: '请输入主办方', trigger: 'blur' }
        ],
        contestType: [
          { required: true, message: '请输入赛事类型', trigger: 'blur' }
        ],
        playerType: [
          { required: true, message: '请选择选手类型', trigger: 'blur' }
        ],
        registTime: [
          { required: true, message: '请选择报名时间', trigger: 'blur' }
        ],
        contestTime: [
          { required: true, message: '请选择比赛时间', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入比赛地点', trigger: 'blur' }
        ],
        briefIntro: [
          { required: true, message: '请输入赛事简介', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入赛事详情', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    handleOk() {
      console.log(this.formData)
      this.$refs.form.validate(v => {
        if (v) {
          this.loadingModal = true
          if (this.type === 0) {
            const data = JSON.parse(JSON.stringify(this.formData))
            delete data.contestId
            data.contestTimeStart = data.contestTime[0]
            data.contestTimeEnd = data.contestTime[1]
            data.registTimeStart = data.registTime[0]
            data.registTimeEnd = data.registTime[1]
            delete data.contestTime
            delete data.registTime
            bizContestSave(data).then(this.callback)
          }
          if (this.type === 1) {
            const data = JSON.parse(JSON.stringify(this.formData))
            data.contestTimeStart = data.contestTime[0]
            data.contestTimeEnd = data.contestTime[1]
            data.registTimeStart = data.registTime[0]
            data.registTimeEnd = data.registTime[1]
            delete data.contestTime
            delete data.registTime
            bizContestUpdate(data).then(this.callback)
          }
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
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 20px;
}
</style>