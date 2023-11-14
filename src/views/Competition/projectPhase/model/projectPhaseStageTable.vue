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
    <projectPhaseStageTableModal ref="modal" @list="getList"></projectPhaseStageTableModal>
  </div>
</template>

<script>
import projectPhaseStageTableModal from '@views/Competition/projectPhase/model/projectPhaseStageTableModal.vue'
import { bizContestProjectStageDelete, bizContestProjectStagePageList } from '@api/competition'
import { deleteMessage } from '@/utils'
export default {
  name: 'projectPhaseStageTable',
  components: {
    projectPhaseStageTableModal
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
      id: "",
      data: [],
      columns: [
        {
          title: "阶段名称",
          dataIndex: "stageName",
          align: 'center'
        },
        {
          title: "阶段顺序",
          dataIndex: "stageOrder",
          align: 'center'
        },
        {
          title: "目标分",
          dataIndex: "targetScore",
          align: 'center'
        },
        {
          title: "平局得分",
          dataIndex: "drawScore",
          align: 'center'
        }
      ]
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
        bizContestProjectStageDelete(record.cproStageId).then(res => {
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
    handleTableChange(pagination) {
      this.pagination = pagination
      this.getList()
    },
    getList() {
      const data = {
        cproId: this.id,
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current
      }
      bizContestProjectStagePageList(data).then(res => {
        this.data = res.result.records
        this.pagination.current = res.result.current
        this.pagination.total = res.result.total
      })
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