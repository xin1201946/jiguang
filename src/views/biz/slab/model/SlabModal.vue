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
      <a-form-model-item label="设备编号枪" prop="deviceNum0">
        <a-select v-model="formData.deviceNum0">
          <a-select-option
            v-for="item in device.filter(item => item.deviceType === '0')"
            :key="item.deviceId"
            :value="item.deviceNum"
          >{{ item.deviceNum }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="设备编号靶" prop="deviceNum1">
        <a-select v-model="formData.deviceNum1">
          <a-select-option
            v-for="item in device.filter(item => item.deviceType === '1')"
            :key="item.deviceId"
            :value="item.deviceNum"
          >{{ item.deviceNum }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="平板名称" prop="tabletPcName">
        <a-input v-model="formData.tabletPcName"></a-input>
      </a-form-model-item>
      <a-form-model-item label="平板编号" prop="tabletPcNum">
        <a-input v-model="formData.tabletPcNum"></a-input>
      </a-form-model-item>
      <a-form-model-item label="平板状态" prop="tabletPcStatus">
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
      <a-form-model-item label="当前模式" prop="tabletPcModel">
        <a-select v-model="formData.tabletPcModel">
          <a-select-option
            v-for="item in tabletPcModel"
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
import { tabletPcModel, tabletPcStatus } from '@views/biz/slab/slab.config'
import { bizTabletPcSave, bizTabletPcUpdate } from '@api/biz'

export default {
  name: 'slabModal',
  components: {
    BizModal
  },
  mixins: [bizMixins],
  data() {
    return {
      tabletPcStatus,
      tabletPcModel,
      title: "",
      visible: false,
      type: 0,
      formData: {
        tabletPcStatus: '',
        tabletPcNum: '',
        tabletPcName: '',
        // deviceNum: '',
        deviceNum0: '',
        deviceNum1: "",
        tabletPcId: '',
        tabletPcModel: ''
      },
      rules: {
        tabletPcStatus: [
           { required: true, message: '请选择平板状态', trigger: 'blur' }
        ],
        tabletPcNum: [
           { required: true, message: '请输入平板编号', trigger: 'blur' }
        ],
        tabletPcName: [
           { required: true, message: '请输入平板名称', trigger: 'blur' }
        ],
        deviceNum0: [
           { required: true, message: '请选择设备编号枪', trigger: 'blur' }
        ],
        deviceNum1: [
          { required: true, message: '请选择设备编号靶', trigger: 'blur' }
        ],
        tabletPcModel: [
          { required: true, message: '请选择当前模式', trigger: 'blur' }
        ]
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
            bizTabletPcSave(data).then(this.quit)
          }
          if (this.type === 1) {
            bizTabletPcUpdate(this.formData).then(this.quit)
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