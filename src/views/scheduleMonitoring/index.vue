<template>
  <div class="card">
    <Card>
      <a-form layout="inline" style="margin-bottom: 20px">
        <a-space>
          <a-form-item label="赛事名称">
            <a-select style="width: 350px" v-model="formData.contest.contestId" placeholder="请选择赛事">
              <a-select-option v-for="item in list" :key="item.id" :value="item.contestId"
                >{{ item.contestName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-space>
        <a-form-model-item :labelCol="{ span: 0 }">
          <a-space>
            <a-button @click="handleSearch" type="primary" icon="search">查询</a-button>
            <a-button @click="handleReset" icon="reload">重置</a-button>
          </a-space>
        </a-form-model-item>
      </a-form>
      <!--  :pagination="pagination" -->
      <a-table
        bordered
        :columns="columns"
        rowKey="id"
        :data-source="data"
        :loading="loading"
        @change="handleTableChange"
        :pagination="false"
      >
        <template slot="action" slot-scope="text, record">
          <a-button @click="edit(record)">结束阶段</a-button>
        </template>
      </a-table>
    </Card>
  </div>
</template>
  
  <script>
import Card from '@comp/card/card.vue'
import { contestProcess } from '@api/schedule'
import { bizContestPageList, endFire } from '@api/competition'
import { infoMessage, numToCapital } from '@/utils'
export default {
  name: 'scheduleMonitoring',
  components: {
    Card,
  },
  data() {
    return {
      formData: {
        contest: {
          contestId: undefined,
          contestName: '',
        },
      },
      data: [],
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
      },
      columns: [
        {
          title: '赛事名称',
          dataIndex: 'contestName',
          align: 'center',
        },

        {
          title: '项目名称',
          dataIndex: 'cproName',
          align: 'center',
        },
        {
          title: '项目组别',
          dataIndex: 'projectGroup',
          align: 'center',
        },
        {
          title: '阶段名称',
          dataIndex: 'stageName',
          align: 'center',
        },
        {
          title: '阶段组别',
          key: 'stageGroup',
          dataIndex: 'stageGroup',
          align: 'center',
          customRender: (text, record, index) => {
            return `${numToCapital(record.stageGroup)}组`
          },
        },
        {
          title: '操作',
          key: 'id',
          scopedSlots: { customRender: 'action' },
          align: 'center',
        },
      ],
      loading: false,
      hasResetted: false,
    }
  },
  beforeRouteEnter(to, from, next) {
    // 当进入该路由前调用
    next((vm) => {
      vm.handleReset()
    })
  },

  mounted() {
    bizContestPageList({
      pageNum: 1,
      pageSize: 999,
    }).then((res) => {
      this.list = res.result.records
    })
  },
  methods: {
    // 分页
    handleTableChange(pagination) {
      this.pagination = pagination
      this.handleReset()
    },
    //查询
    handleSearch() {
      let id = this.formData.contest.contestId
      this.loading = true
      contestProcess({ contestId: id }).then((res) => {
        if (res.success) {
          this.data = res.result
          this.loading = false
        } else {
          this.$message.error(res.message)
          this.loading = false
        }
      })
    },
    //重置
    handleReset() {
      this.formData.contest.contestId = undefined
      this.formData.contest.contestName = ''
      contestProcess().then((res) => {
        if (res.success) {
          this.data = res.result
          this.loading = false
        } else {
          this.$message.error(res.message)
          this.loading = false
        }
      })
    },
    //结束阶段
    edit(record) {
      infoMessage(
        `是否结束${record.cproName}-${record.projectGroup}  ${record.stageName}${numToCapital(record.stageGroup)}组`
      ).then(() => {
        endFire({
          stageId: record.stageId,
          group: record.stageGroup,
        }).then((res) => {
          if (res.success) {
            this.$message.success('结束成功！')
            this.handleReset()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
  },
}
</script>
  
  <style lang="less" scoped>
.card {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.spce_div {
  display: flex;
  justify-content: flex-end;
}

.text_s {
  color: red;
  font-size: 14px;
}
</style>