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
        <a-button type="primary" @click="handleAdd('device')" icon="plus">添加</a-button>
      </a-space>
    </template>
    <template slot="default">
      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="tabletPcId"
        :pagination="pagination"
        @change="handleTableChange"
        bordered
      >
        <template slot="operation" slot-scope="text, record, index">
          <a-space>
            <a-button type="primary" size="small" ghost icon="edit" @click="handleEdit(record, 'device')">编辑</a-button>
            <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>
          </a-space>
        </template>
      </a-table>
      <SlabModal ref="modal" @list="handleList"/>
    </template>
  </Card>
</template>

<script>
import QuerySearch from '@comp/query/QuerySearch.vue'
import Card from '@comp/card/card.vue'
import { slabQuery, slabTableColumns, tabletPcModel } from '@views/biz/slab/slab.config'
import { bizTabletPcPageList, bizTabletPcDelete } from '@api/biz'
import SlabModal from '@views/biz/slab/model/SlabModal.vue'
import bizMixins from '@views/biz/bizMixins'
import { deleteMessage } from '@/utils'
export default {
  name: 'slab',
  components: {
    Card,
    QuerySearch,
    SlabModal
  },
  mixins: [bizMixins],
  data() {
    return {
      columns: slabTableColumns,
      data: [],
      query: {
        tabletPcName: undefined,
        tabletPcStatus: undefined,
        tabletPcModel: undefined
      }
    }
  },
  mounted() {
    this.$refs.search.init(slabQuery)
    this.getList()
  },
  methods: {
    // 列表查询
    getList() {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      bizTabletPcPageList(data).then(res => {
        if (res.code === 200) {
          this.data = res.result.records
          this.pagination.current = res.result.current
          this.pagination.total = res.result.total
        }
      })
    },
    handleDelete(record) {
      deleteMessage().then(() => {
        bizTabletPcDelete(record.tabletPcId).then(res => {
          if (res.code === 200) {
            this.getList()
            this.$message.success(res.message)
          }else {
            this.$message.warning(res.message)
          }
        })
      })
    }
  },
}
</script>


<style scoped lang="less">

</style>