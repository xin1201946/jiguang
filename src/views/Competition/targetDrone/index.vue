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
      <a-space></a-space>
      <TargetDroneModal ref="modal"></TargetDroneModal>
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
<!--            <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>-->
          </a-space>
        </template>
      </a-table>

    </template>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import BizMixins from '@views/biz/bizMixins'
import { targetDroneColumns, targetDroneQuery } from '@views/Competition/targetDrone/targetDrone.config'
import TargetDroneModal from '@views/Competition/targetDrone/modal/targetDroneModal.vue'
export default {
  name: 'targetDrone',
  mixins: [BizMixins],
  components: {
    Card,
    QuerySearch,
    TargetDroneModal
  },
  data() {
    return {
      data: [],
      query: {},
      columns: targetDroneColumns,

    }
  },
  mounted() {
    this.$refs.query.init(targetDroneQuery)
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">

</style>