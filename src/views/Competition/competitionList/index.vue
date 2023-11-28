<template>
  <Card>
    <template slot="query">
      <QuerySearch ref="query" @submit="handleSearch" @reset="handleSearch"></QuerySearch>
    </template>
    <template slot="operator">
      <a-space>
        <a-button type="primary" @click="handleAdd" icon="plus">创建赛事</a-button>
      </a-space>
    </template>
    <a-table :columns="columns" rowKey="contestId" :dataSource="data" :pagination="pagination" @change="handleTableChange" bordered>
      <template slot="operation" slot-scope="text, record">
        <a-space>
          <!--          <a-button
            type="primary"
            size="small"
            ghost
            icon="edit"
            @click="handleEdita(record)"
          >编辑</a-button>-->
          <a-button v-if="record.contestStatus !== '0'" type="primary" size="small" ghost icon="check" @click="toLink(record)">赛事安排</a-button>
          <a-button v-if="record.contestStatus === '0'" type="primary" size="small" ghost icon="check" @click="handleSubmit(record)">提交</a-button>
          <a-button type="primary" size="small" ghost icon="edit" @click="handleEditPhase(record)">设置比赛信息</a-button>
          <a-button type="primary" size="small" ghost icon="link" @click="handleParticipant(record)">参赛人员管理</a-button>
          <!-- <a-button ghost size="small" type="primary" icon="check-circle"
            @click="handleParticipantCheck(record)">审核</a-button> -->
          <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
    <CompetitionListModal ref="modal" @list="handleList"></CompetitionListModal>
  </Card>
</template>

<script >
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import {
  competitionListQuery,
  competitionListTableColumns,
} from '@views/Competition/competitionList/competitionList.config'
import BizMixins from '@views/biz/bizMixins'
import CompetitionListModal from '@views/Competition/competitionList/modal/competitionListModal.vue'
import { deleteMessage, infoMessage } from '@/utils'
import { bizContestDelete, bizContestPageList, bizContestAudit } from '@api/competition'
export default {
  name: 'competitionList',
  components: {
    Card,
    QuerySearch,
    CompetitionListModal,
  },
  mixins: [BizMixins],
  data() {
    return {
      data: [],
      columns: competitionListTableColumns,
      query: {
        selectWord: undefined,
      },
    }
  },

  mounted() {
    this.$refs.query.init(competitionListQuery)
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
    /**
     * 跳转赛事安排
     */
    toLink(row) {
      this.$router.push({ path: '/competition/gameInfo', query: { row: encodeURI(JSON.stringify(row)) } })
    },
    getList() {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
      }
      bizContestPageList(data).then((res) => {
        if (res.code === 200) {
          this.data = res.result.records
          this.pagination.current = res.result.current
          this.pagination.total = res.result.total
        }
      })
    },
    handleEdita(record) {
      const data = JSON.parse(JSON.stringify(record))
      data.contestTime = [data.contestTimeStart, data.contestTimeEnd]
      data.registTime = [data.registTimeStart, data.registTimeEnd]
      this.handleEdit(data)
    },
    // 提交
    handleSubmit(record) {
      infoMessage('是否提交赛事信息').then(() => {
        let parms = {
          contestId: record.contestId,
          contestStatus: '1',
        }
        bizContestAudit(parms).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    handleEditPhase(record) {
      // /competition/projectPhase
      this.$router.push({
        path: '/competition/projectPhase',
        query: {
          id: record.contestId,
          check: '0',
        },
      })
    },
    handleParticipant(record) {
      this.$router.push({
        path: '/competition/participant',
        query: {
          id: record.contestId,
          contestName: record.contestName,
          status: record.contestStatus,
        },
      })
    },
    handleParticipantCheck(record) {
      this.$router.push({
        path: '/competition/projectPhase',
        query: {
          id: record.contestId,
          check: '1',
        },
      })
    },
    handleDelete(record) {
      deleteMessage('删除当前赛事,会删除下属赛事项目、项目阶段、项目设备,是否删除该条信息').then(() => {
        bizContestDelete(record.contestId).then((res) => {
          if (res.code === 200) {
            if (this.data.length === 1) {
              this.pagination.current = this.pagination.current - 1
            }
            this.$nextTick(() => {
              this.getList()
            })
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        })
      })
    },
  },
}
</script>

<style scoped lang="less">
* {
  //user-select: none;
}
</style>