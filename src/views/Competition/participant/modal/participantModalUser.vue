<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loading"
    :width="700"
  >
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      @change="handleTableChange"
      rowKey="playerId"
      :row-selection="rowSelection"
      bordered
    ></a-table>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { participantModalUserTableColumns } from '@views/Competition/participant/participant.config'
import { bizContestProjectPlayerPageList, bizContestProjectPlayerUpdatePlayer } from '@api/competition'
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
      rows: [],
      obj: {}
    }
  },
  computed: {
    rowSelection() {
      return {
        fixed: true,
        type: 'checkbox',
        onChange: this.handleChange,
        selectedRowKeys: this.selectedRowKeys,
      }
    }
  },
  methods: {
    handleOk () {

      if (this.selectedRowKeys.length) {
        this.loading = true
        bizContestProjectPlayerUpdatePlayer({
          checkList: this.rows,
          ...this.obj
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.handleCancel()
            this.$emit("list")
          }else {
            this.$message.warning(res.message)
          }
          this.loading = false
        })
      }else {
        this.handleCancel()
        this.$emit("list")
      }

    },
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
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      bizContestProjectPlayerPageList(data).then(res => {
        if (res.code === 200) {
          this.data = res.result.records
          this.pagination.current = res.result.current
          this.pagination.total = res.result.total
        }
      })
    },
    handleChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.rows = selectedRows
    },
    inits(arr, arrs, query) {
      this.visible = true
      this.loading = false
      this.selectedRowKeys = arr
      this.rows = arrs
      this.obj = query
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">

</style>