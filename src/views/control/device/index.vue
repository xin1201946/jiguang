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
    <DeviceModal ref="modal" @list="handleList"></DeviceModal>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import { deviceQuery, deviceTableColumns, shootControl } from '@views/control/device/device.config'
import BizMixins from '@views/biz/bizMixins'
import DeviceModal from '@views/control/device/Modal/DeviceModal.vue'
import { controlDelete, controlPageList } from '@api/control'
import { deleteMessage } from '@/utils'
export default {
  name: 'device',
  components: {
    Card,
    QuerySearch,
    DeviceModal
  },
  mixins: [BizMixins],
  data() {
    return {
      data: [],
      columns: deviceTableColumns,
      query: {
        tabletPcNum: undefined,
        indicateTargetControl: undefined,
        shootControl: undefined,
        soundControl: undefined,
        targetCollect: undefined,
        triggerCollect: undefined
      }
    }
  },
  mounted() {
    this.$refs.query.init(deviceQuery)
    this.getList()
  },
  methods: {
    getList () {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      controlPageList(data).then(res => {
        if (res.code === 200) {
          this.data = res.result.records
          this.pagination.current = res.result.current
          this.pagination.total = res.result.total
        }
      })
    },
    handleDelete(record) {
      deleteMessage().then(() => {
        controlDelete(record.deviceControlId).then(res => {
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

<style scoped lang="scss">

</style>