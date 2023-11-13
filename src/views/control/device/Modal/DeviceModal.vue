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
      <a-form-model-item label="平板编号" prop="tabletPcNum">
        <a-select v-model="formData.tabletPcNum">
          <a-select-option
            v-for="item in types.tablePc"
            :value="item.tabletPcNum"
          >
            {{ item.tabletPcNum }}
          </a-select-option>
        </a-select>
<!--        tabletPcNum-->
      </a-form-model-item>
      <a-form-model-item label="报靶控制" prop="indicateTargetControl">
        <a-radio-group
          name="indicateTargetControl"
          v-model="formData.indicateTargetControl"
        >
          <a-radio
            v-for="item of indicateTargetControl"
            :value="item.value"
          >{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="击发控制" prop="shootControl">
        <a-radio-group
          name="shootControl"
          v-model="formData.shootControl">
          <a-radio
            v-for="item of shootControl"
            :value="item.value"
          >{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="音效控制" prop="soundControl">
        <a-radio-group
          name="soundControl"
          v-model="formData.soundControl"
        >
          <a-radio
            v-for="item of soundControl"
            :value="item.value"
          >{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="靶机倾角采集" prop="targetCollect">
        <a-radio-group
          name="targetCollect"
          v-model="formData.targetCollect"
        >
          <a-radio
            v-for="item of targetCollect"
            :value="item.value"
          >{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="扳机预压采集" prop="triggerCollect">
        <a-radio-group
          name="triggerCollect"
          v-model="formData.triggerCollect"
        >
          <a-radio
            v-for="item of triggerCollect"
            :value="item.value"
          >{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import BizMixins from '@views/biz/bizMixins'
import {
  indicateTargetControl,
  shootControl,
  soundControl,
  targetCollect,
  triggerCollect
} from '@views/control/device/device.config'
import { controlSave, controlUpdate } from '@api/control'

export default {
  name: 'deviceModal',
  components: {
    BizModal
  },
  mixins: [BizMixins],
  data() {
    return {
      shootControl,
      indicateTargetControl,
      soundControl,
      targetCollect,
      triggerCollect,
      visible: false,
      title: '',
      type: 0,
      rules: {
        indicateTargetControl: [
          { required: true, message: '请选择报靶控制', trigger: 'blur' }
        ],
        shootControl: [
          { required: true, message: '请选择击发控制', trigger: 'blur' }
        ],
        soundControl: [
          { required: true, message: '请选择音效控制', trigger: 'blur' }
        ],
        tabletPcNum: [
          { required: true, message: '请选择平板编号', trigger: 'blur' }
        ],
        targetCollect: [
          { required: true, message: '请选择靶机倾角采集', trigger: 'blur' }
        ],
        triggerCollect: [
          { required: true, message: '请选择triggerCollect', trigger: 'blur' }
        ]
      },
      formData: {
        deviceControlId: '',
        indicateTargetControl: '',
        shootControl: '',
        soundControl: '',
        tabletPcNum: '',
        targetCollect: '',
        triggerCollect: ''
      }
    }
  },
  methods: {
    handleOk() {
      this.$refs.form.validate( v => {
        if (v) {
          if (this.type === 0) {
            const data = JSON.parse(JSON.stringify(this.formData))
            delete data.deviceControlId
            controlSave(data).then(this.callback)
          }
          if (this.type === 1) {
            controlUpdate(this.formData).then(this.callback)
          }
        }
      })
      // this.handleCancel()
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">

</style>