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
      <a-form-model-item label="平板设备号" prop="tabletPcNum">
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
      <a-form-model-item label="枪设备号" prop="gunDeviceNum">
        <a-input disabled v-model="formData.gunDeviceNum"></a-input>
      </a-form-model-item>
      <a-form-model-item label="靶设备号" prop="targetDeviceNum">
        <a-input disabled v-model="formData.targetDeviceNum"></a-input>
      </a-form-model-item>
      <a-form-model-item label="靶位" prop="targetSite">
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
        targetSite: [
          { required: true, message: '请输入靶位', trigger: 'blur' }
        ],
        targetDeviceNum: [
          { required: true, message: '请选择枪设备号', trigger: 'blur' }
        ],
        tabletPcNum: [
          { required: true, message: '请选择靶设备号', trigger: 'blur' }
        ],
        gunDeviceNum: [
          { required: true, message: '请选择平板状态', trigger: 'blur' }
        ]
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