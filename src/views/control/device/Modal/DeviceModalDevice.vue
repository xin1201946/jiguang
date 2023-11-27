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
      :wrapperCol="{span: 14, offset: 2}"
      :rules="rules"
      ref="form"
      :model="formData"
    >
      <a-form-model-item label="击发控制" prop="shootControl">
        <a-radio-group v-model="formData.shootControl">
          <a-radio value="0">正常射击</a-radio>
          <a-radio value="1">轨迹扫描</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="音效控制" prop="soundControl">
        <a-radio-group v-model="formData.soundControl">
          <a-radio value="1">开</a-radio>
          <a-radio value="0">关</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="报靶控制" prop="indicateTargetControl">
        <a-radio-group v-model="formData.indicateTargetControl">
          <a-radio value="1">开</a-radio>
          <a-radio value="0">关</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="靶机倾角采集控制" prop="targetCollect">
        <a-radio-group v-model="formData.targetCollect">
          <a-radio value="1">开</a-radio>
          <a-radio value="0">关</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="扳机预压采集控制" prop="triggerCollect">
        <a-radio-group v-model="formData.triggerCollect">
          <a-radio value="1">开</a-radio>
          <a-radio value="0">关</a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { bizDeviceControlControl } from '@api/control'

export default {
  name: 'DeviceModalDevice',
  components: {
    BizModal
  },
  data() {
    return {
      title: "设备控制",
      visible: false,
      loadingModal: false,
      rules: {
        shootControl: [
          {
            required: true, message: '请选择击发控制', trigger: "blur"
          }
        ],
        soundControl: [
          {
            required: true, message: '请选择音效控制', trigger: "blur"
          }
        ],
        indicateTargetControl: [
          {
            required: true, message: '请选择报靶控制', trigger: "blur"
          }
        ],
        targetCollect: [
          {
            required: true, message: '请选择靶机倾角采集控制', trigger: "blur"
          }
        ],
        triggerCollect: [
          {
            required: true, message: '请选择扳机预压采集控制', trigger: "blur"
          }
        ],
      },
      formData: {
        shootControl: '',
        soundControl: '',
        indicateTargetControl: '',
        targetCollect: '',
        triggerCollect: '',
        tabletPcNumStrs: ''
      }
    }
  },
  methods: {
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      this.$refs.form.validate(v => {
        if (v) {
          this.loadingModal = true
          bizDeviceControlControl(this.formData).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.handleCancel()
              this.$emit("list")
            }else {
              this.$message.warning(res.message)
            }
            this.loadingModal = false
          })
        }
      })
    },
    init (row, result) {
      console.log(row)
      this.loadingModal = false
      this.visible = true
      this.$nextTick(() => {
        for (const key in this.formData) {
          this.formData[key] = ""
        }
        if (result) {
          const {bizDeviceControl} = result
          if (bizDeviceControl) {
            for (const key in this.formData) {
              if (bizDeviceControl[key] !== null || bizDeviceControl[key] !== undefined) {
                this.formData[key] = String(bizDeviceControl[key])
              }
            }
          }else {
            for (const key in this.formData) {
              this.formData[key] = ""
            }
          }
        }
        this.$refs.form.clearValidate()
        this.formData.tabletPcNumStrs = row
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>