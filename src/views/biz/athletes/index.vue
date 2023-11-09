<template>
  <Card>
    <template slot="query">
      <QuerySearch
        ref="search"
        @reset="handleSearch"
        @submit="handleSearch"
      ></QuerySearch>
    </template>
    <template slot="operator">
      <a-space>
        <a-button type="primary" @click="handleAdd" icon="plus">添加</a-button>
      </a-space>
    </template>
    <template>
      <a-table
        bordered
        :columns="columns"
        :data-source="data"
        rowKey="entryFormId"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="operation" slot-scope="text, record, index">
          <a-space>
            <a-button type="primary" size="small" ghost icon="edit" @click="handleEdit(record)">编辑</a-button>
            <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>
          </a-space>
        </template>
      </a-table>
      <AthletesModal ref="modal" @list="handleList"></AthletesModal>
    </template>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import { athletesQuery, athletesColumns } from '@views/biz/athletes/athletes.config'
import { bizEntryFormDelete, bizEntryFormPageList } from '@api/biz'
import AthletesModal from '@views/biz/athletes/modal/athletesModal.vue'
import { deleteMessage } from '@/utils'
import bizMixins from '@views/biz/bizMixins'
export default {
  name: 'athletes',
  components: {
    QuerySearch,
    Card,
    AthletesModal
  },
  mixins: [bizMixins],
  data() {
    return {
      columns: athletesColumns,
      data: [],
      query: {
        entryName: undefined,
        entrySex: undefined,
        entryType: undefined
      },
    }
  },
  mounted() {
    this.$refs.search.init(athletesQuery)
    this.getList()
  },
  methods: {
    handleDelete (record) {
      deleteMessage().then(() => {
        bizEntryFormDelete(record.entryFormId).then(res => {
          if (res.code === 200) {
            this.getList()
            this.$message.success(res.message)
          }else {
            this.$message.warning(res.message)
          }
        })
      })
    },
    getList () {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      // console.log(data)
      bizEntryFormPageList(data).then(res => {
        this.data = res.result.records
        this.pagination.current = res.result.current
        this.pagination.total = res.result.total
      })
    }
  }
}
</script>


<style scoped lang="less">

</style>