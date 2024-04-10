<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
    :width="600"
  >
    <div style="height: 100%;overflow-y: auto;padding-right: 20px">
      <div v-if="type === 0">
        <a-form-model
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          ref='form'
          :model="form"
          :rules="rules"
        >
          <a-form-model-item label="平板模式" prop='model'>
            <a-radio-group v-model="form.model">
              <a-radio value="试射">试射</a-radio>
              <a-radio value='比赛'>比赛</a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div v-if="type === 1">
        <a-form-model
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          ref='form'
          :model="form"
          :rules="rules"
        >
          <a-form-model-item label="项目名称" prop="projectId">
            <a-select v-model="form.projectId" @change="handleChange">
              <a-select-option
                v-for="item in projectList"
                :key="item.projectId"
                :value="item.projectId"
              >{{ item.projectName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="弹药组数" prop="groupNum">
            <a-input
              v-model="form.groupNum"
              oninput="value=value.replace(/[^\d]/g,'')"
            />
          </a-form-model-item>
          <a-form-model-item label="每组数量" prop="shootNum">
            <a-input
              v-model="form.shootNum"
              oninput="value=value.replace(/[^\d]/g,'')"
            />
          </a-form-model-item>
          <a-form-model-item label="弹药总数" prop="totalShootNum">
            <a-input
              v-model="form.totalShootNum"
              oninput="value=value.replace(/[^\d]/g,'')"
            />
          </a-form-model-item>
          <a-form-model-item label="阶段模式" prop="stageNum">
            <a-radio-group v-model="form.stageNum">
              <a-radio :value="1">资格赛</a-radio>
              <a-radio :value='2'>决赛</a-radio>
              <a-radio :value='3'>混团</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="计分方式" prop="scoreModel">
            <a-radio-group v-model="form.scoreModel">
              <a-radio :value="1">大环</a-radio>
              <a-radio :value='2'>小环</a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div v-if="type === 2">
        <a-form-model
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          ref='form'
          :model="form"
          :rules="rules"
        >
          <a-form-model-item label="用户名称" prop="username">
            <a-input
              v-model="form.username"
            />
          </a-form-model-item>
          <a-form-model-item label="用户姓名" prop="name">
            <a-input
              v-model="form.name"
            />
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
  </BizModal>

</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import {
  bizDeviceControlModelControl,
  bizDeviceControlProjectControl,
  bizDeviceControlUserControl,
  bizProjectList
} from '@api/biz'

export default {
  name: 'DeviceModalCut',
  components: {
    BizModal
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      visible: false,
      loadingModal: false,
      title: "",
      type: 0,
      list: [],
      projectList: [],
      form: {
        // 0
        model: "",
        // 1
        projectId: "",
        projectName: "",
        groupNum: "",
        shootNum: "",
        totalShootNum: "",
        stageNum: "",
        scoreModel: "",
        // 2
        username: "",
        name: ""
      },
      rules: {
        model: [
          { required: true, message: '请选择平板模式', trigger: 'change' },
        ],
        projectId: [
          { required: true, message: '请选择项目名称', trigger: 'change' },
        ],
        groupNum: [
          { required: true, message: '请输入弹药组数', trigger: 'change' },
        ],
        shootNum: [
          { required: true, message: '请输入弹药数量', trigger: 'change' },
        ],
        totalShootNum: [
          { required: true, message: '请输入弹药总数', trigger: 'change' },
        ],
        stageNum: [
          { required: true, message: '请选择阶段模式', trigger: 'change' },
        ],
        scoreModel: [
          { required: true, message: '请选择计分方式', trigger: 'change' },
        ],
        username: [
          { required: true, message: '请输入用户名称', trigger: 'change' },
        ],
        name: [
          { required: true, message: '请输入用户姓名', trigger: 'change' },
        ]
      }
    }
  },
  methods: {
    // 模式切换
    slabInit (list) {
      this.type = 0
      this.title = "模式切换"
      this.visible = true
      if (list.length) {
        this.list = list.map(item => item.tabletPcNum)
      }
      this.form = {
        // 0
        model: "",
        // 1
        projectId: "",
        projectName: "",
        groupNum: "",
        shootNum: "",
        totalShootNum: "",
        stageNum: "",
        scoreModel: "",
        // 2
        username: "",
        name: ""
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    // 项目切换
    projectInit (list) {
      bizProjectList().then(res => {
        this.projectList = res.result
        this.type = 1
        this.visible = true
        this.title = "项目切换"
        if (list.length) {
          this.list = list.map(item => item.tabletPcNum)
        }
        this.form = {
          // 0
          model: "",
          // 1
          projectId: "",
          projectName: "",
          groupNum: "",
          shootNum: "",
          totalShootNum: "",
          stageNum: "",
          scoreModel: "",
          // 2
          username: "",
          name: ""
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      })

    },
    // 用户下发
    userInit (list) {
      this.type = 2
      this.visible = true
      this.title = "用户下发"
      if (list.length) {
        this.list = list.map(item => item.tabletPcNum)
      }
      this.form = {
        // 0
        model: "",
        // 1
        projectId: "",
        projectName: "",
        groupNum: "",
        shootNum: "",
        totalShootNum: "",
        stageNum: "",
        scoreModel: "",
        // 2
        username: "",
        name: ""
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    handleChange(v) {
      const obj = this.projectList.filter(item => item.projectId === v)[0]
      for (const key in this.form) {
        if ( obj[key] ) {
          this.form[key] = obj[key]
        }
      }
    },
    handleOk () {
      console.log(this.$refs)
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.type === 0) {
            bizDeviceControlModelControl({
              model: this.form.model,
              tabletPcNumStrs: this.list.join(',')
            }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message || '模式切换成功')
                this.handleCancel()
                this.$emit('list')
              } else {
                this.$message.error(res.message)
              }
            })
          }
          if (this.type === 1) {
            bizDeviceControlProjectControl({
              tabletPcNumStrs: this.list.join(','),
              projectName: this.form.projectName,
              groupNum: this.form.groupNum,
              shootNum: this.form.shootNum,
              totalShootNum: this.form.totalShootNum,
              stageNum: this.form.stageNum,
              scoreModel: this.form.scoreModel,
            }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message || '项目切换成功')
                this.handleCancel()
                this.$emit('list')
              } else {
                this.$message.error(res.message)
              }
            })
          }
          if (this.type === 2) {
            bizDeviceControlUserControl({
              tabletPcNumStrs: this.list.join(','),
              username: this.form.username,
              name: this.form.name
            }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message || '用户下发成功')
                this.handleCancel()
                this.$emit('list')
              } else {
                this.$message.error(res.message)
              }
            })
          }
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped lang='scss'>

</style>