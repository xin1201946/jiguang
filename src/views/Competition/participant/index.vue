<template>
  <div class="participant">
    <!--    顶部-->
    <div class="btns">
      <a-space>
        <a-button v-if="id" type="primary" @click="handleBack">返回赛事列表
        </a-button>
        <a-button type="primary" icon="import" @click="handleImport">导入参赛人员
        </a-button>
      </a-space>
    </div>
    <!--    内容-->
    <div class="cardTrue">
      <TreeCard>
        <!--        左侧树-->
        <template slot="tree">
          <ParticipantTree @change="handleTreeChange" />
        </template>
        <template slot="query">
          <QuerySearch ref="query" @reset="handleSearch" @submit="handleSearch" />
        </template>
        <template slot="operator">
          <a-space>
            <a-button icon="edit" type="primary" @click="handleUserEdit">编辑人员名单</a-button>
          </a-space>
        </template>
        <a-table :columns="columns" :data-source="data" rowKey="tabletPcId" :pagination="pagination"
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
    const id = this.$route.query.id || null
    return {
      id,
      columns: participantTableColumns,
      data: [],
      query: {}
    }
  },
  watch: {
    $route: {
      handler() {
        this.id = this.$route.query.id || null
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
    // 初始化
    listInit() {
      console.log(this.$refs.query)
      this.$refs.query.init(participantQuery)
    },
    // 左侧树回调方法
    handleTreeChange(data) {
      console.log(data)
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
        pageSize: this.pagination.pageSize
      }
      /*  if (res.code === 200) {
          this.data = res.result.records
          this.pagination.current = res.result.current
          this.pagination.total = res.result.total
        }
        */
    },
    // 编辑人员名单回调方法
    handleUserList() {
      this.pagination.current = 1
      this.handleList()
    },
    // 点击编辑人员名单
    handleUserEdit() {
      this.$refs.user.init()
    },
    // 删除
    handleDelete(record) {
      deleteMessage().then(() => {

      })
    },
    // 导入
    handleImport() {

    }
  }
}
</script>

<style scoped lang="less">
@btnHeight: 50px;

* {
  user-select: none;
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