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
      :wrapperCol="{span: 14, offset: 0}"
      :rules="rules"
      ref="form"
      :model="formData"
    >
      <a-form-model-item v-if="false" label="项目名称">
        <a-input v-model="formData.projectName"></a-input>
      </a-form-model-item>
      <a-form-model-item label="项目名称" prop="projectId">
        <a-select v-model="formData.projectId" @change="handleChange">
          <a-select-option
            v-for="item in projectList"
            :key="item.projectId"
            :value="item.projectId"
          >{{ item.projectName }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="进程控制" prop="tabletPcModel">
        <a-select v-model="formData.tabletPcModel">
          <a-select-option value="0">试射</a-select-option>
          <a-select-option value="1">比赛</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="弹药数量" prop="ammo">
        <a-input
          v-model="formData.ammo"
          oninput="value=value.replace(/[^\d]/g,'')"
        />
      </a-form-model-item>
      <a-form-model-item label="组数" prop="groupCount">
        <a-input
          v-model="formData.groupCount"
          oninput="value=value.replace(/[^\d]/g,'')"
        />
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import { bizProjectList } from '@api/biz'
import BizModal from '@comp/modal/BizModal.vue'
import { bizTabletProjectControl } from '@api/control'
export default {
  name: 'deviceModalProject',
  components: {
    BizModal
  },
  data() {
    return {
      title: "项目控制",
      visible: false,
      loadingModal: false,
      rules: {
        projectId: [
          {
            required: true, message: '请选择项目名称', trigger: "blur"
          }
        ],
        groupCount: [
          {
            required: true, message: '请输入组数', trigger: "blur"
          }
        ],
        tabletPcModel: [
          {
            required: true, message: '请选择当前模式', trigger: "blur"
          }
        ],
        ammo: [
          {
            required: true, message: '请输入弹药数量', trigger: "blur"
          }
        ]
      },
      projectList: [],
      formData: {
        ammo: '',
        groupCount: '',
        tabletPcNumStrs: '',
        projectName: '',
        projectId: '',
        tabletPcModel: ''
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
          bizTabletProjectControl(this.formData).then(res => {
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
    handleChange(v) {
      const obj = this.projectList.filter(item => item.projectId === v)[0]
      console.log(obj)
      for (const key in this.formData) {
        if ( obj[key]) {
          this.formData[key] = obj[key]
        }
      }
    },
    init (row, result) {
      this.loadingModal = false
      this.visible = true
      bizProjectList().then(res => {
        this.projectList = res.result
        this.$nextTick(() => {
          for (const key in this.formData) {
            this.formData[key] = ""
          }
          if (result) {
            const {
              bizTabletProject,
              bizTabletPc
            } = result
            this.formData.ammo = bizTabletProject.ammo
            this.formData.projectId = Number(bizTabletProject.projectId)
            this.formData.projectName = bizTabletProject.projectName
            this.formData.groupCount = bizTabletProject.groupCount
            this.formData.tabletPcModel = bizTabletPc.tabletPcModel
          }
          this.$refs.form.clearValidate()
          this.formData.tabletPcNumStrs = row
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>