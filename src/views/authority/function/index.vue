<template>
  <Card>
    <template slot="operator">
<!--      <a-row :gutter="24">-->
<!--        <a-col :span="18">-->
          <div style="height: 40px;display: flex;align-items: center; justify-content: flex-end;">
            <a-space>
              <a-button type="primary" @click="handleClick">
                更新
              </a-button>
            </a-space>
          </div>
<!--        </a-col>-->
<!--      </a-row>-->
    </template>
    <div>
      <a-form-model
        :labelCol="{span: 6}"
        ref="form"
        :model="formData"
        :wrapperCol="{span: 18}"
      >
        <a-row :gutter="24" v-for="(item,index) in formData.data" :key="index">
          <a-col :span="3">
            <a-form-model-item :labelCol="{span: 0}">
              <b>{{item.configName}}</b>
            </a-form-model-item>
          </a-col>
          <a-col :span="5">
            <a-form-model-item
              :prop="'data.' + index + '.contestId'"
              :rules="{message: '请选择赛事名称', required: rulesDisabled(item), trigger: 'blur'}"
              label="赛事名称">
              <a-select allowClear v-model="item.contestId" @change="handleContest(index)">
                <a-select-option v-for="i in contestId" :key="i.contestId" :value="i.contestId">{{i.contestName}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="5" v-if="!item.configName.includes('团队综合排名')">
            <a-form-model-item
              label="项目名称"
              :prop="'data.' + index + '.cproId'"
              :rules="{message: '请选择项目名称', required: rulesDisabled(item), trigger: 'blur'}"
            >
              <a-select allowClear v-model="item.cproId" @change="handleProject(index)">
                <a-select-option v-for="i in item.cproIds" :key="i.cproId" :value="i.cproId">{{i.projectName}} - {{i.projectGroup}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="5" v-if="!item.configName.includes('团队综合排名')">
            <a-form-model-item
              label="阶段名称"
              :prop="'data.' + index + '.stageId'"
              :rules="{message: '请选择阶段名称', required: rulesDisabled(item), trigger: 'blur'}"
            >
              <a-select allowClear v-model="item.stageId">
                <a-select-option v-for="i in item.stageIds" :key="i.cproStageId" :value="i.cproStageId">{{i.stageName}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
import { bizConfigList, bizConfigUpdateBatch } from '@api/authority'
import { bizContestList, bizContestProjectList, bizContestProjectStageList } from '@api/competition'
export default {
  name: 'function',
  components: {
    Card
  },
  data() {
    return {
      data: [],
      contestId: [],
      formData: {
        data: [],
      }
      // cproId: [],
      // stageId: []
    }
  },
  mounted() {
    bizContestList().then(res => {
      this.contestId = res.result
      this.getList()
    })
  },
  methods: {
    getList() {
      bizConfigList().then(res => {
        if (res.code === 200) {
          this.formData.data = res.result.map(item => {
            return {
              ...item,
              cproIds: [],
              stageIds: []
            }
          })
          for (let i = 0; i < this.formData.data.length; i++) {
            if (this.formData.data[i].contestId){
              bizContestProjectList({contestId: this.formData.data[i].contestId}).then(res => {
                this.formData.data[i].cproIds = res.result
              })
              if (this.formData.data[i].cproId) {
                bizContestProjectStageList({
                  contestId: this.formData.data[i].contestId,
                  cproId: this.formData.data[i].cproId
                }).then(res => {
                  this.formData.data[i].stageIds = res.result
                })
              }
            }
          }
        } else {
          this.$message.error(res.message)
        }
        console.log(res)
      })
    },
    rulesDisabled(item) {
      if (item.contestId || item.cproId || item.stageId){
        return true
      }
      return false
    },
    // 赛事
    handleContest(i) {
      this.formData.data[i].stageIds = []
      this.formData.data[i].cproIds = []
      this.formData.data[i].cproId = ''
      this.formData.data[i].stageId = ''
      bizContestProjectList({contestId: this.formData.data[i].contestId}).then(res => {
        // console.log(res)
        this.formData.data[i].cproIds = res.result
      })
    },
    // 项目
    handleProject(i) {
      this.formData.data[i].stageIds = []
      this.formData.data[i].stageId = ''
      bizContestProjectStageList({
        contestId: this.formData.data[i].contestId,
        cproId: this.formData.data[i].cproId
      }).then(res => {
        console.log(res)
        this.formData.data[i].stageIds = res.result
      })
    },
    handleClick() {
      const list = JSON.parse(JSON.stringify(this.formData.data))
      const arr = list.map(item => {
        delete item.stageIds
        delete item.cproIds
        return item
      })
      this.$refs.form.validate(v => {
        if (v) {
          bizConfigUpdateBatch(arr).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
            }else {
              this.$message.error(res.message)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>