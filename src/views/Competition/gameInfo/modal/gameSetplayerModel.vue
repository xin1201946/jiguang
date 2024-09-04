<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <div style="height: 100%; overflow-y: auto">
      <a-form-model :labelCol="{ span: 8 }" :wrapperCol="{ span: 14 }" :rules="rules" ref="form" :model="formData">
        <a-form-model-item label="姓名" prop="playerName">
          <a-input allowClear v-model="formData.playerName"></a-input>
        </a-form-model-item>

        <a-form-model-item label="代表队" prop="groupName">
          <a-input allowClear v-model="formData.groupName"></a-input>
        </a-form-model-item>
      </a-form-model>
    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import BizMixins from '@views/biz/bizMixins'
import { processSelectGroupList, updatePlayer } from '@api/competition'
import { projectGroup } from '@views/Competition/participant/participant.config'
export default {
  name: 'gameSetplayerModel',
  components: {
    BizModal,
  },
  mixins: [BizMixins],
  data() {
    return {
      projectGroup,
      title: '编辑参赛人员',
      visible: false,
      loadingModal: false,
      type: 1,
      formData: {
        playerName: '',
        groupName: '',
      },
      rules: {
        playerName: [{ required: true, message: '请输入选手姓名', trigger: 'blur' }],
        groupName: [{ required: true, message: '请输入团队名称', trigger: 'blur' }],
      },
      list: [],
      contestId: 0,
      cproId: 0,
      listStage: [],
      listTarge: [],
      isField1Modified: false,
      tabletPcNum: '',
      listGroup: [],
    }
  },
  watch: {},
  methods: {
    init(r, d) {
      this.visible = true
      this.loadingModal = false
      this.formData = r
      this.contestId = d.contestId
      this.cproId = d.cproId
      this.stageId = d.stageId
    },

    handleOk() {
      this.$refs.form.validate((v) => {
        if (v) {
          this.loadingModal = true

          let data = {
            playerId: this.formData.playerId,
            groupName: this.formData.groupName,
            playerName: this.formData.playerName,
            contestId: this.contestId,
            cproId: this.cproId,
            stageId: this.stageId,
          }
          updatePlayer(data).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.$emit('playerOk')
              this.loadingModal = false
              this.visible = false
              if (res.code == 500) {
                this.loadingModal = false
              }
            } else {
              this.$message.error(res.message)
            }
          })
        }
        this.isField1Modified = false
      })
    },
    handleCancel() {
      this.visible = false
      this.isField1Modified = false
      this.formData = {
        playerName: '',
        groupName: '',
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>