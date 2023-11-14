<template>
  <div v-if="cproId">
    <div style="margin-bottom: 20px">
      <a-space>
        <a-button
          type="primary"
          @click="handleAdd"
          icon="plus"
        >添加
        </a-button>
      </a-space>
    </div>
    <a-table
      bordered
      :pagination="pagination"
      :data-source="data"
      @change="handleTableChange"
      rowKey="cproDeviceId"
      size="small"
      :columns="columns"
    >
      <template slot="operation" slot-scope="text, record, index">
        <a-space>
          <a-button
            type="primary"
            size="small"
            ghost
            icon="edit"
            @click="handleEdit(record)"
          >编辑</a-button>
          <a-button
            type="danger"
            size="small"
            ghost
            icon="delete"
            @click="handleDelete(record)"
          >删除</a-button>
        </a-space>
      </template>
    </a-table>
    <ProjectPhaseDeviceTableModal ref="modal" @list="getList"></ProjectPhaseDeviceTableModal>
  </div>
</template>

<script>
import { bizContestProjectDeviceDelete, bizContestProjectDevicePageList } from '@api/competition'
import { deleteMessage } from '@/utils'
import ProjectPhaseDeviceTableModal from '@views/Competition/projectPhase/model/projectPhaseDeviceTableModal.vue'
const columns = [
  {
    title: "枪设备号",
    dataIndex: "gunDeviceNum",
    align: 'center'
  },
  {
    title: "平板设备号",
    dataIndex: "tabletPcNum",
    align: 'center'
  },
  {
    title: "靶设备号",
    dataIndex: "targetDeviceNum",
    align: 'center'
  },
  {
    title: "靶位",
    dataIndex: "targetSite",
    align: 'center'
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'cproDeviceId',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 200,
    fixed: 'right'
  }
]

export default {
  name: 'projectPhaseDeviceTable',
  components: {
    ProjectPhaseDeviceTableModal
  },
  props: {
    cproId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 4,
        total: 0
      },
      data: [],
      columns,
      id: ""
    }
  },
  methods: {
    handleAdd() {
      this.$refs.modal.init(this.id)
    },
    handleEdit(record) {
      this.$refs.modal.edit(record,this.id)
    },
    handleDelete(record) {
      deleteMessage().then(() => {
        bizContestProjectDeviceDelete(record.cproDeviceId).then(res => {
          if (res.code === 200) {
            if (this.data.length === 1) {
              if (this.pagination.current !== 1 ){
                this.pagination.current = this.pagination.current - 1
              }
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
    },
    handleList() {
      this.pagination.current = 1
      this.getList()
    },
    getList() {
      const data = {
        cproId: this.id,
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current
      }
      bizContestProjectDevicePageList(data).then(res => {
        this.data = res.result.records
        this.pagination.current = res.result.current
        this.pagination.total = res.result.total
      })
    },
    handleTableChange(pagination) {
      this.pagination = pagination
      this.getList()
    }
  },
  updated() {
    if (this.id !== this.cproId) {
      this.id = this.cproId
      this.handleList()
    }
  }
}
</script>

<style scoped lang="less">

</style>