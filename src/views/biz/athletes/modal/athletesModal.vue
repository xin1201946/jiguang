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
      <a-form-model-item label="姓名" prop="entryName">
        <a-input v-model="formData.entryName"></a-input>
      </a-form-model-item>
      <a-form-model-item label="身份证" prop="entryIdCardNum">
        <a-input v-model="formData.entryIdCardNum"></a-input>
      </a-form-model-item>
      <a-form-model-item label="单位" prop="entryCompany">
        <a-input v-model="formData.entryCompany"></a-input>
      </a-form-model-item>
      <a-form-model-item label="注册号	" prop="entryNum">
        <a-input v-model="formData.entryNum"></a-input>
      </a-form-model-item>
      <a-form-model-item label="性别" prop="entrySex">
        <a-select v-model="formData.entrySex">
          <a-select-option
            v-for="item in sexData"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="身份" prop="entryType">
        <a-select v-model="formData.entryType">
          <a-select-option
            v-for="item in typeData"
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
import { bizEntryFormSave, bizEntryFormUpdate } from '@api/biz'
import BizModal from '@comp/modal/BizModal.vue'
import {sexData, typeData} from '../athletes.config'
import bizMixins from '@views/biz/bizMixins'
export default {
  name: 'athletesModal',
  components: {
    BizModal
  },
  mixins: [bizMixins],
  data() {
    return {
      sexData,
      typeData,
      visible: false,
      title: '',
      type: 0,
      formData: {
        entrySex: '',
        entryType: '',
        entryName: '',
        entryIdCardNum: '',
        entryCompany: '',
        entryNum: '',
        entryFormId: undefined
      },
      rules: {
        entrySex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        entryType: [{ required: true, message: '请选择身份', trigger: 'blur' }],
        entryName: [{ required: true, message: '请输入姓名',trigger: 'blur' }],
        entryIdCardNum: [
          { required: true, message: '请输入身份证号',trigger: 'change' },
          { pattern: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0\d|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/, message: '请输入正确的身份证号',trigger: 'blur' }
        ],
        entryNum: [{ required: true, message: '请输入注册号' ,trigger: 'blur'}],
        entryCompany: [{ required: true, message: '请输入单位', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleOk() {
      this.$refs.form.validate((v) => {
        if (v) {
          this.loadingModal = true
          if (this.type === 0) {
            const data = JSON.parse(JSON.stringify(this.formData))
            delete data.entryFormId
            bizEntryFormSave(data).then(res => {
              if (res.code === 200) {
                this.$message.success("添加成功")
                this.handleCancel()
                this.$emit("list")
              }else {
                this.$message.error(res.message)
              }
              this.loadingModal = false
            })
          }else{
            bizEntryFormUpdate(this.formData).then(res => {
              if (res.code === 200) {
                this.$message.success('编辑成功')
                this.handleCancel()
                this.$emit("list")
              }else {
                this.$message.error(res.message)
              }
              this.loadingModal = false
            })
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>



<style scoped lang="scss">

</style>