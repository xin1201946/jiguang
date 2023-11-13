<template>
  <Card>
    <template slot="query">
      <QuerySearch
        ref="query"
        @reset="handleSearch"
        @submit="handleSearch"
      ></QuerySearch>
    </template>
<!--    <template slot="operator">
      <a-space>
        <a-button type="primary" @click="handleAdd('tablePc')" icon="plus">添加</a-button>
      </a-space>
    </template>-->
    <a-table
      :columns="columns"
      :data-source="data"
      rowKey="deviceControlId"
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
    <DisplayModal ref="modal" @list="handleList"></DisplayModal>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
import { displayQuery, displayTableColumns } from '@views/control/display/display.config'
import BizMixins from '@views/biz/bizMixins'
import QuerySearch from '@comp/query/QuerySearch.vue'
import { deleteMessage } from '@/utils'
import DisplayModal from '@views/control/display/modal/DisplayModal.vue'
import { displayDelete, displayPageList } from '@api/control'
export default {
  name: 'display',
  components: {
    Card,
    DisplayModal,
    QuerySearch
  },
  mixins: [BizMixins],
  data() {
    return {
      query: {
        targetSize: undefined,
        targetShow: undefined,
        stressCurveShow: undefined,
        sequenceShow: undefined,
        clearTargetWay: undefined,
        autoAmplify: undefined,
        aimCurveShow: undefined,
        tabletPcNum: undefined
      },
      data: [],
      columns: displayTableColumns
    }
  },
  mounted() {
    this.$refs.query.init(displayQuery)
    this.getList()
  },
  methods: {
    getList() {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      displayPageList(data).then(res => {
        if (res.code === 200) {
          this.data = res.result.records
          this.pagination.current = res.result.current
          this.pagination.total = res.result.total
        }
      })
    },
    handleDelete(record) {
      deleteMessage().then(() => {
        displayDelete(record.deviceDisplayId).then(res => {
          if (res.code === 200) {
            this.getList()
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

</style>