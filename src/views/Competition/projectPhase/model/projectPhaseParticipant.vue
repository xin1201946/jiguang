<template>
  <div>
    <div v-if="cproId">
      <div style="margin-bottom: 20px" v-if="!disabled">
        <a-space>
          <a-button
            v-if="mode === '0'"
            type="primary"
            @click="handleAdd"
            icon="plus"
          >编辑人员名单
          </a-button>
        </a-space>
      </div>
      <a-table
        bordered
        :pagination="pagination"
        :data-source="data"
        @change="handleTableChange"
        rowKey="playerId"
        size="small"
        :columns="columns"
        :scroll="{ y: 200, x: 1300}"
      >
        <template slot="operation" slot-scope="text, record, index">
          <a-button
            type="danger"
            :disabled="disabled"
            size="small"
            ghost
            icon="delete"
            @click="handleDelete(record)"
          >删除</a-button>
        </template>
      </a-table>
    </div>
    <div v-else style="height: 100%">
      <a-empty description="暂无数据, 请先选择项目, 如没有项目请先添加项目"/>
    </div>
    <ParticipantModalUser ref="user" @list="getList"></ParticipantModalUser>
  </div>
</template>

<script>
import { projectGroup, sexData } from '@views/Competition/participant/participant.config'
import { bizContestPlayerList, bizContestProjectPlayerDelete, bizContestProjectPlayerPageList } from '@api/competition'
import { deleteMessage, getLabel } from '@/utils'
import ParticipantModalUser from '@views/Competition/participant/modal/participantModalUser.vue'


export default {
  name: 'projectPhaseParticipant',
  components: {
    ParticipantModalUser
  },
  props: {
    cproId: {
      type: String,
      required: true
    },
    projectName: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean
    },
    mode: {
      type: String,
      required: true
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
      columns: [
        {
          title: "选手编号",
          dataIndex: 'serialNumber',
          align: 'center',
        },
        {
          title: "姓名",
          dataIndex: 'playerName',
          align: 'center',
        },
        {
          title: "性别",
          align: 'center',
          dataIndex: 'playerSex',
          customRender: text => {

            return getLabel(sexData, text)
          }
        },
        {
          title: "身份证号",
          align: 'center',
          dataIndex: 'idCardNum',
        },
        {
          title: "团体名称",
          align: 'center',
          dataIndex: 'groupName',
        },
        {
          title: "项目组别",
          align: 'center',
          dataIndex: 'projectGroup',
          // customRender: text => getLabel(projectGroup, text)
        },
        {
          title: "操作",
          align: 'center',
          scopedSlots: {
            customRender: 'operation'
          },
          width: 100,
          fixed: 'right'
        },
      ],
      id: "",
      check: '',
      contestId: "",
    }
  },
  watch: {
    $route: {
      handler(n, o) {
        this.check = n.query.check
        this.contestId = n.query.id
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    // 添加
    handleAdd () {
      bizContestPlayerList({
        contestId: this.contestId,
        cproId: this.cproId,
        isAll: 1
      }).then(res => {
        if (res.result.length) {
          const list = res.result.map(item => item.playerId)
          this.$refs.user.inits(list, res.result, {
            contestId: this.contestId,
            cproId: this.cproId
          },this.projectName)
        }else {
          this.$refs.user.inits([], [], {
            contestId: this.contestId,
            cproId: this.cproId
          }, this.projectName)
        }
      })
    },
    getList() {
      const data = {
        cproId: this.id,
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current,
        contestId: this.contestId,
        isAll: '0'
      }
      console.log(data)
      console.log(this.cproId)
      bizContestProjectPlayerPageList(data).then(res => {
        this.data = res.result.records
        this.pagination.current = res.result.current
        this.pagination.total = res.result.total
      })

    },
    handleList() {
      this.id = this.cproId
      this.pagination.current = 1
      this.getList()
    },
    handleTableChange(pagination) {
      this.pagination = pagination
      this.getList()
    },
    handleDelete(record) {
      deleteMessage("请确认是否删除当前项目人员信息").then(() => {
        bizContestProjectPlayerDelete(record.id).then(res => {
          if (res.code === 200) {
            if (this.data.length === 1) {
              if (this.pagination.current !== 1) {
                this.pagination.current = this.pagination.current - 1
              }
            }
            this.$nextTick(() => {
              this.getList()
            })
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
      })
    }
  },
  updated() {
    if (this.id !== this.cproId) {
      this.id = this.cproId
      this.contestId = this.$route.query.id
      this.handleList()
    }
  }
}
</script>

<style scoped lang="less">
/deep/.ant-table-body{
  &::-webkit-scrollbar{
    display: block;
    width: 0 !important;
  }
}
</style>