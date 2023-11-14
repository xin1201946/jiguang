<template>
  <TreeCard>
<!--    左侧详情-->
    <template slot="tree">
      <ProjectPhaseTree
        :data="tree"
      ></ProjectPhaseTree>
    </template>
    <template slot="operator">
      <div class="operators">
        <a-space>
          <a-button>确定</a-button>
          <a-button>返回</a-button>
        </a-space>
      </div>
    </template>
    <div class="tables">
      <div class="project">
        <CompetitionProject @change="getChange"></CompetitionProject>
      </div>
      <div class="tabsTable">
        <a-tabs size="small" @change="handleTabsChange">
          <a-tab-pane key="0" tab="设备">
            <ProjectPhaseDeviceTable ref="device" :cproId="cproId"/>
          </a-tab-pane>
          <a-tab-pane key="1" tab="阶段">
            <ProjectPhaseStageTable ref="stage" :cproId="cproId"/>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </TreeCard>
</template>

<script>
import ProjectPhaseTree from '@views/Competition/projectPhase/model/projectPhaseTree.vue'
import TreeCard from '@comp/card/TreeCard.vue'
import CompetitionProject from '@views/Competition/projectPhase/model/competitionProject.vue'
import { bizContestQueryById } from '@api/competition'
import ProjectPhaseDeviceTable from '@views/Competition/projectPhase/model/projectPhaseDeviceTable.vue'
import ProjectPhaseStageTable from '@views/Competition/projectPhase/model/projectPhaseStageTable.vue'
export default {
  name: 'projectPhase',
  components: {
    TreeCard,
    ProjectPhaseTree,
    CompetitionProject,
    ProjectPhaseStageTable,
    ProjectPhaseDeviceTable
  },
  data() {
    return {
      tree: {},
      id: "",
      cproId: ""
    }
  },
  watch: {
    $route: {
      handler(n, o) {
        this.getInfo(n.query)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getInfo ({ id }) {
      bizContestQueryById(id).then(res => {
        this.id = id
        const data = JSON.parse(JSON.stringify(res.result))
        data.contestTime = [data.contestTimeStart, data.contestTimeEnd]
        data.registTime = [data.registTimeStart, data.registTimeEnd]
        this.tree = data
      })
    },
    getChange(cproId) {
      this.cproId = String(cproId)
    },
    handleTabsChange(v) {
      this.$nextTick(() => {
        if (v === '0') {
          this.$refs.device.handleList()
        }
        if (v === '1') {
          this.$refs.stage.handleList()
        }
      })
    }
  }
}
</script>


<style scoped lang="less">
*{
  user-select: none;
}
.operators{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
}
.tables{
  height: 100%;
  overflow-y: hidden;
  .project{
    height: 40%;
    overflow-y: hidden;
  }
  .tabsTable{
    height: 60%;
    overflow-y: hidden;
    /deep/.ant-tabs-nav-scroll{
      display: flex;
      justify-content: center;
    }
  }

}
</style>