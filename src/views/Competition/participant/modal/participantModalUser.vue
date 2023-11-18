<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loading"
    width="700"
  >
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      @change="handleTableChange"
      rowKey="tabletPcId"
      :row-selection="rowSelection"
      bordered
    ></a-table>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { participantModalUserTableColumns } from '@views/Competition/participant/participant.config'
export default {
  name: 'participantModalUser',
  components: {
    BizModal
  },
  data() {
    return {
      visible: false,
      title: '编辑人员名单',
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
      },
      columns: participantModalUserTableColumns,
      data: [],
      selectedRowKeys: [],
      rows: []
    }
  },
  computed: {
    rowSelection() {
      return {
        fixed: true,
        type: 'radio',
        onChange: this.handleChange,
        selectedRowKeys: this.selectedRowKeys
      }
    }
  },
  methods: {
    handleOk () {},
    handleCancel() {
      this.visible = false
    },
    // 分页
    handleTableChange (pagination) {
      this.pagination = pagination
      this.getList()
    },
    getList() {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      /*  if (res.code === 200) {
          this.data = res.result.records
          this.pagination.current = res.result.current
          this.pagination.total = res.result.total
        }
        */
    },
    handleChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.rows = selectedRows
    },
    init() {
      this.visible = true
      this.loading = false
      this.selectedRowKeys =[]
      this.rows = []
    }
  }
}
</script>

<style scoped lang="scss">

</style>