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
      rowKey="id"
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
            @click="handleEdit(record, 'device')"
          >编辑</a-button>
          <a-button
            type="primary"
            size="small"
            ghost
            icon="edit"
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

    },
    handleDelete (record) {
      deleteMessage().then(() => {

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