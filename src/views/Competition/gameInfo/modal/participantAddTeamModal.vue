<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <div style="height: 100%; overflow-y: auto">
      <a-form-model :labelCol="{ span: 8 }" :wrapperCol="{ span: 14 }" :rules="rules" ref="form" :model="formData">
        <a-form-model-item label="参赛人来源" prop="playerSource">
          <a-radio-group v-model="formData.playerSource" @change="onChange">
            <a-radio :value="0"> 手动输入 </a-radio>
            <a-radio :value="1"> 系统已有数据 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="男运动员姓名" prop="playerName">
          <a-input v-if="formData.playerSource === 0" allowClear v-model="formData.playerName"></a-input>
          <a-select v-else allowClear v-model="formData.playerName">
            <a-select-option v-for="item in listTarge" :key="item.cproId" :value="item.targetSite"
              >{{ item.targetSite }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="靶位" prop="targetSite">
          <a-select allowClear v-model="formData.targetSite" @change="handleChange">
            <a-select-option v-for="item in listTarge" :key="item.cproId" :value="item.targetSite"
              >{{ item.targetSite }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="女运动员姓名" prop="playerName2">
          <a-input v-if="formData.playerSource === 0" allowClear v-model="formData.playerName2"></a-input>
          <a-select v-else allowClear v-model="formData.playerName2">
            <a-select-option v-for="item in listTarge" :key="item.cproId" :value="item.targetSite"
              >{{ item.targetSite }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="靶位" prop="targetSite2">
          <a-select allowClear v-model="formData.targetSite2" @change="handleChange">
            <a-select-option v-for="item in listTarge" :key="item.cproId" :value="item.targetSite"
              >{{ item.targetSite }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="代表队名称" prop="groupName">
          <a-input allowClear v-model="formData.groupName"></a-input>
        </a-form-model-item>
        <a-form-model-item label="组别" prop="stageGroup">
          <a-input allowClear type="number" :min="0" v-model="formData.stageGroup"></a-input>
        </a-form-model-item>
      </a-form-model>
    </div>
  </BizModal>
</template>
  <script>
import BizModal from '@comp/modal/BizModal.vue'
import BizMixins from '@views/biz/bizMixins'
import { savePlayer, bizContestProjectDeviceList, savePlayerGroup } from '@api/competition'
import { projectGroup } from '@views/Competition/participant/participant.config'
export default {
  name: 'participantAddTeamModal',
  components: {
    BizModal,
  },
  mixins: [BizMixins],
  data() {
    return {
      projectGroup,
      title: '添加参赛人员',
      visible: false,
      loadingModal: false,
      type: 1,
      radio: 1,
      formData: {
        playerSource: 0,
        playerName: '',
        playerName2: '',
        stageGroup: '',
        groupName: '',
        targetSite: '',
        targetSite2: '',
      },
      rules: {
        playerSource: [{ required: true, message: '请选择参赛人来源', trigger: 'blur' }],
        playerName: [{ required: true, message: '请输入选手姓名', trigger: 'blur' }],
        playerName2: [{ required: true, message: '请输入选手姓名', trigger: 'blur' }],
        groupName: [{ required: true, message: '请输入代表队名称', trigger: 'blur' }],
        stageGroup: [{ required: true, message: '请选择分组组别', trigger: 'blur' }],
        targetSite: [{ required: true, message: '请选择靶位', trigger: 'blur' }],
        targetSite2: [{ required: true, message: '请选择靶位', trigger: 'blur' }],
      },
      list: [],
      contestId: 0,
      cproId: 0,
      listStage: [],
      listTarge: [],
      isField1Modified: false,
      tabletPcNum: '',
      tabletPcNum2: '',
      listGroup: [],
    }
  },
  watch: {},
  methods: {
    init(data) {
      this.visible = true
      this.loadingModal = false
      this.contestId = data.contestId
      this.cproId = data.cproId
      // this.stageGroup = data.stageGroup
      this.stageId = data.stageId
      bizContestProjectDeviceList(data).then((res) => {
        this.listTarge = res.result
      })
    },
    onChange(e) {
      console.log('radio checked', e.target.value)
    },
    handleOk() {
      this.$refs.form.validate((v) => {
        if (v) {
          this.loadingModal = true
          if (this.type === 1) {
            let data = {
              ...this.formData,
              contestId: this.contestId,
              tabletPcNum: this.tabletPcNum,
              tabletPcNum2: this.tabletPcNum2,
              cproId: this.cproId,
              stageId: this.stageId,
            }
            savePlayerGroup(data).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('ok')
                this.loadingModal = false
                this.visible = false
                this.formData = {
                  playerSource: 0,
                  playerName: '',
                  playerName2: '',
                  stageGroup: '',
                  groupName: '',
                  targetSite: '',
                  targetSite2: '',
                }
                if (res.code == 500) {
                  this.loadingModal = false
                  this.$message.warning(res.message)
                }
              } else {
                this.loadingModal = false
                this.$message.error(res.message)
              }
            })
          }
          this.isField1Modified = false
        }
      })
    },
    handleChange(v) {
      const selectedOption = this.listTarge.find((item) => item.targetSite === v)
      if (selectedOption) {
        this.tabletPcNum = selectedOption.tabletPcNum
      }
    },
    handleCancel() {
      this.visible = false
      this.isField1Modified = false
      this.formData = {
        playerSource: 0,
        playerName: '',
        playerName2: '',
        stageGroup: '',
        groupName: '',
        targetSite: '',
        targetSite2: '',
      }
    },
  },
}
</script>
  
  <style scoped lang="scss"></style>