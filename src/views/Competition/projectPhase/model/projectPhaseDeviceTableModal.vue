<template>
  <BizModal
    :title="title"
    :visible="visible"
    :loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      :labelCol="{span: 6}"
      :wrapperCol="{span: 14}"
      :rules="rules"
      ref="form"
      :model="formData"
    >
      <a-form-model-item label="平板">
        <a-select
          @change="handleChange"
          v-model="formData.tabletPcNum"
        >
          <a-select-option
            v-for="item in tableList"
            :key="item.tabletPcId"
            :value="item.tabletPcNum"
          >{{ item.tabletPcName }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="枪">
        <a-input v-model="formData.gunDeviceNum"></a-input>
      </a-form-model-item>
      <a-form-model-item label="靶">
        <a-input v-model="formData.targetDeviceNum"></a-input>
      </a-form-model-item>
      <a-form-model-item label="靶位">
        <a-input v-model="formData.targetSite"></a-input>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import { bizTabletPcList } from '@api/biz'
import BizModal from '@comp/modal/BizModal.vue'
import { bizContestProjectDeviceSave, bizContestProjectDeviceUpdate } from '@api/competition'
export default {
  name: 'projectPhaseDeviceTableModal',
  components: {
    BizModal
  },
  data() {
    return {
      title: "",
      visible: false,
      loading: false,
      type: 0,
      formData: {
        targetSite: "",
        targetDeviceNum: "",
        tabletPcNum: "",
        gunDeviceNum: "",
        cproDeviceId: "",
      },
      tableList: [],
      rules: {
        targetSite: [],
        targetDeviceNum: [],
        tabletPcNum: [],
        gunDeviceNum: []
      },
      cproId: ""
    }
  },
  methods: {
    getPcTableList () {
      return bizTabletPcList().then(res => {
        console.log(res)
        this.tableList = res.result
        return
      })
    },
    handleChange(v) {
      const data = this.tableList.filter(item => item.tabletPcNum === v)[0]
      this.formData.targetDeviceNum = data.deviceNum0
      this.formData.gunDeviceNum = data.deviceNum1
    },
    handleOk() {
      this.$refs.form.validate(v => {
        if (v) {
          this.loading = true
          if (this.type === 0) {
            const data = JSON.parse(JSON.stringify(this.formData))
            delete data.cproDeviceId
            bizContestProjectDeviceSave({
              ...data,
              cproId: this.cproId,
              contestId: this.$route.query.id
            }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.$emit("list")
                this.visible = false
              }else {
                this.$message.warning(res.message)
                this.loading = false
              }
            })
          }
          if (this.type === 1) {
            bizContestProjectDeviceUpdate({
              ...this.formData,
              cproId: this.cproId,
              contestId: this.$route.query.id
            }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.$emit("list")
                this.visible = false
              }else {
                this.$message.warning(res.message)
                this.loading = false
              }
            })
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    init(id) {
      this.cproId = id
      this.type = 0
      this.loading = false
      this.title = "添加"
      this.visible = true
      this.getPcTableList().then(() => {
        this.$nextTick(() => {
          for (const key in this.formData){
            this.formData[key] = ""
          }
          this.$refs.form.clearValidate()
        })
      })
    },
    edit(row, id) {
      this.cproId = id
      this.type = 1
      this.title = "编辑"
      this.loading = false
      this.visible = true
      this.getPcTableList().then(() => {
        this.$nextTick(() => {
          for (const key in this.formData){
            this.formData[key] = row[key]
          }
          this.$refs.form.clearValidate()
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>