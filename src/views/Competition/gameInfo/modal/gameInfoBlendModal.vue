<template>
    <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
      <a-form-model :labelCol="{ span: 6 }" :wrapperCol="{ span: 14 }" :rules="rules" ref="form" :model="formData">
       
        <a-form-model-item label="靶位区间">
      
              <a-form-model-item :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
                <a-input v-model="formData.noStr"  placeholder="例如:b,c,f,g"></a-input>
              </a-form-model-item>
       
             
      
        </a-form-model-item>
      </a-form-model>
    </BizModal>
  </template>
  
  <script>
  import BizModal from '@comp/modal/BizModal.vue'
  export default {
    name: 'gameInfoBlendModal',
    components: {
      BizModal,
    },
    data() {
      return {
        title: '抽签',
        visible: false,
        loadingModal: false,
        formData: {},
        rules: {},
      }
    },
    watch: {
    'formData.noStr'(newValue, oldValue) {
      // 当formData.noStr变化时，转换其中的逗号
      if (newValue !== oldValue) {
       
        this.formData.noStr = newValue.replace(/，/g, ',');
       
      }
    }
  },
    methods: {
      
  
      handleOk() {
        this.visible = false
        
        this.$emit('list', this.formData)
      },
      handleCancel() {
        this.visible = false
      },
      init() {
        this.visible = true
        for (const key in this.formData) {
          this.formData[key] = ""
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      },
    },
  }
  </script>
  
  <style scoped lang="less">
  </style>