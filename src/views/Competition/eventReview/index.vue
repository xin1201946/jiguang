<template>
  <Card>
    <template slot="query">
      <QuerySearch ref="query" @submit="handleSearch" @reset="handleSearch"></QuerySearch>
    </template>
    <a-table :columns="columns" rowKey="contestId" :dataSource="data" :pagination="pagination" @change="handleTableChange"
      bordered>
      <template slot="operation" slot-scope="text, record">
        <a-space>
          <a-button ghost size="small" type="primary" icon="check-circle"
            @click="handleParticipantCheck(record)">审核</a-button>
        </a-space>
      </template>
    </a-table>
  </Card>
</template>

<script >
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import { competitionListQuery, competitionListTableColumns } from '@views/Competition/eventReview/eventReviewList.config'
import BizMixins from '@views/biz/bizMixins'
import { deleteMessage } from '@/utils'
import { bizContestDelete, bizContestPageList } from '@api/competition'
export default {
  name: 'competitionList',
  components: {
    Card,
    QuerySearch,
  },
  mixins: [BizMixins],
  data() {
    return {
      data: [],
      columns: competitionListTableColumns,
      query: {
        contestName: undefined,
        contestType: undefined,
        contestStatus: '1'
      }
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
      deep: true
    }
  },
  methods: {
    getList() {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      bizContestPageList(data).then(res => {
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
    handleEditPhase(record) {
      // /competition/projectPhase
      this.$router.push({
        path: "/competition/projectPhase",
        query: {
          id: record.contestId,
          check: '0'
        }
      })
    },
    handleParticipant(record) {
      this.$router.push({
        path: "/competition/participant",
        query: {
          id: record.contestId,
        }
      })
    },
    handleParticipantCheck(record) {
      this.$router.push({
        path: "/competition/projectPhase",
        query: {
          id: record.contestId,
          check: '1'
        }
      })
    },
    handleDelete(record) {
      deleteMessage("删除当前赛事,会删除下属赛事项目、项目阶段、项目设备,是否删除该条信息").then(() => {
        bizContestDelete(record.contestId).then(res => {
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
    }
  }
}
</script>

<style scoped lang="less">
* {
  user-select: none;
}
</style>