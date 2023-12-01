<template>
  <Card>
    <template slot="query">
      <QuerySearch
        ref="search"
        @reset="handleSearch"
        @submit="handleSearch"
      ></QuerySearch>
    </template>
    <template slot="operator">
      <a-space>
        <a-button type="primary" @click="handleAdd" icon="plus">添加</a-button>
        <a-button type="primary" @click="handleExport">下载导入模板</a-button>
        <a-upload
          accept=".xlsx, xls"
          name="file"
          :showUploadList="false"
          :multiple="false"
          :headers="tokenHeader"
          :action="importExcelUrl"
          @change="handleImportExcel"
        >
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload>

      </a-space>
    </template>
    <template>
      <a-table
        bordered
        :columns="columns"
        :data-source="data"
        rowKey="entryFormId"
        :pagination="pagination"
        @change="handleTableChange"
        :scroll="{x: 1400}"
      >
        <template slot="operation" slot-scope="text, record, index">
          <a-space>
            <a-button type="primary" size="small" ghost icon="edit" @click="handleEdit(record)">编辑</a-button>
            <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>
          </a-space>
        </template>
      </a-table>
      <AthletesModal ref="modal" @list="handleList"></AthletesModal>
    </template>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import { athletesQuery, athletesColumns } from '@views/biz/athletes/athletes.config'
import { bizEntryFormDelete, bizEntryFormPageList, bizEntryFormGetImportTemplate } from '@api/biz'
import AthletesModal from '@views/biz/athletes/modal/athletesModal.vue'
import { deleteMessage } from '@/utils'
import bizMixins from '@views/biz/bizMixins'
import { downFile } from '@api/manage'
export default {
  name: 'athletes',
  components: {
    QuerySearch,
    Card,
    AthletesModal
  },
  mixins: [bizMixins],
  data() {
    return {
      loading: false,
      columns: athletesColumns,
      data: [],
      query: {
        entryName: undefined,
        entrySex: undefined,
        entryType: undefined
      },
      api: 'bizEntryForm/importExcel'
    }
  },
  mounted() {
    this.$refs.search.init(athletesQuery)
    this.getList()
  },
  methods: {
    handleExport() {
      bizEntryFormGetImportTemplate()
        .then((res) => this.downLoad(res, '运动员导入.xlsx'))
    },
    handleDelete (record) {
      deleteMessage("是否删除当前运动员信息").then(() => {
        bizEntryFormDelete(record.entryFormId).then(res => {
          if (res.code === 200) {
            if (this.data.length === 1) {
              this.pagination.current = this.pagination.current - 1
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
    getList () {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      bizEntryFormPageList(data).then(res => {
        this.data = res.result.records
        this.pagination.current = res.result.current
        this.pagination.total = res.result.total
      })
    }
  }
}
</script>


<style scoped lang="less">

</style>