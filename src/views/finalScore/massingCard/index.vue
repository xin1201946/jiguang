<template>
  <div class="RealTimeView">
    <div class="btns">
      <a-select
        :placeholder="treeList.length && '请选择赛事' || '请先创建赛事'"
        style="width: 300px"
        v-model="contestId"
        @change="handleContest"
      >
        <a-select-option
          v-for="(item, i) in treeList"
          :key="i"
          :value="item.contestId"
        >{{item.contestName}}</a-select-option>
      </a-select>
    </div>
    <div class="cards">
      <TreeCard>
        <template slot="tree">
          <a-radio-group v-if="list.length" v-model="tree" @change="handleTreeChange">
            <a-radio
              :style="style"
              v-for="item in list"
              :key="item.value"
              :value="item.value"
            > {{ item.label }}
            </a-radio>
          </a-radio-group>
          <a-empty description="当前赛事没有项目, 请到赛事列表中创建项目" v-else/>
        </template>
        <template slot="query">
          <a-form layout="inline" :form="form" @submit="handleSubmit">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item colon label="阶段名称">
                  <a-select v-model="query.cproStageId">
                    <a-select-option
                      v-for="value in stageArr"
                      :value="value.value"
                      :key="value.value"
                    >{{ value.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :labelCol="{ span: 0 }">
                  <a-space>
                    <a-button html-type="submit" type="primary" icon="search">查询</a-button>
                    <a-button @click="handleReset" icon="reload">重置</a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </template>
        <template slot="operator">
          <a-space>
            <a-button type="primary" @click="handlePrint">成绩打印</a-button>
          </a-space>
        </template>
        <template slot="default">
          <a-table
            :columns="columns"
            :data-source="data"
            rowKey="playerId"
            :pagination="pagination"
            @change="handleTableChange"
            bordered
            :scroll="{x: 1400}"
          >
          </a-table>
        </template>
      </TreeCard>
    </div>
  </div>
</template>

<script>
import TreeCard from '@comp/card/TreeCard.vue'
import {
  RealTimeViewTreeStyle
} from '@views/Competition/RealTimeView/RealTimeView.config'
import {
  bizContestList,
  bizContestProjectList,
  bizContestProjectStageList, bizPlayerFinalScoreFinalSportsList
} from '@api/competition'
import { reportCardStageColumns } from '@views/finalScore/reportCard/reportCard.config'
export default {
  name: 'massingCard',
  components: {
    TreeCard,
  },
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
      },
      form: this.$form.createForm(this, { name: 'search' }),
      style: RealTimeViewTreeStyle,
      contestId: '',
      tree: '',
      treeList: [],
      list: [],
      data: [],
      query: {
        cproStageId: ''
      },
      stageArr: [],
      columns: reportCardStageColumns,
      scroll: {
        x: 1500
      }
    }
  },
  computed: {},
  watch: {
    $route: {
      handler() {
        this.$nextTick(() => {
          this.getTreeList()
          // this.$refs.query.init(RealTimeViewQueryPrint)
        })
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    // 分页
    handleTableChange (pagination) {
      this.pagination = pagination
      this.getList()
    },
    // 修改赛事
    handleContest() {
      this.getProjectList()
    },
    // 获取阶段
    getStage () {
      bizContestProjectStageList({
        cproId: this.tree,
        contestId: this.contestId
      }).then(res => {
        if (res.result.length) {
          const data = res.result.map(item => {
            return {
              ...item,
              label: item.stageName,
              value: item.cproStageId
            }
          })
          this.stageArr = data
          this.query.cproStageId = data[0].value || ""
          this.getList()
        }
      })
    },
    // 获取项目
    getProjectList () {
      bizContestProjectList({
        contestId: this.contestId
      }).then(res => {
        // console.log(res)
        if (res.code === 200) {
          // 查询下拉框
          if (res.result.length) {
            const data = res.result.filter(item => item.projectName.includes("团体")).map(item => {
              return {
                ...item,
                label: `${item.projectName} - ${item.projectGroup}`,
                value: item.cproId
              }
            })
            this.tree = data[0].value
            this.list = data
          }else {
            this.tree = ''
            this.list = []
          }
          // 阶段
          this.getStage()
        }
      })
    },
    // 获取比赛信息
    getTreeList () {
      bizContestList({}).then(res => {
        this.treeList = res.result
        this.contestId = res.result[0].contestId
        this.pagination.current = 1
        // 通过比赛获取左侧项目
        this.getProjectList()
      })
    },
    // 获取比赛成绩表头
    getColumns(total) {
      let children = []
      for (let i = 0; i < total; i++) {
        children.push({
          // title: numToCapital((i + 1) * 10),
          title: (i + 1) * 10,
          align: 'center',
          dataIndex: `scoreList${i+1}`
        })
      }
      /* this.columns = RealTimeViewTableColumns.map( item => {
        if (item.children) {
          return {
            ...item,
            children: children
          }
        }
        return item
      }) */
    },
    // 获取列表
    getList() {
      const data = {
        ...this.query,
        contestId: this.contestId,
        cproId: this.tree,
      }

    },
    // 左侧选中
    handleTreeChange (v) {
      this.getStage()
    },
    // 查询
    handleSubmit() {

    },
    // 重置
    handleReset() {

    },
    // 成绩打印
    handlePrint () {

    }
  },
}
</script>

<style scoped lang="less">
@btnHeight: 50px;
.RealTimeView{
  height: 100%;
  overflow-y: hidden;
  .btns {
    height: @btnHeight;
    background: #fff;
    margin-bottom: 10px;
    line-height: @btnHeight;
    overflow: hidden;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    justify-content: space-between;
    /deep/.ant-page-header-heading{
      display: flex;
      align-items: center;
    }
  }

  .cards {
    height: calc(100% - @btnHeight - 10px);
  }
}
</style>