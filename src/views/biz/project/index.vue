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
        <a-button type="primary" @click="handleAdd('tablePc')" icon="plus">添加</a-button>
      </a-space>
    </template>
    <template slot="default">
      <a-table
        bordered
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        @change="handleTableChange"
        rowKey="projectId"
        :scroll="{x: 1400}"
      >
        <template slot="operation" slot-scope="text, record, index">
          <a-space>
            <a-button type="primary" size="small" ghost icon="edit" @click="handleEdit(record, 'tablePc')">编辑</a-button>
            <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>
          </a-space>
        </template>
      </a-table>
      <ProjectModal ref="modal" @list="handleList"></ProjectModal>
    </template>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import bizMixins from '@views/biz/bizMixins'
import ProjectModal from '@views/biz/project/modal/projectModal.vue'
import { projectQuery, projectColumns } from '@views/biz/project/project.config'
import { bizProjectPageList, bizProjectDelete } from '@api/biz'
import { deleteMessage } from '@/utils'

export default {
  name: 'project',
  components: {
    Card,
    QuerySearch,
    ProjectModal
  },
  mixins: [bizMixins],
  data() {
    return {
      columns: projectColumns,
      data: [],
      query: {
        groupCount: undefined,
        projectName: undefined,
        ammo: undefined
      },
    }
  },
  mounted() {
    this.$refs.search.init(projectQuery)
    this.getList()
  },
  methods: {
    getList () {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      console.log(data)
      bizProjectPageList(data).then(res => {
        this.data = res.result.records
        this.pagination.current = res.result.current
        this.pagination.total = res.result.total
      })
    },
    handleDelete(row) {
      deleteMessage("是否删除当前项目预设信息").then(() => {
        bizProjectDelete(row.projectId).then(res => {
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
    }
  }
}
</script>


<style scoped lang="less">

</style>