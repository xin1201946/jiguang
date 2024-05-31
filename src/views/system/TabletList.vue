<template>
  <a-card :bordered="false" class="card-area">
    <!-- 按钮区域 -->
    <div class="table-operator" style="margin-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">添加apk</a-button>
    </div>
    <!-- 列表区域 -->
    <a-table
      ref="table"
      bordered
      size="middle"
      rowKey="id"
      :columns="columns"
      :dataSource="dataList"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <div
        slot="action"
        slot-scope="text, record"
        style="display: flex; justify-content: center; align-items: center; gap: 10px"
      >
        <a-button type="danger" size="small" ghost icon="delete" @click="handleDlete(record)">删除</a-button>
      </div>
    </a-table>
    <!-- 表单区域 -->
    <table-modal ref="modalForm" @ok="handleOk"></table-modal>
  </a-card>
</template>
  <script>
import { bizTableList, bizDleteAPK } from '@/api/biz'
import TableModal from './modules/TableModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  name: 'TabletList',
  components: {
    TableModal,
  },

  mixins: [JeecgListMixin],
  data() {
    return {
      dataList: [],
      pagination: {
        current: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总记录数，初始设为 0，待后端返回后更新
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showSizeChanger: true, // 显示每页显示条数选择器
        showQuickJumper: true, // 显示快速跳转输入框
      },
      columns: [
        {
          title: '名称',
          align: 'center',
          dataIndex: 'name',
          width: 240,
        },
        {
          title: '版本号',
          align: 'center',
          width: 120,
          dataIndex: 'version',
        },
        {
          title: '更新内容',
          align: 'center',
          width: 240,
          dataIndex: 'info',
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 200,
        },
      ],
      url: {
        list: '/sys/user/list',
      },
    }
  },

  beforeRouteEnter(to, form, next) {
    next((vm) => {
      vm.pagination.current = 1
      vm.handleSearch()
    })
  },
  created() {
    this.handleSearch()
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      this.$set(this.pagination, 'current', pagination.current)

      // 根据新页码重新截取数据
      this.$set(this.pagination, 'pageSize', pagination.pageSize)
      this.handleSearch()
    },
    handleOk() {
      this.handleSearch()
    },
    handleDlete(record) {
      bizDleteAPK({ id: record.id }).then((res) => {
        if (res.success) {
          this.$message.success('删除成功!')
          this.handleSearch()
        }
      })
    },
    handleSearch() {
      bizTableList({ pageNo: this.pagination.current, pageSize: this.pagination.pageSize }).then((res) => {
        this.dataList = res.result.records
        this.pagination.total = res.result.total
      })
    },
  },
}
</script>
  
  <style scoped>
</style>