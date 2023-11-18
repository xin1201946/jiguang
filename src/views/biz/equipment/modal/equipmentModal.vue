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

      <a-form-model-item label="设备编号" prop="deviceNum">
        <a-input :disabled="type === 1" v-model="formData.deviceNum"></a-input>
      </a-form-model-item>
      <a-form-model-item label="设备电量" prop="deviceVoltage">
        <a-input v-model="formData.deviceVoltage" suffix="%">
        </a-input>
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
      <a-form-model-item
        label="激光训练器类型"
        prop="deviceGunType"
        :rules="{ required: formData.deviceType === '0', message: '激光训练器类型', trigger: 'blur' }"
      >
        <a-select
          v-model="formData.deviceGunType"
          allowClear
        >
          <a-select-option
            v-for="item in deviceGunType"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="设备状态" v-if="type === 1">
        <!--        <a-input disabled v-model="formData.deviceStatus"></a-input>-->
        <a-select disabled v-model="formData.deviceStatus">
          <a-select-option
            v-for="item in deviceStatus"
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
import { deviceGunType, deviceType, deviceStatus } from '@views/biz/equipment/equipment.config'
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
      deviceStatus,
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
        // deviceStatus: [
        //   { required: true, message: '请输入设备状态', trigger: 'blur' }
        // ],
        deviceType: [
          { required: true, message: '请选择设备类型', trigger: 'blur' }
        ],
        deviceGunType: [
          { required: false, message: '请选择枪支类型', trigger: 'blur' }
        ],
        deviceVoltage: [
          { required: true, message: '请输入设备电量', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    handleOk() {
      this.$refs.form.validate(v => {
        if (v) {
          this.loadingModal = true
          if (this.type === 0) {
            const data = JSON.parse(JSON.stringify(this.formData))
            delete data.deviceId
            delete data.deviceStatus
            bizDeviceSave(data).then(this.quit)
          }
          if (this.type === 1) {
            const data = JSON.parse(JSON.stringify(this.formData))
            delete data.deviceStatus
            bizDeviceUpdate(data).then(this.quit)
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
      this.loadingModal = false
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">

</style>