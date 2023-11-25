<template>
  <TreeCard :width="false">
    <template slot="tree">
      <div style="width: 220px">
        <a-radio-group v-model="contestId">
          <a-radio
            :style="style"
            v-for="(item, i) in radioData"
            :key="i"
            :value="item.value"
          >{{item.label}}</a-radio>
        </a-radio-group>
      </div>
    </template>
    <template slot="query">
      <QuerySearch
        ref="query"
        @submit="handleSearch"
        @reset="handleSearch"
      />
    </template>
    <template slot="operator">
      <a-space>
        <a-button type="primary" icon="plus" @click="handleAdds">添加</a-button>
      </a-space>
    </template>
    <template slot="default">
      <a-table
        :columns="columns"
        :pagination="pagination"
        @change="handleTableChange"
        bordered
        :data-source="data"
        rowKey="groupId"
      >
        <template slot="operation" slot-scope="text, record, index">
          <a-space>
            <a-button type="primary" size="small" ghost icon="profile" @click="handleInfo(record)">详情</a-button>
            <a-button type="primary" size="small" ghost icon="edit" @click="handleEdits(record)">编辑</a-button>
<!--            <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>-->
          </a-space>
        </template>
      </a-table>
      <TeamGroupManageModal ref="modal" @list="handleList"></TeamGroupManageModal>
    </template>
  </TreeCard>
</template>

<script>
import BizMixins from '@views/biz/bizMixins'
import TreeCard from '@comp/card/TreeCard.vue'
import Card from '@comp/card/card.vue'
import { radioStyle } from '@/utils'
import QuerySearch from '@comp/query/QuerySearch.vue'
import { teamGroupManageQuery, teamGroupManageTable } from '@views/teamGroup/teamGroupManage/teamGroupManage.config'
import { bizContestList } from '@api/competition'
import TeamGroupManageModal from '@views/teamGroup/teamGroupManage/modal/teamGroupManageModal.vue'
import { deleteMessage } from '@/utils'
import { bizGroupPageList } from '@api/teamGroup'
export default {
  name: 'teamGroupManage',
  components: {
    TreeCard,
    Card,
    QuerySearch,
    TeamGroupManageModal
  },
  mixins: [BizMixins],
  data() {
    return {
      radioData: [],
      style: radioStyle,
      query: {},
      contestId: '',
      columns: teamGroupManageTable,
      data: []
    }
  },
  watch: {
    $route:{
      handler(){
        this.$nextTick(() => {
          this.getTree()
        })
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.$refs.query.init(teamGroupManageQuery)
    this.getTree()
  },
  methods: {
    getTree() {
      bizContestList().then(res => {
        if (res.result.length) {
          this.radioData = res.result.map(item => ({
            label: item.contestName,
            value: item.contestId
          }))
          this.contestId = this.radioData[0].value
          /* this.$refs.query.init(teamGroupManageQuery.map(item => {
            if (item.type === 'search') {
              item.data = this.radioData
            }
            return item
          })) */
        }else {
          this.radioData = []
          // this.$refs.query.init(teamGroupManageQuery)
        }
        this.getList()
      })
    },
    getList() {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
        contestId: this.contestId
      }
      bizGroupPageList(data).then(res => {
        this.data = res.result.records
        this.pagination.current = res.result.current
        this.pagination.total = res.result.total
      })
    },
    handleInfo(record) {

      this.$refs.modal.info(record, this.contestId, name.label)
      // this.$router.push('/teamGroup/teamGroupManageInfo')
    },
    handleDelete(record) {
      deleteMessage('是否删除当前团队').then(() => {
        this.deleteCallback()
      })
    },
    handleEdits(record) {
      const name = this.radioData.filter(item => item.value === this.contestId)[0]
      this.$refs.modal.edit(record, this.contestId, name.label)
    },
    handleAdds() {
      const name = this.radioData.filter(item => item.value === this.contestId)[0]
      this.$refs.modal.init(this.contestId, name.label)
    }
  }
}
</script>

<style scoped lang="less">

</style>