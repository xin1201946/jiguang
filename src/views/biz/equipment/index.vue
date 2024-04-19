<template>
  <Card>
    <template slot="query">
      <QuerySearch ref="search" @reset="handleSearch" @submit="handleSearch"></QuerySearch>
    </template>
    <template slot="operator">
      <a-space>
        <a-button type="primary" @click="handleAdd" icon="plus" v-show="realname === '管理员'">添加</a-button>
        <a-button type="primary" @click="handleSync">同步</a-button>
        <!-- <a-button type="primary" @click="handleImportExcel">导入</a-button> -->
        <a-upload accept=".xlsx, xls" name="file" method="post" :showUploadList="false" :multiple="false"
          :headers="tokenHeader" :action="importExcelUrl" :data="(file) => (file)" @change="handleImportExcel">
          <a-button type="primary" icon="import" v-show="realname === '管理员'">导入</a-button>
        </a-upload>
        <a-button type="primary" icon="download" @click="handleImportTemplate"
          v-show="realname === '管理员'">导入模板下载</a-button>
      </a-space>
    </template>
    <template slot="default">
      <a-table bordered :columns="columns" :data-source="data" rowKey="deviceId" :pagination="pagination"
        @change="handleTableChange" :scroll="{ x: 1400 }">
        <template slot="operation" slot-scope="text, record, index">
          <a-space>
            <a-button type="primary" size="small" ghost icon="edit" @click="handleEdit(record)">编辑</a-button>
            <a-button type="danger" size="small" ghost icon="delete" @click="handleDelete(record)">删除</a-button>
            <!--            <a-dropdown trigger="click">
              <a-button size="small" icon="small-dash" />
              <a-menu slot="overlay">
                <a-menu-item @click="handleControl(record)">
                  设备控制
                </a-menu-item>
                <a-menu-item @click="handleDisPlay(record)">
                  设备显示
                </a-menu-item>
                <a-menu-item @click="handleProject(record)">
                  项目控制
                </a-menu-item>
              </a-menu>
            </a-dropdown>-->
          </a-space>
        </template>
      </a-table>
      <EquipmentModal ref="modal" @list="handleList"></EquipmentModal>
      <!--      <ProjectModal ref="project"></ProjectModal>-->
      <!--      <ControlModal ref="control"></ControlModal>-->
      <!--      <DisplayModal ref="display"></DisplayModal>-->
    </template>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
import bizMixins from '@views/biz/bizMixins'
import QuerySearch from '@comp/query/QuerySearch.vue'
import { equipmentColumns, equipmentQuery, deviceGunType } from '@views/biz/equipment/equipment.config'
import { deleteMessage } from '@/utils'
import { bizDevicePageList, bizDeviceDelete, bizDeviceSync, bizDevicegetImportTemplate } from '@api/biz'
import EquipmentModal from '@views/biz/equipment/modal/equipmentModal.vue'
// import ProjectModal from '@views/biz/equipment/modal/ProjectModal.vue'
// import ControlModal from '@views/biz/equipment/modal/ControlModal.vue'
// import DisplayModal from '@views/biz/equipment/modal/DisplayModal.vue'
import Vue from 'vue'
import { ACCESS_TOKEN, TENANT_ID, USER_INFO } from '@/store/mutation-types'
export default {
  name: 'equipment',
  components: {
    Card,
    QuerySearch,
    EquipmentModal,
    // ProjectModal,
    // ControlModal,
    // DisplayModal
  },
  mixins: [bizMixins],
  computed: {
    tokenHeader() {
      let head = { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) }
      let tenantid = Vue.ls.get(TENANT_ID)
      if (tenantid) {
        head['tenant-id'] = tenantid
      }
      return head
    },
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/bizDevice/importExcel`
    }
  },
  data() {
    return {
      columns: equipmentColumns,
      deviceGunType,
      data: [],
      query: {
        deviceNum: undefined,
        deviceType: undefined,
        deviceGunType: undefined,
        deviceStatus: undefined
      },
      realname: undefined, //角色判断
    }
  },
  mounted() {
    this.realname = Vue.ls.get(USER_INFO).realname
    this.$refs.search.init(equipmentQuery)
    this.getList()
  },
  methods: {
    getList() {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      bizDevicePageList(data).then(res => {
        this.data = res.result.records
        this.pagination.current = res.result.current
        this.pagination.total = res.result.total
      })
    },
    handleDelete(record) {
      deleteMessage("是否删除当前设备信息").then(() => {
        bizDeviceDelete(record.deviceId).then(res => {
          if (res.code === 200) {
            if (this.data.length === 1) {
              this.pagination.current = this.pagination.current - 1
            }
            this.$nextTick(() => {
              this.getList()
            })
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    handleSync() {
      bizDeviceSync().then(res => {
        if (res.code === 200) {
          this.$message.success('设备同步成功')
          this.pagination.current = 1
          this.getList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleDisPlay(record) {
      this.$refs.display.init(record)
    },
    handleControl(record) {
      this.$refs.control.init(record)
    },
    handleProject(record) {
      this.$refs.project.init(record)
    },
    // 导入
    handleImportExcel(info) {
      // console.log(info)
      const { file } = info
      if (this.loading !== undefined) {
        this.loading = true
      }

      if (file.status === "uploading") {

      }
      if (file.status === "done") {
        const { response } = file
        if (response.code === 200) {
          if (this.loading !== undefined) {
            this.loading = false
          }
          this.$message.success(response.message)
          this.pagination.current = 1
          this.$nextTick(() => {
            this.getList()
          })
        } else if (response.code === 201) {
          let { message, result: { msg, fileUrl, fileName } } = response
          let href = window._CONFIG['domianURL'] + fileUrl
          this.$warning({
            title: message,
            content: (<div>
              <span>{msg}</span><br />
              <span>具体详情请 <a href={href} target="_blank" download={fileName}>点击下载</a> </span>
            </div>
            ),
            onOk: () => {
              this.pagination.current = 1
              this.$nextTick(() => {
                this.getList()
                if (this.loading !== undefined) {
                  this.loading = false
                }
              })
            }
          })
        } else {
          this.$message.error(response.message)
          this.loading = false
        }
      }
    },
    // 导入模板下载
    handleImportTemplate() {
      bizDevicegetImportTemplate().then((res) => this.downLoad(res, '设备导入模板.xlsx'))
    },
    downLoad(data, name) {
      if (!data || data.size === 0) {
        this.$message.error("文件下载失败")
      } else {
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' })
        // console.log(data)
        // const blob = new Blob([data], {type: 'application/pdf'})
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', name)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    },
  }
}
</script>


<style scoped lang="less"></style>