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

      <a-form-model-item label="平板编号" prop="pcNum">
        <a-input :disabled="type === 1" v-model="formData.pcNum"></a-input>
      </a-form-model-item>
      <a-form-model-item label="平板名称" prop="pcName">
        <a-input v-model="formData.pcName"></a-input>
      </a-form-model-item>

      <a-form-model-item label="激光训练器类型" prop="deviceGunType">
        <a-select showSearch v-model="formData.deviceGunType">
          <a-select-option value="0">长款激光训练器</a-select-option>
          <a-select-option value="1">短款激光训练器</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="单位名称" prop="departId">
        <j-select-depart
          modelPlaceholder='请输入单位名称按回车进行搜索'
          title='选择单位'
          placeholder='请点击选择单位'
          v-model="formData.departId"
          :multi="true"
          @back="backDepartInfo"
          :backDepart="true"
          :treeOpera="true"
        ></j-select-depart>
      </a-form-model-item>


      <a-form-model-item label="激光训练器编号" prop="deviceNum0">
        <a-select showSearch v-model="formData.deviceNum0" @change="handleDeviceChange">
          <a-select-option
            v-for="item in types.device.filter(item => item.deviceType === '0')"
            :key="item.deviceId"
            :value="item.deviceNum"
          >{{ item.deviceNum }} - {{ item.deviceGunType === '0'? '长款激光训练器' : item.deviceGunType === '1'? '短款激光训练器' : '' }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="激光接收靶编号" prop="deviceNum1">
        <a-select showSearch v-model="formData.deviceNum1">
          <a-select-option
            v-for="item in types.device.filter(item => item.deviceType === '1')"
            :key="item.deviceId"
            :value="item.deviceNum"
          >{{ item.deviceNum }}</a-select-option>
        </a-select>
      </a-form-model-item>

<!--      <a-form-model-item label="平板状态" prop="tabletPcStatus">
&lt;!&ndash;        <a-input v-model="formData.tabletPcStatus"></a-input>&ndash;&gt;
        <a-select v-model="formData.tabletPcStatus">
          <a-select-option
            v-for="item in tabletPcStatus"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>-->
<!--      <a-form-model-item
        label="当前模式"
        prop="tabletPcModel"
        :rules="{ required: formData.tabletPcStatus === '1', message: '请选择当前模式', trigger: 'blur' }"
      >
        <a-select v-model="formData.tabletPcModel">
          <a-select-option
            v-for="item in tabletPcModel"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>-->
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
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      tabletPcStatus,
      tabletPcModel,
      title: "",
      visible: false,
      type: 0,
      formData: {
        // tabletPcStatus: '',
        // tabletPcNum: '',
        // tabletPcName: '',
        deviceGunType: '',
        // deviceNum: '',
        deviceNum0: '',
        deviceNum1: "",
        pcId: '',
        // tabletPcModel: '',

        departId: "",
        departName: "",
        pcName: "",
        pcNum: ""
      },
      rules: {
        tabletPcStatus: [
           { required: true, message: '请选择平板状态', trigger: 'blur' }
        ],
        pcNum: [
           { required: true, message: '请输入平板编号', trigger: 'blur' }
        ],
        pcName: [
           { required: false, message: '请输入平板名称', trigger: 'blur' }
        ],
        deviceNum0: [
           { required: true, message: '请选择激光训练器编号', trigger: 'blur' }
        ],
        deviceNum1: [
          { required: true, message: '请选择激光接收靶编号', trigger: 'blur' }
        ],
        departId: [
          { required: true, message: '请选择单位名称', trigger: 'blur' }
        ]
        // tabletPcModel: [
        //   { required: true, message: '请选择当前模式', trigger: 'blur' }
        // ]
      }
    }
  },
  watch: {
    'formData.deviceNum0': {
      handler (v) {
        setTimeout(() => {
          if (this.types['device'] && this.types['device'].length) {
            const device = this.types.device.filter(item => item.deviceType === '0')
            const row = device.filter(item => item.deviceNum === v)[0]
            this.formData.deviceGunType = row.deviceGunType
          }
        },50)
        /* this.$nextTick(() => {
          if (this.types['device'] && this.types['device'].length) {
            const device = this.types.device.filter(item => item.deviceType === '0')
            const row = device.filter(item => item.deviceNum === v)[0]
            this.formData.deviceGunType = row.deviceGunType
          }
        }) */
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    backDepartInfo(info) {
      if (info.length) {
        // this.formData.departId = info[0].value
        // this.formData.departName = info[0].text
        this.formData.departId = info.map(item => item.value).join(',')
        this.formData.departName = info.map(item => item.text).join(',')
      }
    },
    handleOk() {
      this.$refs.form.validate(v => {
        if (v) {
          this.loadingModal = true
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
        this.$message.error(res.message)
      }
      this.loadingModal = false
    },
    handleDeviceChange(v) {
      const device = this.types.device.filter(item => item.deviceType === '0')
      const row = device.filter(item => item.deviceNum === v)[0]
      this.formData.deviceGunType = row.deviceGunType
    }
  }
}
</script>

<style scoped lang="scss">

</style>