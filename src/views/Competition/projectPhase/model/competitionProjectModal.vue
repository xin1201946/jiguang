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
      :wrapperCol="{span: 18}"
      :rules="rules"
      ref="form"
      :model="formData"
    >
      <a-form-model-item v-if="false" label="项目名称">
        <a-input v-model="formData.projectName"></a-input>
      </a-form-model-item>

      <a-form-model-item  label="比赛项目" prop="projectId">
        <a-select
          v-model="formData.projectId"
          @change="handleProjectChange"
        >
          <a-select-option
            v-for="item in projectList"
            :key="item.projectId"
            :value="item.projectId"
          >
            {{ item.projectName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="比赛模式" prop="mode">
        <a-select v-model="formData.mode">
          <a-select-option value="0">个人赛</a-select-option>
          <a-select-option value="1">混团赛</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="项目组别" prop="projectGroup">
        <a-select v-model="formData.projectGroup">
          <a-select-option v-for="(item, i) in formData.mode === '1'? projectGroup1 : projectGroup" :value="item.value" :key="i">{{item.value}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="选手上限" prop="playerLimit">
        <a-input
          oninput="value=value.replace(/[^\d]/g,'')"
          v-model="formData.playerLimit"></a-input>
      </a-form-model-item>
      <a-form-model-item v-if="formData.mode !== '1'" label="团队人数" prop="groupSize">
        <a-input
          oninput="value=value.replace(/[^\d]/g,'')"
          v-model="formData.groupSize"></a-input>
      </a-form-model-item>
      <a-form-model-item label="设备数量" prop="deviceNum">
        <a-input
          oninput="value=value.replace(/[^\d]/g,'')"
          v-model="formData.deviceNum"></a-input>
      </a-form-model-item>
      <a-form-model-item label="比赛时间" prop="projectTime">
        <a-range-picker
          v-model="formData.projectTime"
          :showTime="showTime"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :disabledDate="disabledDate"
          :disabledTime="disabledTime"
        ></a-range-picker>
      </a-form-model-item>

    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { bizContestProjectSave, bizContestProjectUpdate, bizContestQueryById } from '@api/competition'
import { bizProjectList } from '@api/biz'
import dayjs from 'dayjs'
import { projectGroup } from '@views/Competition/participant/participant.config'

const projectGroup1 = [
  {
    label: "甲组",
    value: "甲组"
  },
  {
    label: "乙组",
    value: "乙组"
  },
  {
    label: "丙组",
    value: "丙组"
  },
]

export default {
  name: 'competitionProjectModal',
  components: {
    BizModal
  },
  data() {
    return {
      projectGroup1,
      projectGroup,
      title: "",
      visible: false,
      loading: false,
      type: 0,
      times: '',
      timeStart: '',
      formData: {
        deviceNum: "",
        groupSize: "",
        mode: "",
        playerLimit: "",
        projectName: "",
        projectTime: [],
        projectId: "",
        cproId: "",
        projectGroup: ''
      },
      rules: {
        projectGroup: [
          { required: true, message: '请选择项目组别', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '请选择比赛项目', trigger: 'blur' }
        ],
        playerLimit: [
          { required: true, message: '请输入选手上限', trigger: 'blur' }
        ],
        groupSize: [
          { required: true, message: '请输入团队人数', trigger: 'blur' }
        ],
        deviceNum: [
          { required: true, message: '请输入设备数量', trigger: 'blur' }
        ],
        projectTime: [
          { required: true, message: '请选择比赛时间', trigger: 'blur' }
        ],
        mode: [
          { required: true, message: '请选择比赛模式', trigger: 'blur' }
        ]
      },
      projectList: [],
      start: '',
      end: ''
    }
  },
  computed: {
    showTime () {
      return {
        format: 'HH:mm:ss',
        valueFormat: 'HH:mm:ss',
      }
    }
  },
  methods: {
    disabledTime(dates, partial) {
      if (partial === 'start'){
        return {
          disabledHours: this.disabledHours,
          disabledMinutes: this.disabledMinutes,
          disabledSeconds: this.disabledSeconds
        }
      }
      if (partial === 'end'){
        return {
          disabledHours: this.disabledHoursEnd,
          disabledMinutes: this.disabledMinutesEnd,
          disabledSeconds: this.disabledSecondsEnd
        }
      }
    },
    // 结束秒数禁用
    disabledSecondsEnd(selectedHour, selectedMinute) {
      if (dayjs(this.end).format('YYYY-MM-DD') === dayjs(this.formData.projectTime[1]).format('YYYY-MM-DD')){
        const h = dayjs(this.end).format('HH')
        const m = dayjs(this.end).format('mm')
        const s = dayjs(this.end).format('ss')
        if (Number(h) === Number(selectedHour)) {
          if (Number(m) === Number(selectedMinute)) {
            const arr = []
            for (let i = 0; i < 60; i++) {
              if (i > Number(s)) {
                arr.push(i)
              }
            }
            return arr
          }
        }
      }
      return []
    },
    // 开始秒数禁用
    disabledSeconds(selectedHour, selectedMinute) {
      if (dayjs(this.start).format('YYYY-MM-DD') === dayjs(this.formData.projectTime[0]).format('YYYY-MM-DD')) {
        const h = dayjs(this.start).format('HH')
        const m = dayjs(this.start).format('mm')
        const s = dayjs(this.start).format('ss')
        if (Number(h) === Number(selectedHour)) {
          if (Number(m) === Number(selectedMinute)) {
            const arr = []
            for (let i = 0; i < 60; i++) {
              if (i < Number(s)) {
                arr.push(i)
              }
            }
            return arr
          }
        }
      }
      return []
    },
    // 结束分钟禁用
    disabledMinutesEnd(selectedHour) {
      if (dayjs(this.end).format('YYYY-MM-DD') === dayjs(this.formData.projectTime[1]).format('YYYY-MM-DD')) {
        const h = dayjs(this.end).format('HH')
        if (Number(h) === Number(selectedHour)) {
          const m = dayjs(this.end).format('mm')
          const arr = []
          for (let i = 0; i < 60; i++) {
            if (i > Number(m)) {
              arr.push(i)
            }
          }
          return arr
        }
      }
      return []
    },
    // 开始分钟禁用
    disabledMinutes(selectedHour) {
      if (dayjs(this.start).format('YYYY-MM-DD') === dayjs(this.formData.projectTime[0]).format('YYYY-MM-DD')) {
        const h = dayjs(this.start).format('HH')
        if (Number(h) === Number(selectedHour)) {
          const m = dayjs(this.start).format('mm')
          const arr = []
          for (let i = 0; i < 60; i++) {
            if (i < Number(m)) {
              arr.push(i)
            }
          }
          return arr
        }
      }
      return []
    },
    // 结束小时禁用
    disabledHoursEnd() {
      if (dayjs(this.end).format('YYYY-MM-DD') === dayjs(this.formData.projectTime[1]).format('YYYY-MM-DD')) {
        const h = dayjs(this.end).format('HH')
        const m = dayjs(this.end).format('mm')
        let arr = []
        for (let i = 0; i< 24; i++) {
          if (i > Number(h)) {
            arr.push(i)
          }
        }
        return arr
      }
      return []
    },
    // 开始小时禁用
    disabledHours() {
      const h = dayjs(this.start).format('HH')
      const m = dayjs(this.start).format('mm')
      if (dayjs(this.start).format('YYYY-MM-DD') === dayjs(this.formData.projectTime[0]).format('YYYY-MM-DD')) {
        let arr = []
        for (let i = 0; i< 24; i++) {
          if (i < Number(h)) {
            arr.push(i)
          }
        }
        return arr
      }
      return []
    },
    // 不可选择的日期
    disabledDate(current) {
      if (dayjs(current).format("YYYY-MM-DD HH:mm:ss") < dayjs(this.timeStart).format("YYYY-MM-DD HH:mm:ss")) {
        return  true
      }
      if (dayjs(current).format("YYYY-MM-DD HH:mm:ss") > dayjs(this.times).add(1, 'day').format("YYYY-MM-DD HH:mm:ss")) {
        return  true
      }
    },
    handleOk() {
      console.log(this.formData)
      this.$refs.form.validate(v => {
        if (v) {
          this.loading = true
          if (this.type === 0) {
            const data = JSON.parse(JSON.stringify(this.formData))
            data.projectTimeStart = data.projectTime[0]
            data.projectTimeEnd = data.projectTime[1]
            delete data.projectTime
            data.contestId = this.$route.query.id
            delete data.cproId
            bizContestProjectSave(data).then(res => {
              if (res.code === 200) {
                this.visible = false
                this.$emit("list")
                this.$message.success(res.message)
              }else {
                this.$message.error(res.message)
              }
              this.loading = false
            })
          }
          if (this.type === 1) {
            const data = JSON.parse(JSON.stringify(this.formData))
            data.projectTimeStart = data.projectTime[0]
            data.projectTimeEnd = data.projectTime[1]
            delete data.projectTime
            data.contestId = this.$route.query.id
            bizContestProjectUpdate(data).then(res => {
              if (res.code === 200) {
                this.visible = false
                this.$emit("list")
                this.$message.success(res.message)
              }else {
                this.$message.error(res.message)
              }
              this.loading = false
            })
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    getProjectList() {
      return bizProjectList().then(res => {
        this.projectList = res.result
        return
      })
    },
    handleProjectChange(v) {
      const a = this.projectList.filter(item => item.projectId === v)[0]
      this.formData.projectName = a.projectName
    },
    init() {
      this.visible = true
      this.loading = false
      this.type = 0
      this.title = "添加比赛项目"
      this.$nextTick(() => {
        bizContestQueryById(this.$route.query.id).then(res => {
          this.times = res.result.contestTimeEnd
          this.timeStart = res.result.contestTimeStart
          this.start = res.result.contestTimeStart
          this.end = res.result.contestTimeEnd
          this.getProjectList().then(() => {
            for (const key in this.formData) {
              if (Array.isArray(this.formData[key])) {
                this.formData[key] = []
              }else {
                this.formData[key] = ''
              }
            }
            if (this.$refs.form) {
              this.$refs.form.clearValidate()
            }
          })
        })
      })
    },
    edit(row) {
      this.visible = true
      this.loading = false
      this.type = 1
      this.title = "编辑比赛项目"
      const data = JSON.parse(JSON.stringify(row))
      data.projectTime = [row.projectTimeStart, row.projectTimeEnd]
      this.$nextTick(() => {
        bizContestQueryById(this.$route.query.id).then(res => {
          // contestTime
          this.times = res.result.contestTimeEnd
          this.timeStart = res.result.contestTimeStart
          this.start = res.result.contestTimeStart
          this.end = res.result.contestTimeEnd
          this.getProjectList().then(() => {
            for (const key in this.formData) {
              this.formData[key] = data[key]
            }
            if (this.$refs.form) {
              this.$refs.form.clearValidate()
            }
          })
        })

      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>