<template>
  <BizModal
    :title="title"
    :visible="visible"
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
      <a-form-model-item label="设备编号" prop="deviceNum">
<!--        <a-input v-model="formData.deviceNum"></a-input>-->
        <a-select v-model="formData.deviceNum">
          <a-select-option
            v-for="item in device"
            :key="item.deviceId"
            :value="item.deviceId"
          >{{ item.deviceNum }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="平板名称" prop="tabletPcName">
        <a-input v-model="formData.tabletPcName"></a-input>
      </a-form-model-item>
      <a-form-model-item label="平板编号" prop="tabletPcNum">
        <a-input v-model="formData.tabletPcNum"></a-input>
      </a-form-model-item>
      <a-form-model-item label="当前模式" prop="tabletPcStatus">
<!--        <a-input v-model="formData.tabletPcStatus"></a-input>-->
        <a-select v-model="formData.tabletPcStatus">
          <a-select-option
            v-for="item in tabletPcStatus"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import bizMixins from '@views/biz/bizMixins'
import { tabletPcStatus } from '@views/biz/slab/slab.config'
import { bizDeviceSave, bizDeviceUpdate } from '@api/biz'

export default {
  name: 'slabModal',
  components: {
    BizModal
  },
  mixins: [bizMixins],
  data() {
    return {
      tabletPcStatus,
      title: "",
      visible: false,
      type: 0,
      formData: {
        tabletPcStatus: '',
        tabletPcNum: '',
        tabletPcName: '',
        deviceNum: '',
        tabletPcId: ''
      },
      rules: {
        tabletPcStatus: [
           { required: true, message: '请选择当前模式', trigger: 'blur' }
        ],
        tabletPcNum: [
           { required: true, message: '请输入平板编号', trigger: 'blur' }
        ],
        tabletPcName: [
           { required: true, message: '请输入平板名称', trigger: 'blur' }
        ],
        deviceNum: [
           { required: true, message: '请选择设备编号', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    handleOk() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.type === 0) {
            const data = JSON.parse(JSON.stringify(this.formData))
            delete data.tabletPcId
            bizDeviceSave(data).then(this.quit)
          }
          if (this.type === 1) {
            bizDeviceUpdate(this.formData).then(this.quit)
          }
        }
      })
      // bizDeviceSave
    },
    handleCancel() {
      this.visible = false
    },
    quit(res) {
      if (res.code === 200) {
        this.$message.success(res.message)
        this.handleCancel()
        this.$emit("list")
      }else {
        this.$message.warning(res.message)
      }
    },
  }
}
</script>

<style scoped lang="scss">

</style>