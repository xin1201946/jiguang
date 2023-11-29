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
          <QuerySearch
            ref="query"
            @reset="handleSearch"
            @submit="handleSearch"
          ></QuerySearch>
        </template>
        <template slot="operator"></template>
        <template slot="default">
          <a-table
            :columns="columns"
            :data-source="data"
            rowKey="finalScoreId"
            :pagination="pagination"
            @change="handleTableChange"
            bordered
          >
<!--            <template slot="total" slot-scope="text, record, index">
              <a @click="$refs.modals.init">{{ text }}</a>
            </template>-->
            <template slot="operation" slot-scope="text, record, index">
              <a-space>
<!--                <a-icon type="profile" />-->
                <a-button type="primary" size="small" ghost icon="profile" @click="handleInfo(record)">详情</a-button>
<!--                <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>-->
              </a-space>
            </template>
          </a-table>
          <RealTimeViewModal ref="modal"></RealTimeViewModal>
        </template>
      </TreeCard>
    </div>
  </div>
</template>

<script>
import TreeCard from '@comp/card/TreeCard.vue'
import BizMixins from '@views/biz/bizMixins'
import {
  RealTimeViewQuery,
  RealTimeViewTableColumns,
  RealTimeViewTreeStyle
} from '@views/Competition/RealTimeView/RealTimeView.config'
import { deleteMessage } from '@/utils'

import {
  bizContestList,
  bizContestPlayerList,
  bizContestProjectList,
  bizContestProjectStageList,
  bizPlayerFinalScorePageList,
  bizPlayerFinalScoreQueryById
} from '@api/competition'
import QuerySearch from '@comp/query/QuerySearch.vue'
import RealTimeViewModal from '@views/Competition/RealTimeView/modal/RealTimeViewModal.vue'
import { bizEntryFormList } from '@api/biz'
export default {
  name: 'RealTimeView',
  components: {
    TreeCard,
    QuerySearch,
    RealTimeViewModal
  },
  mixins: [BizMixins],
  data() {
    return {
      style: RealTimeViewTreeStyle,
      contestId: '',
      tree: '',
      treeList: [],
      list: [],
      data: [],
      query: {
        playerName: undefined,
        stageName: undefined,
        groupName: undefined
      },
      columns: RealTimeViewTableColumns,
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
          this.$refs.query.init(RealTimeViewQuery)
        })
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    // 修改赛事
    handleContest() {
      if (this.$refs.query) {
        this.getProjectList()
      }
    },
    // 获取姓名
    getUserName(data) {
      bizContestPlayerList({
        isAll: 1,
        contestId: this.contestId,
        cproId: this.tree,
      }).then(res => {
        console.log(res)
        // console.log(res.result)
        const result = res.result.map(item => ({
          label: item.playerName,
          value: item.playerName
        }))
        if (data.length) {
          data.unshift({ label: '全部', value: '' })
        }
        const query = RealTimeViewQuery.map(item => {
          if (item.label === '阶段名称' && item.type === 'select') {
            return {
              ...item,
              data: data
            }
          }
          if (item.type === 'search' && item.label === '姓名') {
            return {
              ...item,
              data: result
            }
          }
          return item
        })
        this.$refs.query.init(query)
        this.$nextTick(() => {
          this.$refs.query.handleReset()
        })
      })
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
          this.getUserName(data)
        }else {
          this.getUserName([])
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
            const data = res.result.map(item => {
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
    handleDelete() {
      deleteMessage("").then(() => {
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
      // children.push({
      //   title: '......',
      //   align: 'center'
      // })

      this.columns = RealTimeViewTableColumns.map( item => {
        if (item.children) {
          return {
            ...item,
            children: children
          }
        }
        return item
      })
    },
    getList() {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
        contestId: this.contestId,
        cproId: this.tree,
      }
      bizPlayerFinalScorePageList(data).then(res => {
        if (res.code === 200) {
          if (res.result.records.length) {
            const arr = res.result.records.map(item => item.gunTotalGroup)
            this.getColumns(Math.max(...[...new Set(arr)]))
          }
          this.$nextTick(() => {
            if (res.result.records.length) {
              this.data = res.result.records.map(item => {
                const obj = item
                if (item.scoreList.length) {
                  for (let i = 0; i < item.scoreList.length; i++) {
                    obj['scoreList' + (i + 1)] = item.scoreList[i]
                  }
                }
                return obj
              })
            }else {
              this.data = []
            }
            this.pagination.current = res.result.current
            this.pagination.total = res.result.total
          })
        }
      })
    },
    handleTreeChange (v) {
      this.getStage()
    },
    handleBack() {
      this.$nextTick(() => {

      })
    },
    handleInfo(record) {
      // console.log()
      bizPlayerFinalScoreQueryById(record.finalScoreId).then(res => {
        if (res.code === 200) {
          this.$refs.modal.info(res.result, record)
        }
      })
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