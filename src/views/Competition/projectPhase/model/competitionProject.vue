<template>
  <div class="competitionProject">
    <div class="competitionProject_operator">
      <a-space>
        <a-button
          type="primary"
          @click="handleAdd"
          icon="plus"
        >添加项目
        </a-button>
      </a-space>
    </div>
    <a-table
      bordered
      :pagination="pagination"
      :data-source="data"
      @change="handleTableChange"
      rowKey="cproId"
      size="small"
      :columns="columns"
      :row-selection="rowSelection"
      :scroll="{ y: 120 }"
    >
      <template slot="operation" slot-scope="text, record, index">
        <a-space>
          <a-button
            type="primary"
            size="small"
            ghost
            icon="edit"
            @click="handleEdita(record)"
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
    <CompetitionProjectModal ref="modal" @list="getList"></CompetitionProjectModal>
  </div>
</template>

<script >
import { bizContestProjectDelete, bizContestProjectPageList } from '@api/competition'
import { deleteMessage } from '@/utils'
import CompetitionProjectModal from '@views/Competition/projectPhase/model/competitionProjectModal.vue'

const columns = [
  {
    title: "项目名称",
    dataIndex: "projectName",
    align: "center",
    width: 200,
  },
  {
    title: "比赛模式",
    dataIndex: "mode",
    align: "center",
    customRender: (text) => {
      if (String(text) === '0') {
        return '个人赛'
      }
      if (String(text) === '1') {
        return '混团赛'
      }
    }
  },
  {
    title: "团队人数",
    dataIndex: "groupSize",
    align: "center"
  },
  {
    title: "设备数量",
    dataIndex: "deviceNum",
    align: "center"
  },
  {
    title: "选手上限",
    dataIndex: "playerLimit",
    align: "center"
  },
  {
    title: "报名时间",
    dataIndex: "projectTime",
    align: 'center',
    width: 400,
    customRender: (text, record) => {
      return `${record.projectTimeStart} - ${record.projectTimeEnd}`
    }
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'contestId',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 200,
    fixed: 'right'
  }
]

export default {
  name: 'competitionProject',
  components: {
    CompetitionProjectModal
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
    }
  },
  computed: {
    rowSelection() {
      return {
        fixed: true,
        type: 'radio',
        onChange: this.handleChange
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleAdd() {
      this.$refs.modal.init()
    },
    getList() {
      const data = {
        contestId: this.$route.query.id,
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current
      }
      bizContestProjectPageList(data).then(res => {
        this.data = res.result.records
        this.pagination.current = res.result.current
        this.pagination.total = res.result.total
      })
    },
    handleChange(selectedRowKeys, selectedRows) {
      this.$emit("change", selectedRowKeys)
    },
    handleTableChange (pagination) {
      this.pagination = pagination
      this.getList()
    },
    handleEdita(record) {
      this.$refs.modal.edit(record)
    },
    handleDelete(record) {
      deleteMessage().then(() => {
        bizContestProjectDelete(record.cproId).then(res => {
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
    }
  }
}
</script>

<style scoped lang="less">
.competitionProject{
  &_operator{
    margin-bottom: 20px;
  }
}
</style>