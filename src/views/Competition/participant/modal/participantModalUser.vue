<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loading"
    :width="900"
  >
   <div class="modal">
     <div style="margin-bottom: 20px">
       <a-form :labelCol="{span: 8}" :wrapperCol="{span: 16}">
         <a-row :gutter="24">
           <a-col :span="6">
             <a-form-item colon label="姓名" >
               <a-input allowClear style="width: 100%" v-model="formData.playerName"></a-input>
             </a-form-item>
           </a-col>
           <a-col :span="7">
             <a-form-item colon label="项目名称" >
               <a-input allowClear style="width: 100%" v-model="formData.projectNames"></a-input>
             </a-form-item>
           </a-col>
           <a-col :span="7">
             <a-form-item colon label="项目组别">
               <a-select allowClear style="width: 100%" v-model="formData.projectGroup">
                 <a-select-option v-for="(item,i) in projectGroup" :key="i" :value="item.value">{{item.label}}</a-select-option>
               </a-select>
             </a-form-item>
           </a-col>
           <a-col :span="2">
             <a-form-item :labelCol="{span: 0}" :wrapperCol="{span: 24}">
               <a-button @click="search" type="primary" icon="search">查询</a-button>
             </a-form-item>
           </a-col>
         </a-row>
       </a-form>
     </div>
<!--     <br/>-->
     <a-table
       :pagination="pagination"
       :columns="columns"
       :data-source="data"
       @change="handleTableChange"
       rowKey="playerId"
       :row-selection="rowSelection"
       size="small"
       bordered
     ></a-table>
   </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { participantModalUserTableColumns, projectGroup } from '@views/Competition/participant/participant.config'
import { bizContestProjectPlayerPageList, bizContestProjectPlayerUpdatePlayer } from '@api/competition'
import { infoMessage } from '@/utils'
export default {
  name: 'participantModalUser',
  components: {
    BizModal
  },
  data() {
    return {
      projectGroup,
      visible: false,
      title: '编辑人员名单',
      loading: false,
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
      columns: participantModalUserTableColumns,
      formData: {
        projectGroup: '',
        projectNames: '',
        playerName: ''
      },
      data: [],
      selectedRowKeys: [],
      selectedRowKeysBf: [],
      rows: [],
      obj: {},
      projectName: ''
    }
  },
  computed: {
    rowSelection() {
      return {
        fixed: true,
        type: 'checkbox',
        onChange: this.handleChange,
        selectedRowKeys: this.selectedRowKeys,
      }
    }
  },
  methods: {
    search() {
      this.pagination.current = 1
      this.getList()
    },
    handleOk () {
      if (this.selectedRowKeys.length) {
        // this.loading = true
        // console.log(this.rows)
        const names = this.rows.filter(item => {
          if (item.projectNames) {
            return item.projectNames.includes(this.projectName)
          }
          return false
        })
        if (names.length !== this.rows.length) {
          infoMessage("选中人员存在不属于当前项目的人员，请确认是否添加").then(() => {
            this.loading = true
            bizContestProjectPlayerUpdatePlayer({
              checkList: this.rows,
              ...this.obj
            }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.handleCancel()
                this.$emit("list")
              }else {
                this.$message.error(res.message)
              }
              this.loading = false
            })
          })
        }else {
          this.loading = true
          bizContestProjectPlayerUpdatePlayer({
            checkList: this.rows,
            ...this.obj
          }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.handleCancel()
              this.$emit("list")
            }else {
              this.$message.error(res.message)
            }
            this.loading = false
          })
        }
      }else {
        this.handleCancel()
        this.$emit("list")
      }

    },
    handleCancel() {
      this.visible = false
    },
    // 分页
    handleTableChange (pagination) {
      this.pagination = pagination
      this.getList()
    },
    getList() {
      const data = {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
        contestId: this.obj.contestId,
        ...this.formData,
        isAll: '1'
      }
      bizContestProjectPlayerPageList(data).then(res => {
        if (res.code === 200) {
          this.data = res.result.records
          this.pagination.current = res.result.current
          this.pagination.total = res.result.total

          const arr = this.data.filter(item => {
            if (item.projectNames) {
              return item.projectNames.includes(this.projectName)
            }
            return false
          })
          console.log(arr)
          console.log(this.rows)
          console.log(this.selectedRowKeysBf)
          /* if (arr.length) {
            this.selectedRowKeys = arr.map(item => item.playerId)
            this.rows = arr
            this.selectedRowKeysBf = arr
          }else {
            this.selectedRowKeys = []
            this.rows = []
            this.selectedRowKeysBf = []
          } */
        }
      })
    },
    handleChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.rows = selectedRows
    },
    inits(arr, arrs, query, name) {
      // console.log(name)
      this.projectName = name
      this.visible = true
      this.loading = false
      this.selectedRowKeys = arr
      this.selectedRowKeysBf = arrs
      for (const key in this.formData ) {
        this.formData[key] = ""
      }
      this.rows = arrs
      this.obj = query
      this.getList()
    }
  }
}
</script>

<style scoped lang="less">
.modal{
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>