<template>
  <BizModal
    title="参数配置"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
    :width="600"
  >
    <a-form-model
      ref='form'
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules='rules'
    >
      <a-form-model-item label="平板标识" prop="defid">
        <a-input v-model="formData.defid" placeholder="请输入平板标识" />
      </a-form-model-item>
      <a-form-model-item label="清靶模式" prop="clearTargetMode">
        <a-radio-group v-model="formData.clearTargetMode">
          <a-radio :value="0">不清理</a-radio>
          <a-radio :value='1'>自动</a-radio>
          <a-radio :value='2'>手动</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="自动放大" prop="isAutoBlowUp">
        <a-radio-group v-model="formData.isAutoBlowUp">
          <a-radio :value="0">非自动放大</a-radio>
          <a-radio :value='1'>自动放大</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="瞄准" prop="isShowAimTrack">
        <a-radio-group v-model="formData.isShowAimTrack">
          <a-radio :value="0">隐藏</a-radio>
          <a-radio :value='1'>显示</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="快捷按钮" prop="isShowFastCtrl">
        <a-radio-group v-model="formData.isShowFastCtrl">
          <a-radio :value="0">不显示</a-radio>
          <a-radio :value='1'>显示</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="靶点显隐" prop="isShowHistoryTargetSpot">
        <a-radio-group v-model="formData.isShowHistoryTargetSpot">
          <a-radio :value="0">正常显示</a-radio>
          <a-radio :value='1'>只显示最新靶点</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="弹孔发序" prop="isShowTargetSerial">
        <a-radio-group v-model="formData.isShowTargetSerial">
          <a-radio :value="0">不显示发序</a-radio>
          <a-radio :value='1'>显示发序</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="压力曲线" prop="isShowTriggerPressure">
        <a-radio-group v-model="formData.isShowTriggerPressure">
          <a-radio :value="0">隐藏</a-radio>
          <a-radio :value='1'>显示</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="大小模式" prop="targetSpotSize">
        <a-radio-group v-model="formData.targetSpotSize">
          <a-radio :value="0">大</a-radio>
          <a-radio :value='1'>小</a-radio>
          <a-radio :value='2'>混合</a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { bizDeviceControlSendPcSet } from '@api/biz'

export default {
  name: 'DeviceArgument',
  components: {
    BizModal
  },
  data() {
    return {
      visible: false,
      loadingModal: false,
      list: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      rules: {
        defid: [{
          required: true,
          message: '请输入平板标识',
          trigger: 'blur'
        }],
        clearTargetMode: [{
          required: true,
          message: '请选择清靶模式',
          trigger: 'blur'
        }],
        isAutoBlowUp: [{
          required: true,
          message: '请选择自动放大',
          trigger: 'blur'
        }],
        isShowAimTrack: [{
          required: true,
          message: '请选择自动放大',
          trigger: 'blur'
        }],
        isShowFastCtrl: [{
          required: true,
          message: '请选择快捷按钮',
          trigger: 'blur'
        }],
        isShowHistoryTargetSpot: [{
          required: true,
          message: '请选择靶点显隐',
          trigger: 'blur'
        }],
        isShowTargetSerial: [{
          required: true,
          message: '请选择弹孔发序',
          trigger: 'blur'
        }],
        isShowTriggerPressure: [{
          required: true,
          message: '请选择压力曲线',
          trigger: 'blur'
        }],
        targetSpotSize: [{
          required: true,
          message: '请选择大小模式',
          trigger: 'blur'
        }],
      },
      formData: {
        clearTargetMode: "",
        defid: "",
        isAutoBlowUp: "",
        isShowAimTrack: "",
        isShowFastCtrl: "",
        isShowHistoryTargetSpot: "",
        isShowTargetSerial: "",
        isShowTriggerPressure: "",
        targetSpotSize: ""
      }
    }
  },
  methods: {
    userInit(list) {
      if (list.length) {
        this.list = list.map(item => item.tabletPcNum)
      }
      this.visible = true
      for (const key in this.formData) {
        this.formData[key] = 0
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
        this.formData.targetSpotSize = 1
        this.formData.isShowTargetSerial = 1
        this.formData.defid = ""
        // this.formData.isShowTriggerPressure = 0
        // this.formData.isShowTargetSerial = 0
        // this.formData.isShowHistoryTargetSpot = 0
        // this.formData.isShowFastCtrl = 0
        // this.formData.isShowAimTrack = 0
        // this.formData.isAutoBlowUp = 0
        // this.formData.clearTargetMode = 0
      })
    },
    handleOk() {
      console.log(this.list)
      console.log(this.formData)
      bizDeviceControlSendPcSet({
        set: this.formData,
        tabletPcNumStrs: this.list.join(',')
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message || "发送平板参数成功")
          this.visible = false
          // this
          this.$emit('list')
        }else {
          this.$message.warning(res.message)
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang='scss'>

</style>