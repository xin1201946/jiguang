<template>
  <Card>
    <template slot="query">
      <QuerySearch
        ref="query"
        @submit="handleSearch"
        @reset="handleSearch"
      ></QuerySearch>
    </template>
    <template slot="operator">
      <a-space>
        <a-button
          type="primary"
          @click="handleAdd"
          icon="plus">创建赛事</a-button>
      </a-space>
    </template>
    <a-table
      :columns="columns"
      rowKey="contestId"
      :dataSource="data"
      :pagination="pagination"
      @change="handleTableChange"
      bordered
    >
      <template slot="operation" slot-scope="text, record, index">
        <a-space>
          <a-button
            type="primary"
            size="small"
            ghost
            icon="edit"
            @click="handleEdita(record)"
          >编辑</a-button>
          <a-button
            type="primary"
            size="small"
            ghost
            icon="edit"
            @click="handleEditPhase(record)"
          >编辑比赛</a-button>
          <a-button
            type="primary"
            size="small"
            ghost
            icon="import"
          >导入参赛人员</a-button>
          <a-button
            type="danger"
            size="small"
            ghost
            icon="delete"
            @click="handleDelete(record)"
          >删除</a-button>
        </a-space>
      </template>
    </a-table>
    <CompetitionListModal ref="modal" @list="handleList"></CompetitionListModal>
  </Card>
</template>

<script >
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import { competitionListQuery, competitionListTableColumns } from '@views/Competition/competitionList/competitionList.config'
import BizMixins from '@views/biz/bizMixins'
import CompetitionListModal from '@views/Competition/competitionList/modal/competitionListModal.vue'
import { deleteMessage } from '@/utils'
import { bizContestDelete, bizContestPageList } from '@api/competition'
export default {
  name: 'competitionList',
  components: {
    Card,
    QuerySearch,
    CompetitionListModal
  },
  mixins: [BizMixins],
  data() {
    return {
      data: [],
      columns: competitionListTableColumns,
      query: {
        name: undefined,
        conType: undefined,
        status: undefined
      }
    }
  },

  mounted() {
    this.$refs.query.init(competitionListQuery)
    this.getList()
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
          id: record.contestId
        }
      })
    },
    handleDelete (record) {
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
          }else {
            this.$message.warning(res.message)
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
*{
  user-select: none;
}
</style>