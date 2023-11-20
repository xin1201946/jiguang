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
      size="small"
      bordered
    ></a-table>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { participantModalUserTableColumns } from '@views/Competition/participant/participant.config'
import { bizContestProjectPlayerPageList, bizContestProjectPlayerUpdatePlayer } from '@api/competition'
import { infoMessage } from '@/utils'
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
      selectedRowKeysBf: [],
      rows: [],
      obj: {},
      projectName: ''
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
        // this.loading = true
        // console.log(this.rows)
        const names = this.rows.filter(item => {
          if (item.projectNames) {
            return item.projectNames.includes(this.projectName)
          }
          return false
        })
        if (names.length !== this.rows.length) {
          infoMessage("选中人员存在不属于当前项目的人员，请确认是否添加").then(() => {
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
          })
        }else {
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
        }
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
        pageSize: this.pagination.pageSize,
        contestId: this.obj.contestId,
        isAll: '1'
      }
      bizContestProjectPlayerPageList(data).then(res => {
        if (res.code === 200) {
          this.data = res.result.records
          this.pagination.current = res.result.current
          this.pagination.total = res.result.total

          const arr = this.data.filter(item => {
            if (item.projectNames) {
              return item.projectNames.includes(this.projectName)
            }
            return false
          })
          if (arr.length) {
            this.selectedRowKeys = arr.map(item => item.playerId)
            this.rows = arr
            this.selectedRowKeysBf = arr
          }else {
            this.selectedRowKeys = []
            this.rows = []
            this.selectedRowKeysBf = []
          }
        }
      })
    },
    handleChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.rows = selectedRows
    },
    inits(arr, arrs, query, name) {
      console.log(name)
      this.projectName = name
      this.visible = true
      this.loading = false
      this.selectedRowKeys = arr
      this.selectedRowKeysBf = arrs
      this.rows = arrs
      this.obj = query
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">

</style>