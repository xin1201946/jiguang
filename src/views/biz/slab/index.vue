<template>
  <Card>
    <template slot="query">
      <QuerySearch ref="search" @reset="handleSearch" @submit="handleSearch"></QuerySearch>
    </template>
    <template slot="operator">
      <a-space>
        <a-button type="primary" @click="handleAdd('device')" icon="plus">添加</a-button>
        <a-button type="primary" @click="handleSync">同步</a-button>
<!--        <a-button
          type='primary'
          :disabled='rowSelection.selectedRowKeys.length === 0'
          @click='handleModel'
        >模式</a-button>-->
      </a-space>
    </template>
    <template slot="default">
      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="tabletPcId"
        :pagination="pagination"
        @change="handleTableChange"
        bordered
        :scroll="{x: 1400}"
      >
        <template slot="targetSite" slot-scope="text, record, index">
          <a-input @blur="setValueHandle(record)" v-model="record.targetSite"></a-input>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a-space>
            <a-button type="primary" size="small" ghost icon="edit" @click="handleEdit(record, 'device')">编辑</a-button>
            <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>
          </a-space>
        </template>
      </a-table>
      <SlabModal ref="modal" @list="handleList" />

    </template>
  </Card>
</template>

<script>
import QuerySearch from '@comp/query/QuerySearch.vue'
import Card from '@comp/card/card.vue'
import { slabQuery, slabTableColumns, tabletPcModel } from '@views/biz/slab/slab.config'
import {
  bizTabletPcPageList,
  bizTabletPcDelete,
  bizTabletPcSync,
  updateTarget,
  bizDeviceControlModelControl
} from '@api/biz'
import SlabModal from '@views/biz/slab/model/SlabModal.vue'
import bizMixins from '@views/biz/bizMixins'
import { deleteMessage } from '@/utils'
export default {
  name: 'slab',
  components: {
    Card,
    QuerySearch,
    SlabModal,
  },
  mixins: [bizMixins],
  data() {
    return {
      columns: slabTableColumns,
      data: [],
      query: {
        tabletPcNum: undefined,
        tabletPcName: undefined,
        tabletPcStatus: undefined,
        tabletPcModel: undefined,
      },
      rowSelection: {
        type: "checkbox",
        selectedRowKeys: [],
        fixed: true,
        onChange: (v, v1) => {
          this.rowSelection.selectedRowKeys = v
        }
      }
    }
  },
  mounted() {
    this.$refs.search.init(slabQuery)
    this.getList()
  },
  methods: {
    setValueHandle(row) {
      updateTarget({
        pcNo: row.tabletPcNum, //平板编号
        targetSite: row.targetSite, //靶位号
      }).then((res) => {
        if (res.success) {
          this.$message.success('编辑靶位成功！')
          this.getList()
        }
      })
    },
    // 列表查询
    getList() {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
      }
      bizTabletPcPageList(data).then((res) => {
        if (res.code === 200) {
          this.data = res.result.records
          this.pagination.current = res.result.current
          this.pagination.total = res.result.total
        }
      })
    },
    handleModel() {
      this.visible = true
      this.model = ""
      /*bizDeviceControlModelControl({
        tabletPcNumStrs: this.rowSelection.selectedRowKeys.join(','),
        model: "试射"
      }).then(res => {
        if (res.code === 200) {
          this.rowSelection.selectedRowKeys = []
          this.$message.success(res.message || '模式控制成功')
          this.getList()
        }else {
          this.$message.error(res.message)
        }
      })*/
    },
    handleSync() {
      bizTabletPcSync().then((res) => {
        if (res.code === 200) {
          this.$message.success('平板同步成功')
          this.pagination.current = 1
          this.getList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleDelete(record) {
      deleteMessage('是否删除当前平板信息').then(() => {
        bizTabletPcDelete(record.tabletPcId).then(this.deleteCallback)
      })
    },
  },
}
</script>


<style scoped lang="less">
</style>