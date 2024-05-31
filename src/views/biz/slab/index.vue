<template>
  <Card>
    <template slot="query">
      <QuerySearch ref="search" @reset="handleSearch" @submit="handleSearch"></QuerySearch>
    </template>
    <template slot="operator">
      <a-space>
        <a-button v-has="'biz:slab:add'" type="primary" @click="handleAdd('device')" icon="plus">添加</a-button>
        <!--        <a-upload
          accept=".xlsx, xls"
          name="file"
          :showUploadList="false"
          :multiple="false"
          :headers="tokenHeader"
          :action="importExcelUrl"
          @change="handleImportExcel"
        >
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload>-->
        <a-button v-has="'biz:slab:import'" type="primary" icon="import" @click="handleImportModel">导入</a-button>
        <a-button type="primary" icon="arrow-up" @click="handleUp" :disabled="selectionRows2.length === 0"
          >更新</a-button
        >
        <!--        <a-button
          type='primary'
          :disabled='rowSelection.selectedRowKeys.length === 0'
          @click='handleModel'
        >模式</a-button>-->
      </a-space>
    </template>
    <template slot="default">
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys2.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected2">清空</a>
      </div>
      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="tabletPcId"
        :pagination="pagination"
        @change="handleTableChange"
        :rowSelection="{ selectedRowKeys: selectedRowKeys2, onChange: onSelectChange2 }"
        bordered
        :scroll="{ x: 1400 }"
      >
        <template slot="targetSite" slot-scope="text, record, index">
          <a-input @blur="setValueHandle(record)" v-model="record.targetSite"></a-input>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a-space>
            <a-button type="primary" size="small" ghost icon="edit" @click="handleEdit(record, 'device')"
              >编辑</a-button
            >
            <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>
          </a-space>
        </template>
      </a-table>
      <SlabModal ref="modal" @list="handleList" />
      <SlabImportModal ref="import" @list="handleList"></SlabImportModal>
      <a-modal v-model="visible" title="平板更新" @ok="handleUpOk">
        <a-card class="tree-wrap">
          <a-tree :tree-data="treeData" show-icon default-expand-all @select="onSelect" style="font-size: 15px;line-height: 2.5;">
            <a-icon type="android" slot="select"  />
          </a-tree>
        </a-card>
      </a-modal>
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
  bizDeviceControlModelControl,
} from '@api/biz'
import SlabModal from '@views/biz/slab/model/SlabModal.vue'
import bizMixins from '@views/biz/bizMixins'
import { deleteMessage } from '@/utils'
import SlabImportModal from '@views/biz/slab/model/SlabImportModal.vue'
import { bizTableList, bizDeviceSetPcApkversion } from '@/api/biz'

export default {
  name: 'slab',
  components: {
    Card,
    QuerySearch,
    SlabModal,
    SlabImportModal,
  },
  mixins: [bizMixins],
  data() {
    return {
      selectedRowKeys2: [],
      selectionRows2: [],
      selectList: [],
      visible: false,
      treeData: [],
      version: '',
      columns: slabTableColumns,
      data: [],
      query: {
        pcNum: undefined,
        pcName: undefined,
        // tabletPcStatus: undefined,
        // tabletPcModel: undefined,
      },

      rowSelection: {
        type: 'checkbox',
        selectedRowKeys: [],
        fixed: true,
        onChange: (v, v1) => {
          this.rowSelection.selectedRowKeys = v
        },
      },
    }
  },
  mounted() {
    this.$refs.search.init(slabQuery)
    this.getList()
  },
  created() {
    this.tableList()
  },
  methods: {
    //平板版本更新
    onSelectChange2(selectedRowKeys, selectionRows) {
      this.selectedRowKeys2 = selectedRowKeys
      this.selectionRows2 = selectionRows
      this.selectList = this.selectionRows2.map((item) => item.pcNum)
    },
    onClearSelected2() {
      this.selectedRowKeys2 = []
      this.selectionRows2 = []
    },
    handleUp() {
      this.visible = true
    },

    handleUpOk(e) {
      if (this.version === '') {
        this.$message.error('请选择更新版本！')
      } else {
        bizDeviceSetPcApkversion({
          pcList: this.selectList,
          version: this.version,
        }).then((res) => {
          if (res.success) {
            this.$message.success('平板版本更新成功！')
            this.getList()
            this.version = ''
            this.onClearSelected2()
          }
        })
        this.visible = false
      }
    },
    onSelect(selectedKeys, info) {
      this.version = selectedKeys[0]

      if (info.selected === false) {
        selectedKeys = []
        this.version = ''
      }
    },
    tableList() {
      bizTableList({ pageNo: 1, pageSize: 99999 }).then((res) => {
        const records = res.result.records
        this.treeData = records.map((record, index) => ({
          title: `${record.name} - ${record.version}`,
          key: `${record.version}`, // 使用唯一的标识符作为key
          slots: {
            icon: 'select',
          },
        }))
      })
    },
    //
    handleImportModel() {
      this.$refs.import.show()
    },
    setValueHandle(row) {
      updateTarget({
        pcNo: row.pcNum, //平板编号
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
        pageNo: this.pagination.current,
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
      this.model = ''
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
        bizTabletPcDelete(record.pcId).then(this.deleteCallback)
      })
    },
  },
}
</script>


<style scoped lang="less">
.tree-wrap {
  height: 400px;
  overflow: auto;
}
</style>