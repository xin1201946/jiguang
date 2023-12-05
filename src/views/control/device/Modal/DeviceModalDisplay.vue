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
      <a-form-model-item label="靶点大小" prop="targetSize">
        <a-radio-group v-model="formData.targetSize">
          <a-radio value="0">大</a-radio>
          <a-radio value="1">小</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="靶点显隐" prop="targetShow">
        <a-radio-group v-model="formData.targetShow">
          <a-radio value="1">显</a-radio>
          <a-radio value="0">隐</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="清靶模式" prop="clearTargetWay">
        <a-radio-group v-model="formData.clearTargetWay">
          <a-radio value="1">开</a-radio>
          <a-radio value="0">关</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="瞄准曲线" prop="aimCurveShow">
        <a-radio-group v-model="formData.aimCurveShow">
          <a-radio value="1">显</a-radio>
          <a-radio value="0">隐</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="压力曲线" prop="stressCurveShow">
        <a-radio-group v-model="formData.stressCurveShow">
          <a-radio value="1">显</a-radio>
          <a-radio value="0">隐</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="发序显隐" prop="sequenceShow">
        <a-radio-group v-model="formData.sequenceShow">
          <a-radio value="1">显</a-radio>
          <a-radio value="0">隐</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="自动放大" prop="autoAmplify">
        <a-radio-group v-model="formData.autoAmplify">
          <a-radio value="1">显</a-radio>
          <a-radio value="0">隐</a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { bizDeviceDisplayControl } from '@api/control'

export default {
  name: 'deviceModalDisplay',
  components: {
    BizModal
  },
  data() {
    return {
      title: "显示控制",
      visible: false,
      loadingModal: false,
      rules: {
        targetSize: [
          {
            required: true, message: "请选择靶点大小", trigger: 'blur'
          }
        ],
        targetShow: [
          {
            required: true, message: "请选择靶点显隐", trigger: 'blur'
          }
        ],
        clearTargetWay: [
          {
            required: true, message: "请选择清靶模式", trigger: 'blur'
          }
        ],
        aimCurveShow: [
          {
            required: true, message: "请选择瞄准曲线", trigger: 'blur'
          }
        ],
        stressCurveShow: [
          {
            required: true, message: "请选择压力曲线", trigger: 'blur'
          }
        ],
        sequenceShow: [
          {
            required: true, message: "请选择发序显隐", trigger: 'blur'
          }
        ],
        autoAmplify: [
          {
            required: true, message: "请选择自动放大", trigger: 'blur'
          }
        ],
      },
      formData: {
        tabletPcNumStrs: '',
        targetSize: '',
        targetShow: '',
        clearTargetWay: '',
        aimCurveShow: '',
        stressCurveShow: '',
        sequenceShow: '',
        autoAmplify: ''
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
          bizDeviceDisplayControl(this.formData).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.handleCancel()
              this.$emit("list")
            }else {
              this.$message.error(res.message)
            }
            this.loadingModal = false
          })
        }
      })
    },
    init (row, result) {
      this.loadingModal = false
      this.visible = true
      this.$nextTick(() => {
        for (const key in this.formData) {
          this.formData[key] = ""
        }
        if (result) {
          const {bizDeviceDisplay} = result
          if (bizDeviceDisplay) {
            for (const key in this.formData) {
              if (bizDeviceDisplay[key] !== null || bizDeviceDisplay[key] !== undefined) {
                this.formData[key] = String(bizDeviceDisplay[key])
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