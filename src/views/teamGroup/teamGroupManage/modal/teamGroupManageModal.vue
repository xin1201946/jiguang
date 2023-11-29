<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
    :widths="width"
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
<!--        <a-form-model-item label="教练" prop="coachName">
          <a-input v-model="formData.coachName"></a-input>
        </a-form-model-item>-->
        <a-form-model-item label="领队" prop="leaderName">
          <a-input v-model="formData.leaderName"></a-input>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div v-else class="teamGroupManageModal">
      <a-descriptions bordered :column="4">
        <a-descriptions-item :span="1" label="团队名称">
          {{ infos.groupName }}
        </a-descriptions-item>
<!--        <a-descriptions-item :span="1" label="教练">
          {{ infos.coachName }}
        </a-descriptions-item>-->
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
          <a-descriptions bordered :column="4"  >
            <template slot="title">
              <div style="display: flex; align-items: start;">
                <span style="margin-top: 8px">
                  {{item.title}}
                </span>
                <div style="margin-left: 50px">
                  <a-form>
                    <a-form-item
                      :labelCol="{span: 6}"
                      :wrapperCol="{span: 14}"
                      label="教练"
                    >
                      <a-input v-model="item.value"></a-input>
                    </a-form-item>
                  </a-form>
                </div>
              </div>
            </template>
            <template v-for="(key, index) in item.list">
              <a-descriptions-item :key="index + '项目'" :span="2" label="项目名称">{{ key.projectName }}</a-descriptions-item>
              <a-descriptions-item :key="index + '人'" :span="1" label="人数">{{ key.gpPlayerCount }}</a-descriptions-item>
              <a-descriptions-item :key="index + '分'" :span="1" label="分数">{{ key.gpScore }}</a-descriptions-item>
            </template>
          </a-descriptions>
        </div>
      </div>

    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { bizGroupSave, bizGroupUpdate, bizGroupUpdateCoachName } from '@api/teamGroup'
import { sorderFun } from '@/utils'


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
    // 添加
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
    // 编辑
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
    // 详情
    info(reccord, contestId, name) {
      this.contestId = contestId
      this.name = name
      this.width = '50%'
      this.type = 3
      this.title = '团体项目'
      this.infos = reccord
      // 先男女 后 甲乙丙
      if (reccord.groupProjectMap) {
        const sexOrder = ['男', '女']
        const order = ['甲', '乙', '丙']
        const keys = Object.keys(reccord.groupProjectMap)
        const sorderArr = sorderFun(order, sorderFun(sexOrder, keys).map(item => item.value)).map((item, i) => {
          const obj = {
            title: item.value,
            list: reccord.groupProjectMap[item.value],
            value: ''
          }
          if (reccord.coachNameArr) {
            if (reccord.coachNameArr.length) {
              obj.value = reccord.coachNameArr[i] || ''
            }
          }
          return obj
        })
        this.list = sorderArr
      }else {
        this.list = []
      }
      this.visible = true
    },
    // 确定
    handleOk() {
      if (this.type === 3) {
        const coachNameArr = this.list.map(item => item.value)
        bizGroupUpdateCoachName({...this.infos, coachNameArr}).then(this.quit)
      }else {
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
      }
    },
    // 取消
    handleCancel() {
      this.visible = false
    },
    // 接口回调
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