<template>
  <div>
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
        :scroll="{ y: 330, x: 1200}"
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
    <div v-else>
      <a-empty description="暂无数据, 请先选择项目, 如没有项目请先添加项目"/>
    </div>
  </div>
</template>

<script>
import projectPhaseStageTableModal from '@views/Competition/projectPhase/model/projectPhaseStageTableModal.vue'
import { bizContestProjectStageDelete, bizContestProjectStagePageList } from '@api/competition'
import { deleteMessage, getLabel } from '@/utils'
import {
  integrationMethod,
  isAdjustment,
  isGroupRank,
  playerGroup,
  scoreModel
} from '@views/Competition/projectPhase/projectPhase.config'
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
          title: "是否团体排名",
          dataIndex: "isGroupRank",
          align: 'center',
          width: 120,
          customRender: text => getLabel(isGroupRank, text)
        },
        {
          title: "参团选手",
          dataIndex: "playerGroup",
          align: 'center',
          customRender: text => getLabel(playerGroup, text)
        },
        {
          title: "参团人数",
          dataIndex: "playerNum",
          align: 'center'
        },
        {
          title: "积分方式",
          dataIndex: "integrationMethod",
          align: 'center',
          width: 140,
          customRender: text => getLabel(integrationMethod, text)
        },
        {
          title: "计分模式",
          dataIndex: "scoreModel",
          align: 'center',
          customRender: text => getLabel(scoreModel, text)
        },
        {
          title: "默认组数",
          dataIndex: "groupCount",
          align: 'center'
        },
        {
          title: "每组枪数",
          dataIndex: "gunsPerGroup",
          align: 'center'
        },
        {
          title: "射击时长",
          dataIndex: "shootPeriod",
          align: 'center'
        },
        {
          title: "是否试射",
          dataIndex: "isAdjustment",
          align: 'center',
          customRender: text => getLabel(isAdjustment, text)
        },
        {
          title: "晋级名次",
          dataIndex: "riseNum",
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