<template>
  <div class="projectPhase">
    <div class="btns">
      <a-space>
        <a-button type="primary" @click="handleBack">返回</a-button>
      </a-space>
      <a-space v-show="check === '1'">
        <a-button type="primary" @click="clickApproved">审核通过</a-button>
        <a-button type="danger" @click="clickReviewrejection">驳回审核</a-button>
      </a-space>
      <a-space v-if="!disabled">
        <a-button type="primary" @click="clickSubmit">提交</a-button>
      </a-space>
    </div>
    <div class="cards">
      <TreeCard :width="true">
        <!--    左侧详情-->
        <template slot="tree">
          <ProjectPhaseTree :data="tree"></ProjectPhaseTree>
        </template>
        <div class="tables">
          <!--          项目-->
          <div class="project">
            <CompetitionProject :disabled="disabled" @change="getChange" />
          </div>
          <div class="tabsTable">
            <a-tabs size="small" @change="handleTabsChange">
              <a-tab-pane key="1" tab="阶段">
                <ProjectPhaseStageTable :disabled="disabled" ref="stage" :cproId="cproId" />
              </a-tab-pane>
              <a-tab-pane key="0" tab="设备">
                <ProjectPhaseDeviceTable :disabled="disabled" ref="device" :cproId="cproId" />
              </a-tab-pane>
              <a-tab-pane key="2" tab="参赛人员">
                <projectPhaseParticipant :disabled="disabled" ref="participant" :projectName="projectName" :cproId="cproId" :mode="mode"/>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
      </TreeCard>
    </div>
  </div>
</template>

<script>
import ProjectPhaseTree from '@views/Competition/projectPhase/model/projectPhaseTree.vue'
import TreeCard from '@comp/card/TreeCard.vue'
import Card from '@comp/card/card.vue'
import CompetitionProject from '@views/Competition/projectPhase/model/competitionProject.vue'
import { bizContestQueryById, bizContestAudit } from '@api/competition'
import ProjectPhaseDeviceTable from '@views/Competition/projectPhase/model/projectPhaseDeviceTable.vue'
import ProjectPhaseStageTable from '@views/Competition/projectPhase/model/projectPhaseStageTable.vue'
import projectPhaseParticipant from '@views/Competition/projectPhase/model/projectPhaseParticipant.vue'
export default {
  name: 'projectPhase',
  inject: ["closeCurrent"],
  components: {
    TreeCard,
    Card,
    ProjectPhaseTree,
    CompetitionProject,
    ProjectPhaseStageTable,
    ProjectPhaseDeviceTable,
    projectPhaseParticipant
  },
  data() {
    return {
      tree: {},
      id: "",
      cproId: "",
      check: '',
      contestId: '',
      projectName: '',
      mode: '0'
    }
  },
  computed: {
    disabled() {
      if (this.tree.contestStatus === '0' && this.$route.query.check === '0') {
        return false
      }
      return true
    }
  },
  watch: {
    $route: {
      handler(n, o) {
        this.check = n.query.check
        this.contestId = n.query.id
        this.getInfo(n.query)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleBack() {
      this.$nextTick(() => {
        if (this.check === '1') {
          this.$router.push('/Competition/eventReview')
        }else {
          this.$router.push('/competition/competitionList')
        }
        this.closeCurrent()
      })
    },
    getInfo({ id }) {
      bizContestQueryById(id).then(res => {
        this.id = id
        const data = JSON.parse(JSON.stringify(res.result))
        data.contestTime = [data.contestTimeStart, data.contestTimeEnd]
        data.registTime = [data.registTimeStart, data.registTimeEnd]
        this.tree = data
      })
    },
    getChange(cproId, name, data) {
      this.mode = data.mode
      this.cproId = String(cproId)
      this.projectName = name
    },
    handleTabsChange(v) {
      this.$nextTick(() => {
        switch (v) {
          case '0':
            this.$refs.device.handleList()
            break
          case '1':
            this.$refs.stage.handleList()
            break
          case '2':
            this.$refs.participant.handleList()
            break
        }
      })
    },
    // 提交
    clickSubmit(){
      let parms = {
        contestId: this.contestId,
        contestStatus: '1'
      }
      bizContestAudit(parms).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.handleBack();
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 审核通过
    clickApproved() {
      let parms = {
        contestId: this.contestId,
        contestStatus: '2'
      }
      bizContestAudit(parms).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.handleBack();
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 审核驳回
    clickReviewrejection() {
      let parms = {
        contestId: this.contestId,
        contestStatus: '0'
      }
      bizContestAudit(parms).then((res) => {
        if (res.success) {
          this.$message.success('审核已驳回！')
          this.handleBack();
        } else {
          this.$message.error(res.message)
        }
      })
    },
  }
}
</script>


<style scoped lang="less">
@btnHeight: 50px;

* {
  //user-select: none;
}

.projectPhase {
  height: 100%;
  overflow-y: hidden;

  .btns {
    height: @btnHeight;
    background: #fff;
    margin-bottom: 10px;
    line-height: @btnHeight;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    justify-content: space-between;
  }

  .cards {
    height: calc(100% - @btnHeight - 10px);
  }
}

.operators {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.tables {
  height: 670px;
  overflow-y: hidden;

  .project {
    height: 40%;
    overflow-y: hidden;
  }

  .tabsTable {
    height: 60%;
    overflow-y: hidden;

    /deep/.ant-tabs-nav-scroll {
      display: flex;
      justify-content: center;
    }
  }

}
</style>