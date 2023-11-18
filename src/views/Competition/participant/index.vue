<template>
  <div class="participant">
    <!--    顶部-->
    <div class="btns">
      <a-space>
        <a-button type="primary" @click="handleBack">返回赛事列表</a-button>
        <a-upload
          accept=".xlsx, xls"
          name="file"
          method="post"
          :showUploadList="false"
          :multiple="false"
          :headers="tokenHeader"
          :action="importExcelUrl"
          :data="(file) => ({file, contestId})"
          @change="handleImportExcel"
        >
          <a-button
            type="primary"
            icon="import"
          >导入参赛人员
          </a-button>
        </a-upload>
        <a-button type="primary" icon="download" @click="handleDownload">下载参赛人员模板
        </a-button>
      </a-space>
    </div>
    <!--    内容-->
    <div class="cardTrue">
      <TreeCard>
        <!--        左侧树-->
        <template slot="tree">
          <ParticipantTree
            @change="handleTreeChange"
            @contest="handleContest"
          />

        </template>
        <template slot="query">
          <QuerySearch ref="query" @reset="handleSearch" @submit="handleSearch" />
        </template>
        <template slot="operator">
          <a-space>
            <a-button icon="edit" type="primary" @click="handleUserEdit">编辑人员名单</a-button>
          </a-space>
        </template>
        <a-table
          :columns="columns"
          :data-source="data"
          :pagination="pagination"
          rowKey="playerId"
          @change="handleTableChange" bordered>
          <template slot="operation" slot-scope="text, record">
            <a-space>
              <a-button type="primary" size="small" ghost icon="edit" @click="handleEdit(record, 'device')">编辑</a-button>
              <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>
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
import { participantQuery, participantTableColumns } from '@views/Competition/participant/participant.config'
import QuerySearch from '@comp/query/QuerySearch.vue'
import BizMixins from '@views/biz/bizMixins'
import ParticipantModal from '@views/Competition/participant/modal/participantModal.vue'
import ParticipantModalUser from '@views/Competition/participant/modal/participantModalUser.vue'
import { deleteMessage } from '@/utils'
import {
  bizContestPlayerDelete,
  bizContestPlayerGetImportTemplate,
  bizContestProjectPlayerPageList,
  bizContestPlayerList
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
        playerSex: undefined,
        groupName: undefined,
        projectGroup: undefined
      },
      list: [],
      api: 'bizContestPlayer/importExcel',
      contestId:this.$route.query.id || null
    }
  },
  computed: {
  },
  watch: {
    $route: {
      handler() {
        this.contestId = this.$route.query.id || null
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
      this.id = data.cproId
      this.pagination.current = 1
      this.$nextTick(() => {
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
      this.closeCurrent()
      this.$nextTick(() => {
        this.$router.push('/competition/competitionList')
      })
    },
    // 获取参数人员列表
    getList() {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
        contestId: this.contestId,
        cproId: this.id
      }
      bizContestProjectPlayerPageList(data).then(res => {
        if (res.code === 200) {
          this.data = res.result.records
          this.pagination.current = res.result.current
          this.pagination.total = res.result.total
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
          cproId: this.id
        }).then(res => {
          if (res.result.length) {
            const list = res.result.map(item => item.playerId)
            this.$refs.user.inits(list, res.result, {
              contestId: this.contestId,
              cproId: this.id
            })
          }else {
            this.$refs.user.inits([], [], {
              contestId: this.contestId,
              cproId: this.id
            })
          }
        })
      }else {
        this.$message.warning("请先选择左侧项目, 再点击编辑人员名单按钮")
      }
    },
    // 删除
    handleDelete(record) {
      deleteMessage().then(() => {
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
          }else {
            this.$message.warning(res.message)
          }
        })
      })
    },
    // 下载
    handleDownload () {
      bizContestPlayerGetImportTemplate()
        .then((res) => this.downLoad(res, '参赛人员模板.xlsx'))
    },
  }
}
</script>

<style scoped lang="less">
@btnHeight: 50px;

* {
}

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
    padding: 0 20px;
  }

  .cardTrue {
    height: calc(100% - @btnHeight - 10px);
  }

  .cardFalse {
    height: 100%;
  }
}
</style>