<template>
  <div>
    <div v-if="cproId">
      <div style="margin-bottom: 20px" v-if="!disabled">
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
        :scroll="{ y: 200, x: 1000}"
      >
        <template slot="targetSite" slot-scope="text, record, index">
          <a-input :disabled="disabled" oninput="value=value.replace(/[^\d]/g,'')" @focus="handleBindFocus(record, index)" v-model="record.targetSite"></a-input>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a-space>
<!--            <a-button
              type="primary"
              size="small"
              ghost
              icon="edit"
              :disabled="disabled"
              @click="handleEdit(record)"
            >编辑</a-button>-->
            <a-button
              type="primary"
              size="small"
              ghost
              icon="bind"
              :disabled="disabled"
              @click="handleBind(record)"
            >绑定靶位</a-button>
            <a-button
              type="danger"
              :disabled="disabled"
              size="small"
              ghost
              icon="delete"
              @click="handleDelete(record)"
            >删除</a-button>
          </a-space>
        </template>
      </a-table>
      <ProjectPhaseDeviceTableModal ref="modal" @list="getList"></ProjectPhaseDeviceTableModal>
      <ProjectPhaseDeviceTableModalBind ref="bind" @list="getList"></ProjectPhaseDeviceTableModalBind>
    </div>
    <div v-else style="height: 100%">
      <a-empty description="暂无数据, 请先选择项目, 如没有项目请先添加项目"/>
    </div>
  </div>
</template>

<script>
import {
  bizContestProjectDeviceDelete,
  bizContestProjectDevicePageList,
  bizContestProjectDeviceUpdate
} from '@api/competition'
import { deleteMessage } from '@/utils'
import ProjectPhaseDeviceTableModal from '@views/Competition/projectPhase/model/projectPhaseDeviceTableModal.vue'
import ProjectPhaseDeviceTableModalBind
  from '@views/Competition/projectPhase/model/projectPhaseDeviceTableModalBind.vue'
const columns = [
  {
    title: "平板设备号",
    dataIndex: "tabletPcNum",
    align: 'center'
  },
  {
    title: "激光训练器",
    dataIndex: "gunDeviceNum",
    align: 'center'
  },
  {
    title: "激光接收靶",
    dataIndex: "targetDeviceNum",
    align: 'center'
  },
  {
    title: "靶位",
    dataIndex: "targetSite",
    align: 'center',
    scopedSlots: {
      customRender: 'targetSite'
    },
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'cproDeviceId',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 250,
    fixed: 'right'
  }
]

export default {
  name: 'projectPhaseDeviceTable',
  components: {
    ProjectPhaseDeviceTableModal,
    ProjectPhaseDeviceTableModalBind
  },
  props: {
    cproId: {
      type: String,
      required: true
    },
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
      id: "",
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
  methods: {
    handleAdd() {
      const data = this.data.map(item => item.tabletPcNum)
      this.$refs.modal.deviceType = ""
      this.$refs.modal.init(this.id, data)
    },
    handleEdit(record) {
      this.$refs.modal.deviceType = ""
      this.$refs.modal.edit(record,this.id)
    },
    handleBind(record) {
      bizContestProjectDeviceUpdate({
        ...record,
        cproId: this.id,
        contestId: this.$route.query.id
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('靶位绑定成功')
        }else {
          this.$message.error(res.message)
        }
      })
      // this.$refs.bind.bind(record, this.id)
    },
    handleBindFocus(record, index) {
      if (!record.targetSite){
        if (index === 0){
          record.targetSite = "1"
        }else {
          // console.log(this.data[index - 1].targetSite)
          if (this.data[index - 1].targetSite.toString().length) {
            record.targetSite = Number(this.data[index - 1].targetSite) + 1
          }else {
            record.targetSite = index + 1
          }
        }
      }
    },
    handleDelete(record) {
      deleteMessage('删除项目设备,是否删除该条信息').then(() => {
        bizContestProjectDeviceDelete(record.cproDeviceId).then(res => {
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
    },
    handleList() {
      this.pagination.current = 1
      this.getList()
    },
    getList() {
      const data = {
        cproId: this.id,
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current
      }
      bizContestProjectDevicePageList(data).then(res => {
        this.data = res.result.records
        this.pagination.current = res.result.current
        this.pagination.total = res.result.total
      })
    },
    handleTableChange(pagination) {
      this.pagination = pagination
      this.getList()
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
/deep/.ant-table-body{
  &::-webkit-scrollbar{
    display: block !important;
    width: 0 !important;
  }
}
</style>