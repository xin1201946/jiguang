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
      <a-form-model-item label="项目名称" prop="projectName">
        <a-input v-model="formData.projectName"></a-input>
      </a-form-model-item>
      <a-form-model-item label="组数" prop="groupCount">
        <a-input oninput="value=value.replace(/[^\d]/g,'')" v-model="formData.groupCount"></a-input>
      </a-form-model-item>
      <a-form-model-item label="弹药数量" prop="ammo">
        <a-input oninput="value=value.replace(/[^\d]/g,'')" v-model="formData.ammo"></a-input>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import bizMixins from '@views/biz/bizMixins'
import BizModal from '@comp/modal/BizModal.vue'
import { bizProjectSave, bizProjectUpdate } from '@api/biz'
export default {
  name: 'projectModal',
  components: {
    BizModal
  },
  mixins: [bizMixins],
  data() {
    return {
      title: "",
      visible: false,
      type: 0,
      formData: {
        projectName: '',
        ammo: '',
        groupCount: '',
        projectId: ''
      },
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        ammo: [
          { required: true, message: '请输入弹药数量', trigger: 'blur' }
        ],
        groupCount: [
          { required: true, message: '请输入组数', trigger: 'blur' }
        ]
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
            delete data.projectId
            bizProjectSave(data).then(this.quit)
          }
          if (this.type === 1) {
            bizProjectUpdate(this.formData).then(this.quit)
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
        this.$message.error(res.message)
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