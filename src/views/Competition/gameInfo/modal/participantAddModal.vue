<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <div style="height: 100%; overflow-y: auto">
      <a-form-model :labelCol="{ span: 8 }" :wrapperCol="{ span: 14 }" :rules="rules" ref="form" :model="formData">
        <a-form-model-item label="姓名" prop="playerName">
          <a-input allowClear v-model="formData.playerName"></a-input>
        </a-form-model-item>
        <!-- <a-form-model-item label="性别" :wrapperCol="{ span: 12, offset: 1 }" prop="playerSex">
          <a-radio-group v-model="formData.playerSex">
            <a-radio value="0">未知</a-radio>
            <a-radio value="1">男</a-radio>
            <a-radio value="2">女</a-radio>
          </a-radio-group>
        </a-form-model-item> -->
        <a-form-model-item label="选手编号" prop="serialNumber">
          <a-input allowClear v-model="formData.serialNumber"></a-input>
        </a-form-model-item>
        <a-form-model-item label="身份证号" prop="idCardNum">
          <a-input allowClear v-model="formData.idCardNum"></a-input>
        </a-form-model-item>
        <a-form-model-item label="团队名称" prop="groupName">
          <a-input allowClear v-model="formData.groupName"></a-input>
        </a-form-model-item>
        <!-- <a-form-model-item label="项目组别" :wrapperCol="{ span: 12, offset: 1 }" prop="projectGroup">
          <a-radio-group v-model="formData.projectGroup" @change="handleOnChange">
            <a-radio v-for="(item, i) in projectGroup" :key="i" :value="item.value">{{ item.label }}</a-radio>
          </a-radio-group>
        </a-form-model-item> -->

        <a-form-model-item label="靶位" prop="targetSite">
          <a-select allowClear v-model="formData.targetSite" @change="handleChange">
            <a-select-option v-for="item in listTarge" :key="item.cproId" :value="item.targetSite"
              >{{ item.targetSite }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import BizMixins from '@views/biz/bizMixins'
import {
  bizContestPlayerSave,
  bizContestPlayerUpdate,
  processSelectGroupList,
  processSelectTargetList,
  savePlayer,
  bizContestProjectDeviceList,
} from '@api/competition'
import { projectGroup } from '@views/Competition/participant/participant.config'
export default {
  name: 'participantAddModal',
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
      formData: {
        serialNumber: '',
        playerName: '',
        playerSex: '',
        idCardNum: '',
        groupName: '',
        projectGroup: '',
        playerId: '',
        project1: '',
        isGroup1: '',
        project2: '',
        isGroup2: '',
        project3: '',
        mixedGroupNo: '',
      },
      rules: {
        serialNumber: [{ required: false, message: '请输入选手编号', trigger: 'blur' }],
        playerName: [{ required: true, message: '请输入选手姓名', trigger: 'blur' }],
        // playerSex: [{ required: true, message: '请选择选手性别', trigger: 'blur' }],
        idCardNum: [
          { required: false, message: '请输入身份证号', trigger: 'blur' },
          {
            pattern: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0\d|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
            message: '请输入正确的身份证号',
            trigger: 'change',
          },
        ],
        groupName: [{ required: true, message: '请输入团队名称', trigger: 'blur' }],
        projectGroup: [{ required: true, message: '请选择项目组别', trigger: 'blur' }],

        stageGroup: [{ required: false, message: '请选择分组组别', trigger: 'blur' }],
        targetSite: [{ required: false, message: '请选择靶位', trigger: 'blur' }],
      },
      list: [],
      contestId: 0,
      cproId: 0,
      listStage: [],
      listTarge: [],
      isField1Modified: false,
      tabletPcNum: '',
    }
  },
  watch: {
    'formData.projectGroup': {
      handler(newVal, oldVal) {
        if (oldVal) {
          if (newVal) {
            if (newVal !== oldVal) {
              this.isField1Modified = true
              this.updateField2Rules()
            }
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    init(data) {
      this.visible = true
      this.loadingModal = false
      this.contestId = data.contestId
      this.cproId = data.cproId
      this.stageGroup = data.stageGroup
      this.stageId = data.stageId
      bizContestProjectDeviceList(data).then((res) => {
        this.listTarge = res.result
      })
    },
    updateField2Rules() {
      if (this.isField1Modified) {
        this.$set(this.rules, 'stageGroup', [{ required: true, message: '请选择分组组别', trigger: 'change' }])
        this.$set(this.rules, 'targetSite', [{ required: true, message: '请选择靶位', trigger: 'change' }])
      } else {
        this.$set(this.rules, 'stageGroup', [{ required: false, trigger: 'change' }])
        this.$set(this.rules, 'targetSite', [{ required: false, trigger: 'change' }])
      }
    },
    handleOk() {
      this.$refs.form.validate((v) => {
        if (v) {
          this.loadingModal = true
          console.log(this.formData, '1qqqaaa')
          if (this.type === 1) {
            let data = {
              ...this.formData,
              contestId: this.contestId,
              tabletPcNum: this.tabletPcNum,
              cproId: this.cproId,
              stageGroup: this.stageGroup,
              stageId: this.stageId,
            }
            savePlayer(data).then((res) => {
              console.log(res, 'resss')
              if(res.success){
                this.$message.success(res.message)
                this.$emit('ok')
                this.loadingModal = false
                this.visible = false
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
        serialNumber: '',
        playerName: '',
        playerSex: '',
        idCardNum: '',
        groupName: '',
        projectGroup: '',
        playerId: '',
        project1: '',
        isGroup1: '',
        project2: '',
        isGroup2: '',
        project3: '',
        mixedGroupNo: '',
      }
      this.$refs.form.resetFields()
      this.$set(this.rules, 'stageGroup', [{ required: false, trigger: 'change' }])
      this.$set(this.rules, 'targetSite', [{ required: false, trigger: 'change' }])
    },
    // 单选radio
    handleOnChange(Event) {
      this.formData.project1 = null
      this.formData.isGroup1 = null
      this.formData.project2 = null
      this.formData.isGroup2 = null
      this.formData.project3 = null
      this.formData.mixedGroupNo = null
    },
    handleChangePro1(ev) {
      this.$nextTick(() => {
        this.handleSelectGroup(ev)
      })
    },
    // 组别
    handleSelectGroup(ev) {
      const arr = {
        contestId: this.contestId,
        cproName: ev,
        projectGroup: this.formData.projectGroup,
      }
      processSelectGroupList(arr).then((res) => {
        this.listStage = res.result
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>