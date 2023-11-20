<template>
  <Card>
    <template slot="query">
      <QuerySearch
        ref="query"
      ></QuerySearch>
    </template>
    <a-table
      :columns="columns"
      :pagination="pagination"
      @change="handleTableChange"
      :data-source="data"
      bordered
      rowKey="tabletPcId"
    >
      <template slot="operation" slot-scope="text, record, index">
        <a-space>
          <a-button type="primary" size="small" ghost icon="edit" @click="handleEdit">开始比赛</a-button>
          <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </Card>
</template>

<script>
import QuerySearch from '@comp/query/QuerySearch.vue'
import Card from '@comp/card/card.vue'
import { gameQuery, gameTableColumns } from '@views/Competition/game/game.config'
import BizMixins from '@views/biz/bizMixins'
export default {
  name: 'game',
  components: {
    Card,
    QuerySearch
  },
  mixins: [BizMixins],
  data() {
    return {
      query: {

      },
      columns: gameTableColumns,
      data: []
    }
  },
  mounted() {
    this.$refs.query.init(gameQuery)
  },
  methods: {
    handleDelete(record) {}
  }
}
</script>

<style scoped lang="less">

</style>