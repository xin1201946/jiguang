<template>
  <Card>
    <div>
      <a-tabs>
        <a-tab-pane key="1" tab="步枪">

          <a-form-model
            :labelCol="{span: 6}"
            ref="form"
            :model="formData"
            :wrapperCol="{span: 18}"
          >
            <a-row :gutter="24" v-for="(item,index) in formData.data" :key="index">
              <template v-if="item.configName.includes('步枪')">
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
                      <!--                configName-->
                      <a-select-option v-for="i in item.cproIds.filter(i => i.projectName.includes(item.configName.substring(0,2)))" :key="i.cproId" :value="i.cproId">{{i.projectName}} - {{i.projectGroup}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="5" v-if="!item.configName.includes('团队综合排名') && !item.configName.includes('混团资格赛')">
                  <a-form-model-item
                    label="阶段名称"
                    :prop="'data.' + index + '.stageId'"
                    :rules="{message: '请选择阶段名称', required: rulesDisabled(item), trigger: 'blur'}"
                  >
                    <a-select allowClear v-model="item.stageId">
                      <template v-if="item.configName.includes('个人资格赛')">
                        <a-select-option v-for="i in item.stageIds.filter(a => item.configName.includes(a.stageName))" :key="i.cproStageId" :value="i.cproStageId">{{i.stageName}}</a-select-option>
                      </template>
                      <template v-else-if="item.configName.includes('个人决赛')">
                        <a-select-option v-for="i in item.stageIds.filter(a => item.configName.includes(a.stageName))" :key="i.cproStageId" :value="i.cproStageId">{{i.stageName}}</a-select-option>
                      </template>
                      <template v-else>
                        <a-select-option v-for="i in item.stageIds" :key="i.cproStageId" :value="i.cproStageId">{{i.stageName}}</a-select-option>
                      </template>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </template>
            </a-row>
          </a-form-model>
          <a-row :gutter="24">
            <a-col :span="18">
              <div style="height: 40px;display: flex;align-items: center; justify-content: center;">
                <a-space>
                  <a-button type="primary" @click="handleClick(1)">
                    更新
                  </a-button>
                  <a-button @click="handleReset(1)">重置</a-button>
                </a-space>
              </div>
            </a-col>
          </a-row>

        </a-tab-pane>
        <a-tab-pane key="2" tab="手枪">

          <a-form-model
            :labelCol="{span: 6}"
            ref="form2"
            :model="formData"
            :wrapperCol="{span: 18}"
          >
            <a-row :gutter="24" v-for="(item,index) in formData.data" :key="index">
              <template v-if="item.configName.includes('手枪')">
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
                      <!--                configName-->
                      <a-select-option v-for="i in item.cproIds.filter(i => i.projectName.includes(item.configName.substring(0,2)))" :key="i.cproId" :value="i.cproId">{{i.projectName}} - {{i.projectGroup}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="5" v-if="!item.configName.includes('团队综合排名') && !item.configName.includes('混团资格赛')">
                  <a-form-model-item
                    label="阶段名称"
                    :prop="'data.' + index + '.stageId'"
                    :rules="{message: '请选择阶段名称', required: rulesDisabled(item), trigger: 'blur'}"
                  >
                    <a-select allowClear v-model="item.stageId">
                      <template v-if="item.configName.includes('个人资格赛')">
                        <a-select-option v-for="i in item.stageIds.filter(a => item.configName.includes(a.stageName))" :key="i.cproStageId" :value="i.cproStageId">{{i.stageName}}</a-select-option>
                      </template>
                      <template v-else-if="item.configName.includes('个人决赛')">
                        <a-select-option v-for="i in item.stageIds.filter(a => item.configName.includes(a.stageName))" :key="i.cproStageId" :value="i.cproStageId">{{i.stageName}}</a-select-option>
                      </template>
                      <template v-else>
                        <a-select-option v-for="i in item.stageIds" :key="i.cproStageId" :value="i.cproStageId">{{i.stageName}}</a-select-option>
                      </template>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </template>
            </a-row>
          </a-form-model>
          <a-row :gutter="24">
            <a-col :span="18">
              <div style="height: 40px;display: flex;align-items: center; justify-content: center;">
                <a-space>
                  <a-button type="primary" @click="handleClick(2)">
                    更新
                  </a-button>
                  <a-button @click="handleReset(2)">重置</a-button>
                </a-space>
              </div>
            </a-col>
          </a-row>

        </a-tab-pane>
        <a-tab-pane key="3" tab="团队">
          <a-form-model
            :labelCol="{span: 6}"
            ref="form3"
            :model="formData"
            :wrapperCol="{span: 18}"
          >
            <a-row :gutter="24" v-for="(item,index) in formData.data" :key="index">
              <template v-if="item.configName.includes('团队')">
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
                      <!--                configName-->
                      <a-select-option v-for="i in item.cproIds.filter(i => i.projectName.includes(item.configName.substring(0,2)))" :key="i.cproId" :value="i.cproId">{{i.projectName}} - {{i.projectGroup}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="5" v-if="!item.configName.includes('团队综合排名') && !item.configName.includes('混团资格赛')">
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
              </template>
            </a-row>
          </a-form-model>
          <a-row :gutter="24">
            <a-col :span="8">
              <div style="height: 40px;display: flex;align-items: center; justify-content: center;">
                <a-space>
                  <a-button type="primary" @click="handleClick(3)">
                    更新
                  </a-button>
                  <a-button @click="handleReset(3)">重置</a-button>
                </a-space>
              </div>
            </a-col>
          </a-row>

        </a-tab-pane>
      </a-tabs>

    </div>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
import { bizConfigList, bizConfigReset, bizConfigUpdateBatch } from '@api/authority'
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
                // console.log(this.formData.data[i], 123)
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
    handleClick(num) {
      const list = JSON.parse(JSON.stringify(this.formData.data))
      const arr = list.map(item => {
        delete item.stageIds
        delete item.cproIds
        return item
      })
      if (num === 1) {
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
      if (num === 2) {
        this.$refs.form2.validate(v => {
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
      if (num === 3) {
        this.$refs.form3.validate(v => {
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

    },
    handleReset(num) {
      if (num === 1) {
        const data = this.formData.data.filter(item => item.configName.includes("步枪")).map(item => {
          return {
            ...item,
            contestId: null,
            cproId: null,
            stageId: null
          }
        })
        const str = data[0].configType
        const dataAll = this.formData.data.filter(item => !item.configName.includes("步枪"))
        this.formData.data = [...dataAll, ...data]
        bizConfigReset({
          configType: str
        })
      }
      if (num === 2) {
        console.log(num)
        const data = this.formData.data.filter(item => item.configName.includes("手枪")).map(item => {
          const obj = {
            ...item,
            contestId: "",
            cproId: "",
            stageId: ""
          }
          return obj
        })
        const str = data[0].configType
        const dataAll = this.formData.data.filter(item => !item.configName.includes("手枪"))
        this.formData.data = [...dataAll, ...data]
        bizConfigReset({
          configType: str
        })
      }
      if (num === 3) {
        const list = JSON.parse(JSON.stringify(this.formData.data))
        const data = list.filter(item => item.configName.includes("团队")).map(item => {
          const obj = {
            ...item,
            contestId: "",
            cproId: "",
            stageId: ""
          }
          return obj
        })
        const str = data[0].configType

        const dataAll = this.formData.data.filter(item => !item.configName.includes("团队"))

        this.formData.data = [...dataAll, ...data]
        bizConfigReset({
          configType: str
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>