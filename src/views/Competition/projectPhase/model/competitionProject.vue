<template>
  <div class="competitionProject">
    <div class="competitionProject_operator" v-if="!disabled">
      <a-space>
        <a-button
          type="primary"
          @click="handleAdd"
          icon="plus"
        >添加项目
        </a-button>
      </a-space>
    </div>
    <div style="width: 100%;">
      <a-table
        bordered
        :pagination="pagination"
        :data-source="data"
        @change="handleTableChange"
        rowKey="cproId"
        size="small"
        :customRow="customRow"
        :columns="columns"
        :row-selection="rowSelection"
        :scroll="{ y: !disabled ? 255 : 320, x: true}"
      >
        <template slot="operation" slot-scope="text, record, index">
          <a-space>
            <a-button
              type="primary"
              size="small"
              ghost
              icon="edit"
              @click="handleEdita(record)"
              :disabled="disabled"
            >编辑</a-button>
            <a-button
              type="danger"
              size="small"
              ghost
              icon="delete"
              :disabled="disabled"
              @click="handleDelete(record)"
            >删除</a-button>
          </a-space>
        </template>
      </a-table>
    </div>
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
    width: 200
  },
  {
    title: "项目组别",
    dataIndex: "projectGroup",
    align: "center",
    width: 150
  },
  {
    title: "比赛模式",
    dataIndex: "mode",
    align: "center",
    width: 80,
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
    align: "center",
    width: 80,
  },
  {
    title: "设备数量",
    dataIndex: "deviceNum",
    align: "center",
    width: 80,
  },
  {
    title: "选手上限",
    dataIndex: "playerLimit",
    align: "center",
    width: 80,
  },
  {
    title: "比赛时间",
    dataIndex: "projectTime",
    align: 'center',
    customRender: (text, record) => {
      return `${record.projectTimeStart} - ${record.projectTimeEnd}`
    },
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'contestId',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 210,
    fixed: 'right'
  }
]

export default {
  name: 'competitionProject',
  components: {
    CompetitionProjectModal
  },
  props: {
    disabled: {
      type: Boolean
    }
  },
  data() {
    return {
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
      data: [],
      columns,
      selectedRowKeys: [],
      check: ''
    }
  },
  watch: {
    $route: {
      handler(n, o) {
        this.check = n.query.check
      },
      immediate: true,
      deep: true
    },
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
        if (this.data.length) {
          this.selectedRowKeys = [this.data[0].cproId]
          this.$emit("change", [this.data[0].cproId], this.data[0].projectName, this.data[0])
        }
        this.pagination.current = res.result.current
        this.pagination.total = res.result.total
      })
    },
    customRow(record) {
      const that = this
      return {
        on: {
          click(){
            that.selectedRowKeys = [record.cproId]
            that.$emit("change", [record.cproId], record.projectName, record)
          }
        }
      }
    },
    handleChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.$emit("change", selectedRowKeys, selectedRows[0].projectName, selectedRows[0])
    },
    handleTableChange (pagination) {
      this.pagination = pagination
      this.getList()
    },
    handleEdita(record) {
      this.$refs.modal.edit(record)
    },
    handleDelete(record) {
      deleteMessage('删除当前项目,会删除下属项目阶段、项目设备,是否删除该条信息').then(() => {
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
            this.$message.error(res.message)
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
  /deep/.ant-table-body{
    &::-webkit-scrollbar{
      box-sizing: border-box;
      display: block;
      width: 0 !important;
    }
  }
}
</style>