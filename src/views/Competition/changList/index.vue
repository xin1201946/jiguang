<template>
  <Card>
    <template slot="query">
      <a-form-model :form="form" layout="inline">
        <a-row :gutter="24">
          <a-col :span="5">
            <a-form-model-item colon label="赛事名称">
              <a-select v-model="form.contestId" @change="contesChange">
                <a-select-option v-for="item in data" :key="item.contestId" :value="item.contestId">
                  {{item.contestName}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="5">
            <a-form-model-item colon label="项目名称">
              <a-select v-model="form.cproId" :disabled="form.contestId ? false: true" @change="projectChange">
                <a-select-option v-for="item in projectList" :key="item.cproId" :value="item.cproId">
                  {{item.projectGroup + '-' +  item.projectName}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="5">
            <a-form-model-item colon label="阶段">
              <a-select v-model="form.cproStageId" :disabled="form.contestId && form.cproId? false: true" @change="stageChange">
                <a-select-option v-for="item in stageList" :key="item.cproStageId" :value="item.cproStageId">
                  {{item.stageName}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="5">
            <a-form-model-item colon label="组别">
              <a-select v-model="form.stageGroup" :disabled="form.contestId && form.cproId && form.cproStageId  ? false: true" @change="groupChange">
                <a-select-option v-for="item in groupList" :key="item.group" :value="item.group">
                  {{item.group}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="5">
            <a-form-model-item colon label="参赛人员">
              <a-select v-model="form.playerId" :disabled="form.contestId && form.cproId && form.cproStageId && form.stageGroup ? false: true" @change="playerChange">
                <template v-if="groupList[form.stageGroup - 1]">
                  <a-select-option v-for="item in groupList[form.stageGroup - 1].bizContestPlayerList" :key="item.playerId" :value="item.playerId">
                    {{item.playerName}}
                  </a-select-option>
                </template>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="4">
            <a-form-model-item :labelCol="{ span: 0 }">
              <a-space>
                <a-button @click="handleSearch" type="primary" icon="search">查询</a-button>
                <a-button @click="handleReset" icon="reload">重置</a-button>
              </a-space>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </template>
    <a-table :columns="columns" :dataSource="list" :pagination="false" bordered :scroll="{x: 1400}">
    </a-table>
  </Card>
</template>

<script >
import Card from '@comp/card/card.vue'
import {
  bizContestPageList,
  bizContestProjectList,
  bizContestProjectStageList,
  getStagePlayerGroup,
  getChangeListAPI,
} from '@api/competition'
export default {
  name: 'competitionList',
  components: {
    Card,
  },
  data() {
    return {
      form: {
        contestId: '',
        cproId: '',
        cproStageId: '',
        stageGroup: '',
        playerId: '',
      },
      data: [],
      projectList: [],
      stageList: [],
      groupList: [],
      list: [],
      columns: [
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center',
          customRender: (text, r) => `${r.projectName}-${r.projectGroup}`,
        },
        {
          title: '阶段',
          dataIndex: 'stageName',
          align: 'center',
        },
        {
          title: '选手姓名',
          dataIndex: 'playerName',
          align: 'center',
        },
        {
          title: '原靶位',
          dataIndex: 'targetSiteOld',
          align: 'center',
        },
        {
          title: '新靶位',
          dataIndex: 'targetSiteNew',
          align: 'center',
        },
        {
          title: '换靶原因',
          dataIndex: 'remark',
          align: 'center',
        },
      ],
      query: {},
    }
  },
  mounted() {
    this.getList()
  },
  watch: {
    $route: {
      handler() {
        this.getList()
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getChangeList() {
      let { contestId, cproId, cproStageId, stageGroup, playerId } = this.form
      if (!contestId) {
        this.$message.error('请选择赛事！')
        return
      }
      if (!cproId) {
        this.$message.error('请选择项目！')
        return
      }
      if (!cproStageId) {
        this.$message.error('请选择阶段！')
        return
      }
      if (!stageGroup) {
        this.$message.error('请选择组别！')
        return
      }
      if (!playerId) {
        this.$message.error('请选择参赛人员！')
        return
      }
      const data = { ...this.form }
      getChangeListAPI(data).then((res) => {
        this.list = res.result.records
      })
    },
    /**
     * 获取赛事列表
     */
    getList() {
      const data = {
        pageNum: 1,
        pageSize: 99999,
      }
      bizContestPageList(data).then((res) => {
        if (res.code === 200) {
          this.data = res.result.records
        }
      })
    },
    /**
     * 获取项目列表
     */
    contesChange() {
      this.form.cproId = ''
      this.form.cproStageId = ''
      this.form.stageGroup = ''
      this.form.playerId = ''
      bizContestProjectList({
        contestId: this.form.contestId,
      }).then((res) => {
        this.projectList = res.result
      })
    },
    /**
     * 获取阶段
     */
    projectChange() {
      this.form.cproStageId = ''
      this.form.stageGroup = ''
      this.form.playerId = ''
      bizContestProjectStageList({
        contestId: this.form.contestId,
        cproId: this.form.cproId,
      }).then((res) => {
        this.stageList = res.result
        console.log(res)
      })
    },
    /**
     * 获取人员
     */
    stageChange() {
      this.form.stageGroup = ''
      this.form.playerId = ''
      getStagePlayerGroup({
        contestId: this.form.contestId, //赛事id
        cproId: this.form.cproId, //赛事项目id
        stageId: this.form.cproStageId, //项目阶段id
      }).then((res) => {
        console.log(res)
        this.groupList = res.result
      })
    },
    groupChange(e) {
      this.form.stageGroup = e
      this.form.playerId = ''
      this.$forceUpdate()
    },
    playerChange(e) {
      this.form.playerId = e
      this.$forceUpdate()
    },
    handleSearch() {
      console.log(this.data, this.projectList, this.stageList, this.groupList)
      this.getChangeList()
    },
    handleReset(data) {
      this.form = {}
      this.list = []
    },
  },
}
</script>

<style scoped lang="less">
* {
  //user-select: none;
}
</style>