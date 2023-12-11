<template>
  <div class="participant">
    <!--    顶部-->
    <div class="btns">
      <a-space>
        <!-- <a-button type="primary" @click="handleBack">返回赛事列表</a-button> -->
        <a-page-header :title="title" @back="handleBack" />
        <a-upload
          accept=".xlsx, xls"
          name="file"
          method="post"
          :showUploadList="false"
          :multiple="false"
          :headers="tokenHeader"
          :action="importExcelUrl"
          :data="(file) => ({ file, contestId })"
          @change="handleImportExcel"
          :disabled="status !== '0'"
        >
          <a-button :disabled="status !== '0'" type="primary" icon="import">导入参赛人员</a-button>
        </a-upload>
        <a-button :disabled="status !== '0'" type="primary" icon="download" @click="handleDownload">下载参赛人员模板</a-button>
      </a-space>
    </div>
    <!--    内容-->
    <div class="cardTrue">
      <TreeCard>
        <!--        左侧树-->
        <template slot="tree">
          <ParticipantTree @change="handleTreeChange" @contest="handleContest" @treeList="handleTreeList"/>
        </template>
        <template slot="query">
          <QuerySearch ref="query" @reset="handleSearch" @submit="handleSearch" />
        </template>
        <template slot="operator">
          <a-space v-if="status === '0'">
            <template v-show="t !== '全部'">
              <a-button v-show="!t.includes('团体')" icon="edit" type="primary" @click="handleUserEdit">编辑人员名单</a-button>
            </template>
            <a-button v-show="t === '全部'" icon="edit" type="primary" @click="handleAdds">添加</a-button>
            <a-button :disabled="!selectedRowKeys.length" type="danger" icon="delete" @click="handleDeletes">删除</a-button>
            <a-button v-show="t === '全部'" type="danger" icon="delete" @click="handleAllDeletes">全部删除</a-button>
          </a-space>
        </template>
        <a-table
          :scroll="{x: 1400}"
          :columns="columns"
          :data-source="data"
          :pagination="pagination"
          rowKey="playerId"
          @change="handleTableChange"
          bordered
          size="small"
          :row-selection="rowSelection"
        >
          <template slot="operation" slot-scope="text, record">
            <a-space v-if="status === '0'">
              <a-button :disabled="t !== '全部'" type="primary" size="small" ghost icon="edit" @click="handleEdits(record, 'event')">编辑</a-button>
              <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>
            </a-space>
            <a-space v-else>
              <a-button disabled type="primary" size="small" ghost icon="edit" @click="handleEdits(record, 'event')">编辑</a-button>
              <a-button disabled type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>
            </a-space>
          </template>
        </a-table>
      </TreeCard>
      <!--      编辑-->
      <ParticipantModal ref="modal" @list="handleList"></ParticipantModal>
      <!--      编辑人员名单-->
      <ParticipantModalUser ref="user" @list="handleUserList"></ParticipantModalUser>
    </div>
  </div>
</template>

