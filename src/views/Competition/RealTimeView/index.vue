<template>
  <div class="RealTimeView">
    <div class="btns">
      <a-page-header
        @back="handleBack"
        :title="treeList.length && treeList[0].contestName"
      ></a-page-header>
    </div>
    <div class="cards">
      <TreeCard>
        <template slot="tree">
          <a-radio-group v-model="tree" @change="handleTreeChange">
            <a-radio
              :style="style"
              v-for="item in list"
              :key="item.value"
              :value="item.value"
            > {{ item.label }}
            </a-radio>
          </a-radio-group>
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
            rowKey="tabletPcId"
            :pagination="pagination"
            @change="handleTableChange"
            bordered
            :scroll="scroll"
          >
            <template slot="total" slot-scope="text, record, index">
              <a @click="$refs.modals.init">{{ text }}</a>
            </template>
            <template slot="operation" slot-scope="text, record, index">
              <a-space>
<!--                <a-icon type="profile" />-->
                <a-button type="primary" size="small" ghost icon="profile" @click="handleEdit(record )">详情</a-button>
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
import { deleteMessage, numToCapital } from '@/utils'
import { bizContestList, bizContestProjectList, bizContestProjectStageList } from '@api/competition'
import QuerySearch from '@comp/query/QuerySearch.vue'
import RealTimeViewModal from '@views/Competition/RealTimeView/modal/RealTimeViewModal.vue'
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
      tree: '',
      treeList: [],
      list: [],
      data: [],
      query: {},
      columns: RealTimeViewTableColumns,
      scroll: {
        x: 1500
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getTreeList()
    this.$refs.query.init(RealTimeViewQuery)
  },
  created() {},
  methods: {
    // 获取姓名
    getUserName(data) {
      data.unshift({ label: '全部', value: '' })
      const query = RealTimeViewQuery.map(item => {
        if (item.label === '阶段名称' && item.type === 'select') {
          return {
            ...item,
            data: data
          }
        }
        return item
      })
      this.$refs.query.init(query)
      this.$nextTick(() => {
        this.$refs.query.handleReset()
      })
    },
    // 获取阶段
    getStage () {
      bizContestProjectStageList({
        cproId: this.tree
      }).then(res => {
        const data = res.result.map(item => {
          return {
            ...item,
            label: item.stageName,
            value: item.cproStageId
          }
        })
        // 姓名
       this.getUserName(data)
      })
    },
    // 获取项目
    getProjectList () {
      bizContestProjectList({
        contestId: this.treeList[0].contestId
      }).then(res => {
        if (res.code === 200) {
          // 查询下拉框
          const data = res.result.map(item => {
            return {
              ...item,
              label: `${item.projectName} - ${item.projectGroup}`,
              value: item.cproId
            }
          })
          this.tree = data[0].value
          this.list = data
          // 阶段
          this.getStage()
        }
      })
    },
    // 获取比赛信息
    getTreeList () {
      bizContestList({}).then(res => {
        this.treeList = res.result
        // this.tree = res.result[0].contestId
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
          dataIndex: `group${i+1}`
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
        pageSize: this.pagination.pageSize
      }
      // todo 以下复制到列表接口, total值不固定
      // 当前比赛总共可以打几枪 先默认为10枪
      this.getColumns(3)
    },
    handleTreeChange (v) {
      this.getStage()
    },
    handleBack() {
      this.$nextTick(() => {

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
  }

  .cards {
    height: calc(100% - @btnHeight - 10px);
  }
}
</style>