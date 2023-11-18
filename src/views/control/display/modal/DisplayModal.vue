<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <a-form-model :labelCol="{ span: 6 }" :wrapperCol="{ span: 14, offset: 2 }" :rules="rules" ref="form" :model="formData">
      <a-form-model-item label="平板编号" prop="tabletPcNum">
        <a-select v-model="formData.tabletPcNum">
          <a-select-option v-for="item in types.tablePc" :value="item.tabletPcNum" :key="item">
            {{ item.tabletPcNum }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="瞄准曲线" prop="aimCurveShow">
        <a-radio-group name="aimCurveShow" v-model="formData.aimCurveShow">
          <a-radio v-for="item of aimCurveShow" :value="item.value" :key="item">{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="自动放大" prop="autoAmplify">
        <a-radio-group name="aimCurveShow" v-model="formData.autoAmplify">
          <a-radio v-for="item of autoAmplify" :value="item.value" :key="item">{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="清靶模式" prop="clearTargetWay">
        <a-radio-group name="aimCurveShow" v-model="formData.clearTargetWay">
          <a-radio v-for="item of clearTargetWay" :value="item.value" :key="item">{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="发序" prop="sequenceShow">
        <a-radio-group name="aimCurveShow" v-model="formData.sequenceShow">
          <a-radio v-for="item of sequenceShow" :value="item.value" :key="item">{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="压力曲线" prop="stressCurveShow">
        <a-radio-group name="aimCurveShow" v-model="formData.stressCurveShow">
          <a-radio v-for="item of stressCurveShow" :value="item.value" :key="item">{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="靶点显隐" prop="targetShow">
        <a-radio-group name="aimCurveShow" v-model="formData.targetShow">
          <a-radio v-for="item of targetShow" :value="item.value" :key="item">{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="靶点大小" prop="targetSize">
        <a-radio-group name="aimCurveShow" v-model="formData.targetSize">
          <a-radio v-for="item of targetSize" :value="item.value" :key="item">{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import BizMixins from '@views/biz/bizMixins'
import { displaySave, displayUpdate } from '@api/control'
import {
  aimCurveShow,
  autoAmplify,
  clearTargetWay,
  sequenceShow,
  stressCurveShow,
  targetShow,
  targetSize
} from '@views/control/display/display.config'
export default {
  name: 'displayModal',
  mixins: [BizMixins],
  components: {
    BizModal
  },
  data() {
    return {
      aimCurveShow,
      autoAmplify,
      clearTargetWay,
      sequenceShow,
      stressCurveShow,
      targetShow,
      targetSize,
      title: '',
      type: 0,
      visible: false,
      formData: {
        deviceDisplayId: '',
        tabletPcNum: '',
        targetSize: '',
        targetShow: '',
        stressCurveShow: '',
        sequenceShow: '',
        clearTargetWay: '',
        autoAmplify: '',
        aimCurveShow: ''
      },
      rules: {
        tabletPcNum: [
          { required: true, message: '请选择报靶控制', trigger: 'blur' }
        ],
        targetSize: [
          { required: true, message: '请选择报靶控制', trigger: 'blur' }
        ],
        targetShow: [
          { required: true, message: '请选择报靶控制', trigger: 'blur' }
        ],
        stressCurveShow: [
          { required: true, message: '请选择报靶控制', trigger: 'blur' }
        ],
        sequenceShow: [
          { required: true, message: '请选择报靶控制', trigger: 'blur' }
        ],
        clearTargetWay: [
          { required: true, message: '请选择报靶控制', trigger: 'blur' }
        ],
        autoAmplify: [
          { required: true, message: '请选择报靶控制', trigger: 'blur' }
        ],
        aimCurveShow: [
          { required: true, message: '请选择报靶控制', trigger: 'blur' }
        ],
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
          if (this.type === 0) {
            const data = JSON.parse(JSON.stringify(this.formData))
            delete data.deviceDisplayId
            displaySave(data).then(this.callback)
          }
          if (this.type === 1) {
            displayUpdate(this.formData).then(this.callback)
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>