<script>
import TreeCard from '@comp/card/TreeCard.vue'
import ParticipantTree from '@views/Competition/participant/modal/ParticipantTree.vue'
import {
  participantQuery,
  participantTableColumns,
  participantTableColumnsAll
} from '@views/Competition/participant/participant.config'
import QuerySearch from '@comp/query/QuerySearch.vue'
import BizMixins from '@views/biz/bizMixins'
import ParticipantModal from '@views/Competition/participant/modal/participantModal.vue'
import ParticipantModalUser from '@views/Competition/participant/modal/participantModalUser.vue'
import { deleteMessage } from '@/utils'
import {
  bizContestPlayerDelete,
  bizContestPlayerGetImportTemplate,
  bizContestProjectPlayerPageList,
  bizContestPlayerList, bizContestProjectPlayerDelete, bizContestPlayerDeleteAll
} from '@api/competition'
export default {
  name: 'participant',
  components: {
    TreeCard,
    ParticipantTree,
    QuerySearch,
    ParticipantModal,
    ParticipantModalUser
  },
  mixins: [BizMixins],
  inject: ["closeCurrent"],
  data() {
    return {
      id: undefined,
      columns: participantTableColumns,
      data: [],
      query: {
        playerName: undefined,
        groupName: undefined,
        projectGroup: undefined
      },
      list: [],
      api: 'bizContestPlayer/importExcel',
      contestId: this.$route.query.id || null,
      title: undefined,
      t: '全部',
      treeList: [],
      status: '',
      selectedRowKeys: [],
      projectName: ''
    }
  },
  computed: {
    rowSelection() {
      return {
        type: 'checkbox',
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
        }
      }
    }
  },
  watch: {
    $route: {
      handler() {
        this.contestId = this.$route.query.id || null
        this.title = this.$route.query.contestName || null
        this.status = this.$route.query.status
        this.$nextTick(() => {
          this.listInit()
        })
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.listInit()
    this.status = this.$route.query.status
  },
  methods: {
    // 获取赛事id
    handleContest(contestId, id) {
      this.contestId = contestId
      this.id = id
      this.pagination.current = 1
      this.$nextTick(() => {
        this.getList()
      })
    },
    // 左侧树回调方法
    handleTreeChange(data) {
      this.t = data.title
      this.id = data.cproId
      this.pagination.current = 1
      this.$nextTick(() => {
        if (data.title) {
          this.columns = participantTableColumnsAll
        }else {
          this.columns = participantTableColumns
        }
        this.getList()
      })
    },
    // 初始化
    listInit() {
      this.$refs.query.init(participantQuery)
      this.pagination.current = 1
      this.getList()
    },
    // 点击返回赛事列表
    handleBack() {
      this.$nextTick(() => {
        this.$router.push('/competition/competitionList')
        this.closeCurrent()
      })
    },
    // 获取参数人员列表
    getList() {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
        contestId: this.contestId,
        cproId: this.id,
        isAll: this.t !== '全部' ? '0' : '1'
      }
      bizContestProjectPlayerPageList(data).then(res => {
        if (res.code === 200) {
          this.data = res.result.records
          this.pagination.current = res.result.current
          this.pagination.total = res.result.total
          this.selectedRowKeys = []
        }
      })
    },
    // 编辑人员名单回调方法
    handleUserList() {
      this.pagination.current = 1
      this.handleList()
    },
    // 点击编辑人员名单
    handleUserEdit() {
      // 获取当前项目所有的人员
      if (this.id !== undefined) {
        bizContestPlayerList({
          contestId: this.contestId,
          cproId: this.id,
          isAll: '1'
        }).then(res => {
          if (res.result.length) {
            const list = res.result.map(item => item.playerId)
            this.$refs.user.inits(list, res.result, {
              contestId: this.contestId,
              cproId: this.id
            },this.t)
          }else {
            this.$refs.user.inits([], [], {
              contestId: this.contestId,
              cproId: this.id
            }, this.t)
          }
        })
      }else {
        this.$message.error("请先选择左侧项目, 再点击编辑人员名单按钮")
      }
    },
    // 删除
    // 全部删除
    handleAllDeletes() {
      deleteMessage("请确认是否删除全部赛事人员信息").then(() => {
        bizContestPlayerDeleteAll({
          contestId: this.contestId
        }).then(res => {
          if (res.code === 200) {
            this.pagination.current = 1
            this.getList()
          }else {
            this.$message.error(res.message)
          }
        })
      })
    },
    // 批量删除
    handleDeletes () {
      deleteMessage("请确认是否删除当前选中的所有赛事人员信息").then(() => {
        bizContestPlayerDelete(this.selectedRowKeys.join(',')).then(res => {
          if (res.code === 200) {
            this.pagination.current = 1
            this.getList()
          }else {
            this.$message.error(res.message)
          }
        })
      })

    },
    // 单个删除
    handleDelete(record) {
      if (this.t === '全部') {
        deleteMessage('请确认是否删除当前赛事人员信息').then(() => {
          bizContestPlayerDelete(record.playerId).then(res => {
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
      }else{
        console.log(record)
        deleteMessage('请确认是否删除当前项目人员信息').then(() => {
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
    // 导入
    handleImportExcels() {

    },
    // 下载
    handleDownload() {
      bizContestPlayerGetImportTemplate()
        .then((res) => this.downLoad(res, '参赛人员模板.xlsx'))
    },
    handleTreeList(list) {
      this.treeList = list
    },
    handleAdds() {
      this.$refs.modal.list = this.treeList
      this.handleAdd()
    },
    handleEdits(record) {
      this.$refs.modal.list = this.treeList
      this.handleEdit(record)
    }
  }
}
</script>

<style scoped lang="less">
@btnHeight: 50px;

.participant {
  height: 100%;
  overflow-y: hidden;

  .btns {
    height: @btnHeight;
    background: #fff;
    margin-bottom: 10px;
    line-height: @btnHeight;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px 0 0;

    .btns_box {
      display: flex;
    }
  }

  .cardTrue {
    height: calc(100% - @btnHeight - 10px);
  }

  .cardFalse {
    height: 100%;
  }
}

/deep/.ant-page-header {
  padding: 16px 24px 16px 10px !important;
}

/deep/.ant-page-header-back {
  font-size: 20px;
}
</style>