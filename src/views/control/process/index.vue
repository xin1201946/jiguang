<template>
  <Card>
    <template slot="query">
      <QuerySearch
        ref="query"
        @reset="handleSearch"
        @submit="handleSearch"
      ></QuerySearch>
    </template>
    <template slot="operator">
      <a-space>
        <a-button type="primary" @click="handleAdd('tablePc')" icon="plus">添加</a-button>
      </a-space>
    </template>
    <a-table
      :columns="columns"
      :data-source="data"
      rowKey="deviceDisplayId"
      :pagination="pagination"
      @change="handleTableChange"
      bordered
    >
      <template slot="operation" slot-scope="text, record, index">
        <a-space>
          <a-space>
            <a-button type="primary" size="small" ghost icon="edit" @click="handleEdit(record, 'tablePc')">编辑</a-button>
            <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>
          </a-space>
        </a-space>
      </template>
    </a-table>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import BizMixins from '@views/biz/bizMixins'
import { processTableColumns, processQuery } from '@views/control/process/process.config'
import { deleteMessage } from '@/utils'
export default {
  name: 'process',
  components: {
    Card,
    QuerySearch
  },
  mixins: [BizMixins],
  data() {
    return {
      data: [],
      columns: processTableColumns,
      query: {}
    }
  },
  mounted() {
    this.$refs.query.init(processQuery)
  },
  methods: {
    getList() {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
    },
    handleDelete() {
      deleteMessage().then(() => {

      })
    }
  }
}
</script>

<style scoped lang="less">

</style>