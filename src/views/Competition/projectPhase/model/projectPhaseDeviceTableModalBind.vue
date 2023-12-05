<template>
  <BizModal
    :title="title"
    :visible="visible"
    :loading="loading"
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
      <a-form-model-item
        label="设备号"
      >
        <a-input disabled v-model="formData.tabletPcNum"></a-input>
      </a-form-model-item>
      <a-form-model-item label="靶位" prop="targetSite">
        <a-input
          oninput="value=value.replace(/[^\d]/g,'')"
          v-model="formData.targetSite"
          suffix=""
        ></a-input>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { bizContestProjectDeviceUpdate } from '@api/competition'
export default {
  name: 'projectPhaseDeviceTableModalBind',
  components: {
    BizModal
  },
  data() {
    return {
      title: "绑定靶位",
      visible: false,
      loading: false,
      rules: {
        targetSite: [
          {
            required: true,
            message: "请输入靶位",
            trigger: 'blur'
          }
        ]
      },
      formData: {
        targetSite: '',
        tabletPcNum: ''
      },
      id: ''
    }
  },
  methods: {
    handleOk() {
      this.$refs.form.validate(v => {
        if (v) {
          this.loading = true
          const data = JSON.parse(JSON.stringify(this.formData))
          bizContestProjectDeviceUpdate({
            ...data,
            cproId: this.id,
            contestId: this.$route.query.id
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('靶位绑定成功')
              this.$emit("list")
              this.visible = false
            }else {
              this.$message.error(res.message)
            }
            this.loading = false
          })
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    bind(row, id) {
      this.visible = true
      this.loading = false
      this.id = id
      this.$nextTick(() => {
        for (const key in row) {
          this.formData[key] = row[key]
        }
        console.log(row)
        this.$refs.form.clearValidate()
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>