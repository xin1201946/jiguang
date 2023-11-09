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
    <template slot="default">
      <a-table
        bordered
        :columns="columns"
        :data-source="data"
        rowKey="deviceId"
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
      <EquipmentModal ref="modal" @list="handleList"></EquipmentModal>
    </template>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
import bizMixins from '@views/biz/bizMixins'
import QuerySearch from '@comp/query/QuerySearch.vue'
import { equipmentColumns, equipmentQuery } from '@views/biz/equipment/equipment.config'
import { deleteMessage } from '@/utils'
import { bizDevicePageList, bizDeviceDelete } from '@api/biz'
import EquipmentModal from '@views/biz/equipment/modal/equipmentModal.vue'

export default {
  name: 'equipment',
  components: {
    Card,
    QuerySearch,
    EquipmentModal
  },
  mixins: [bizMixins],
  data() {
    return {
      columns: equipmentColumns,
      data: [],
      query: {
        deviceNum: undefined,
        deviceType: undefined,
        deviceGunType: undefined,
        deviceStatus: undefined
      }
    }
  },
  mounted() {
    this.$refs.search.init(equipmentQuery)
    this.getList()
  },
  methods: {
    getList() {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      bizDevicePageList(data).then(res => {
        this.data = res.result.records
        this.pagination.current = res.result.current
        this.pagination.total = res.result.total
      })
    },
    handleDelete(record) {
      deleteMessage().then(() => {
        bizDeviceDelete(record.deviceId).then(res => {
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