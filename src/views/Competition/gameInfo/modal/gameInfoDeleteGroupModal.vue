<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <div style="height: 100%; overflow-y: auto">
      <a-form-model :labelCol="{ span: 8 }" :wrapperCol="{ span: 14 }" :rules="rules" ref="form" :model="formData">
        <a-form-model-item label="组别" prop="stageGroup">
          <a-input allowClear type="number" :min="0" v-model="formData.stageGroup" @change="handleChange"></a-input>
        </a-form-model-item>
        <a-form-model-item label="代表队名称" prop="groupName">
          <!-- <a-input allowClear v-model="formData.groupName"></a-input> -->
          <a-select allowClear v-model="formData.groupName">
            <a-select-option v-for="item in listGroup" :key="item" :value="item">{{ item }} </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </div>
  </BizModal>
</template>
<script>
import BizModal from '@comp/modal/BizModal.vue'
import BizMixins from '@views/biz/bizMixins'
import { bizContestProjectDeviceList, deletePlayerGroup, getGroupNameList } from '@api/competition'
import { projectGroup } from '@views/Competition/participant/participant.config'
export default {
  name: 'gameInfoDeleteGroupModal',
  components: {
    BizModal,
  },
  mixins: [BizMixins],
  data() {
    return {
      projectGroup,
      title: '删除运动员',
      visible: false,
      loadingModal: false,
      type: 1,
      formData: {
        stageGroup: '',
        groupName: '',
      },
      rules: {
        groupName: [{ required: true, message: '请输入代表队名称', trigger: 'blur' }],
        stageGroup: [{ required: true, message: '请选择分组组别', trigger: 'blur' }],
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
  created() {},
  methods: {
    init(data) {
      this.visible = true
      this.loadingModal = false
      this.contestId = data.contestId
      this.cproId = data.cproId
      this.stageId = data.stageId
      bizContestProjectDeviceList(data).then((res) => {
        this.listTarge = res.result
      })
      getGroupNameList({
        contestId: this.contestId,
        cproId: this.cproId,
        stageId: this.stageId,
      }).then((res) => {
        this.listGroup = res.result
      })
    },
    handleChange(e) {
      getGroupNameList({
        contestId: this.contestId,
        cproId: this.cproId,
        stageId: this.stageId,
        stageGroup: e.data,
      }).then((res) => {
        this.listGroup = res.result
      })
    },
    handleOk() {
      this.$refs.form.validate((v) => {
        if (v) {
          this.loadingModal = true
          if (this.type === 1) {
            let data = {
              ...this.formData,
              contestId: this.contestId,
              cproId: this.cproId,
              stageId: this.stageId,
            }
            deletePlayerGroup(data).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('ok')
                this.loadingModal = false
                this.visible = false
                this.formData = {
                  stageGroup: '',
                  groupName: '',
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
    handleCancel() {
      this.visible = false
      this.isField1Modified = false
      this.formData = {
        stageGroup: '',
        groupName: '',
      }
    },
  },
}
</script>
    
<style scoped lang="scss"></style>