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
        <a-input v-model="formData.deviceNum"></a-input>
      </a-form-model-item>
      <a-form-model-item label="设备状态" prop="deviceStatus">
        <a-input v-model="formData.deviceStatus"></a-input>
      </a-form-model-item>
      <a-form-model-item label="设备电压" prop="deviceVoltage">
        <a-input v-model="formData.deviceVoltage"></a-input>
      </a-form-model-item>
      <a-form-model-item label="枪支类型" prop="deviceGunType">
        <a-select v-model="formData.deviceGunType">
          <a-select-option
            v-for="item in deviceGunType"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="设备类型" prop="deviceType">
        <a-select v-model="formData.deviceType">
          <a-select-option
            v-for="item in deviceType"
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
import { deviceGunType, deviceType } from '@views/biz/equipment/equipment.config'
import { bizDeviceSave, bizDeviceUpdate } from '@api/biz'
export default {
  name: 'equipmentModal',
  components: {
    BizModal
  },
  mixins: [bizMixins],
  data() {
    return {
      visible: false,
      title: '',
      type: 0,
      deviceGunType,
      deviceType,
      formData: {
        deviceNum: '',
        deviceStatus: '',
        deviceType: '',
        deviceGunType: '',
        deviceVoltage: '',
        deviceId: ''
      },
      rules: {
        deviceNum: [
          { required: true, message: '请输入设备号', trigger: 'blur' }
        ],
        deviceStatus: [
          { required: true, message: '请输入设备状态', trigger: 'blur' }
        ],
        deviceType: [
          { required: true, message: '请选择设备类型', trigger: 'blur' }
        ],
        deviceGunType: [
          { required: true, message: '请选择枪支类型', trigger: 'blur' }
        ],
        deviceVoltage: [
          { required: true, message: '请输入设备电压', trigger: 'blur' }
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
            delete data.deviceId
            bizDeviceSave(data).then(this.quit)
          }
          if (this.type === 1) {
            bizDeviceUpdate(this.formData).then(this.quit)
          }
        }
      })
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
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">

</style>