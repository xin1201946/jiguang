<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
    :widths="width"
    :footer="title !== '详情'"
  >
    <div v-if="type !== 3" class="teamGroupManageModal">
      <a-form-model
        :labelCol="{span: 6}"
        :wrapperCol="{span: 14}"
        :rules="rules"
        ref="form"
        :model="formData"
      >
        <a-form-model-item label="赛事名称">
          <a-input disabled v-model="name"></a-input>
        </a-form-model-item>
        <a-form-model-item label="团队名称" prop="groupName">
          <a-input :disabled="type === 1" v-model="formData.groupName"></a-input>
        </a-form-model-item>
        <a-form-model-item label="教练" prop="coachName">
          <a-input v-model="formData.coachName"></a-input>
        </a-form-model-item>
        <a-form-model-item label="领队" prop="leaderName">
          <a-input v-model="formData.leaderName"></a-input>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div v-else class="teamGroupManageModal">
      <a-descriptions bordered :column="5">
        <a-descriptions-item :span="1" label="团队名称">
          {{ infos.groupName }}
        </a-descriptions-item>
        <a-descriptions-item :span="1" label="教练">
          {{ infos.coachName }}
        </a-descriptions-item>
        <a-descriptions-item :span="1" label="领队">
          {{ infos.leaderName }}
        </a-descriptions-item>
        <a-descriptions-item :span="1" label="总人数">
          {{ infos.groupPlayerCount }}
        </a-descriptions-item>
        <a-descriptions-item :span="1" label="总分数">
          {{ infos.groupScore }}
        </a-descriptions-item>
      </a-descriptions>
      <div style="margin-top: 20px" v-if="infos.groupProjectMap && Object.keys(infos.groupProjectMap).length">
        <div v-for="(item, i) in list" :key="i" style="margin-bottom: 20px">
          <a-descriptions bordered :column="4" :title="item.title" >
            <template v-for="(key, index) in item.list">
              <a-descriptions-item :key="index + '项目'" :span="2" label="项目名称">{{ key.projectName }}</a-descriptions-item>
              <a-descriptions-item :key="index + '人'" :span="1" label="人数">{{ key.gpPlayerCount }}</a-descriptions-item>
              <a-descriptions-item :key="index + '分'" :span="1" label="分数">{{ key.gpScore }}</a-descriptions-item>
            </template>
          </a-descriptions>
        </div>
<!--        <template v-for="item in Object.keys(infos.groupProjectMap)">
          <div style="margin-bottom: 20px">
            <a-descriptions :key="item" bordered :column="4" :title="item">
              <template v-for="(key, i) in infos.groupProjectMap[item]">
                <a-descriptions-item :key="i + '项目'" :span="2" label="项目名称">{{ key.projectName }}</a-descriptions-item>
                <a-descriptions-item :key="i + '人'" :span="1" label="人数">{{ key.gpPlayerCount }}</a-descriptions-item>
                <a-descriptions-item :key="i + '分'" :span="1" label="分数">{{ key.gpScore }}</a-descriptions-item>
              </template>
            </a-descriptions>
          </div>
        </template>-->
      </div>

    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import BizMixins from '@views/biz/bizMixins'
import { bizGroupSave, bizGroupUpdate } from '@api/teamGroup'


export default {
  name: 'teamGroupManageModal',
  components: {
    BizModal
  },
  data() {
    return {
      title: '',
      visible: false,
      loadingModal: false,
      formData: {
        coachName: '',
        leaderName: '',
        groupName: '',
        groupId: ''
      },
      rules: {
        groupName: [
          {
            required: true,
            message: '请输入团队名称',
            trigger: 'blur'
          }
        ],
        coachName: [
          {
            required: true,
            message: '请输入教练',
            trigger: 'blur'
          }
        ],
        leaderName: [
          {
            required: true,
            message: '请输入领队',
            trigger: 'blur'
          }
        ],
      },
      type: 0,
      contestId: '',
      name: '',
      width: '',
      infos: {},
      list: []
    }
  },
  methods: {
    init(contestId, name) {
      this.width = '520px'
      this.visible = true
      this.contestId = contestId
      this.name = name
      this.type = 0
      this.title = '添加'
      this.$nextTick(() => {
        for (const key in this.formData) {
          this.formData[key] = ''
        }
        this.$refs.form.clearValidate()
      })
    },
    edit(reccord, contestId, name) {
      this.width = '520px'
      this.visible = true
      this.contestId = contestId
      this.name = name
      this.type = 1
      this.title = '修改'
      this.$nextTick(() => {
        for (const key in this.formData) {
          this.formData[key] = reccord[key]
        }
        this.$refs.form.clearValidate()
      })
    },
    info(reccord, contestId, name) {
      this.contestId = contestId
      this.name = name
      this.width = '50%'
      this.visible = true
      this.type = 3
      this.title = '详情'

      this.infos = reccord
      // 排序
      const order = [ '甲', '乙', '丙' ]
      const keys = Object.keys(reccord.groupProjectMap)
      const obj = []
      for (const item of order) {
        for (let i = 0; i < keys.length; i++) {
          if (keys[i].includes(item)) {
            obj.push({
              title: [keys[i]],
              list: reccord.groupProjectMap[keys[i]]
            })
          }
        }
      }
      this.list = obj
    },
    handleOk() {
      this.$refs.form.validate((v) => {
        if (v) {
          if (this.type === 0) {
            const data = JSON.parse(JSON.stringify(this.formData))
            delete data.groupId
            bizGroupSave({
              ...data,
              contestId: this.contestId
            }).then(this.quit)
          }
          if (this.type === 1) {
            const data = JSON.parse(JSON.stringify(this.formData))
            bizGroupUpdate(data).then(this.quit)
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    plus() {
      if (this.formData.coach.length < 1)
      this.formData.coach.push({
        value: '',
        key: Date.now()
      })
    },
    minus(i) {
      this.formData.coach.splice(i, 1)
    },
    quit(res) {
      if (res.code === 200) {
        this.$message.success(res.message)
        this.handleCancel()
        this.$emit("list")
      }else {
        this.$message.warning(res.message)
      }
      this.loadingModal = false
    },
  }
}
</script>

<style scoped lang="less">
.teamGroupManageModal{
  height: 100%;
  overflow-y: auto;
}
</style>