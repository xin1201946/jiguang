<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
  >
    <a-form-model
      :labelCol="{span: 6}"
      :wrapperCol="{span: 14}"
      :rules="rules"
      ref="form"
      :model="formData"
    >
      <a-form-model-item label="姓名" prop="playerName">
        <a-input v-model="formData.playerName"></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="性别"
        :wrapperCol="{span: 12, offset: 1}"
        prop="playerSex"
      >
        <a-radio-group v-model="formData.playerSex">
          <a-radio value="0">未知</a-radio>
          <a-radio value="1">男</a-radio>
          <a-radio value="2">女</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="选手编号" prop="serialNumber">
        <a-input v-model="formData.serialNumber"></a-input>
      </a-form-model-item>

      <a-form-model-item label="身份证号" prop="idCardNum">
        <a-input v-model="formData.idCardNum"></a-input>
      </a-form-model-item>
      <a-form-model-item label="团队名称" prop="groupName">
        <a-input v-model="formData.groupName"></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="项目组别"
        :wrapperCol="{span: 12, offset: 1}"
        prop="projectGroup"
      >
        <a-radio-group v-model="formData.projectGroup">
          <a-radio
            v-for="(item, i) in projectGroup"
            :key="i"
            :value="item.value"
          >{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import BizMixins from '@views/biz/bizMixins'
import { bizContestPlayerSave, bizContestPlayerUpdate } from '@api/competition'
import { projectGroup } from '@views/Competition/participant/participant.config'
export default {
  name: 'participantModal',
  components: {
    BizModal
  },
  mixins: [BizMixins],
  data() {
    return {
      projectGroup,
      title: '编辑',
      visible: false,
      type: 1,
      formData: {
        serialNumber: "",
        playerName: "",
        playerSex: "",
        idCardNum: "",
        groupName: "",
        projectGroup: "",
        playerId: "",
      },
      rules: {
        serialNumber: [
          {required: true, message: "请输入选手编号", trigger: "blur"}
        ],
        playerName: [
          {required: true, message: "请输入选手姓名", trigger: "blur"}
        ],
        playerSex: [
          {required: true, message: "请选择选手性别", trigger: "blur"}
        ],
        idCardNum: [
          {required: true, message: "请输入身份证号", trigger: "blur"},
          {
            pattern: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0\d|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
            message: "请输入正确的身份证号", trigger: "change"
          }
        ],
        groupName: [
          {required: true, message: "请输入团队名称", trigger: "blur"}
        ],
        projectGroup: [
          {required: true, message: "请选择项目组别", trigger: "blur"}
        ],
      }
    }
  },
  methods: {
    handleOk() {
      this.$refs.form.validate(v => {
        if (v) {
          this.loadingModal = true
          if (this.type === 1) {
            bizContestPlayerUpdate(this.formData).then(this.callback)
          }
          if (this.type === 0) {
            const data = JSON.parse(JSON.stringify(this.formData))
            delete data.playerId
            data.contestId = this.$route.query.id
            bizContestPlayerSave(data).then(this.callback)
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

<style scoped lang="scss">

</style>