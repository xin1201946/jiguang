<template>
  <Card>
    <template slot="query">
      <QuerySearch
        ref="query"
        @reset="handleSearch"
        @submit="handleSearch"
      ></QuerySearch>
    </template>
    <template slot="operator">
      <a-space>
<!--        <a-button type="primary" @click="handleAdd('tablePc')" icon="plus">添加</a-button>-->
        <a-button type="primary" icon="edit" @click="handleProject()">项目控制</a-button>
        <a-button type="primary" icon="edit" @click="handleDisPlay()">显示控制</a-button>
        <a-button type="primary" icon="edit" @click="handleDevice()">设备控制</a-button>
      </a-space>
    </template>
    <a-table
      :columns="columns"
      :data-source="data"
      rowKey="tabletPcId"
      :pagination="pagination"
      @change="handleTableChange"
      :rowSelection="rowSelection"
      bordered
    >
      <template slot="operation" slot-scope="text, record, index">
        <a-space>
          <a-space>
            <a-button type="primary" size="small" ghost icon="edit" @click="handleProject(record)">项目控制</a-button>
            <a-button type="primary" size="small" ghost icon="edit" @click="handleDisPlay(record)">显示控制</a-button>
            <a-button type="primary" size="small" ghost icon="edit" @click="handleDevice(record)">设备控制</a-button>
            <a-button type="primary" size="small" ghost icon="copy" @click="handleInfo(record)">详情</a-button>
          </a-space>
        </a-space>
      </template>
    </a-table>
    <DeviceModal ref="info"></DeviceModal>
    <DeviceModalDisplay ref="display" @list="handleLists"></DeviceModalDisplay>
    <DeviceModalDevice ref="device" @list="handleLists"></DeviceModalDevice>
    <DeviceModalProject ref="project" @list="handleLists"></DeviceModalProject>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import { deviceQuery, deviceTableColumns, shootControl } from '@views/control/device/device.config'
import BizMixins from '@views/biz/bizMixins'
import DeviceModal from '@views/control/device/Modal/DeviceModal.vue'
import { bizTabletPcQueryDeviceControlById, controlDelete } from '@api/control'
import { deleteMessage } from '@/utils'
import { bizTabletPcPageList } from '@api/biz'
import DeviceModalDisplay from '@views/control/device/Modal/DeviceModalDisplay.vue'
import DeviceModalDevice from '@views/control/device/Modal/DeviceModalDevice.vue'
import DeviceModalProject from '@views/control/device/Modal/DeviceModalProject.vue'
export default {
  name: 'device',
  components: {
    Card,
    QuerySearch,
    DeviceModal,
    DeviceModalDisplay,
    DeviceModalDevice,
    DeviceModalProject
  },
  mixins: [BizMixins],
  data() {
    return {
      data: [],
      columns: deviceTableColumns,
      query: {
        tabletPcName: undefined,
        tabletPcStatus: undefined,
        tabletPcModel: undefined
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    rowSelection() {
      return {
        fixed: true,
        type: 'checkbox',
        onChange: this.handleChange,
        selectedRowKeys: this.selectedRowKeys
      }
    }
  },
  mounted() {
    this.$refs.query.init(deviceQuery)
    this.getList()
  },
  methods: {
    handleInfo(record) {
      console.log(record.tabletPcId)
      bizTabletPcQueryDeviceControlById(record.tabletPcId).then(res => {
        this.$refs.info.init(res.result)
      })
    },
    handleChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    getList () {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      bizTabletPcPageList(data).then(res => {
        if (res.code === 200) {
          this.data = res.result.records
          this.pagination.current = res.result.current
          this.pagination.total = res.result.total
        }
      })
    },
    handleLists() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.getList()
    },
    handleDelete(record) {
      deleteMessage().then(() => {
        controlDelete(record.deviceControlId).then(res => {
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
    handleProject(record) {
      const arr = []
      if (record){
        arr.push(record.tabletPcNum)
        bizTabletPcQueryDeviceControlById(record.tabletPcId).then(res => {
          this.$refs.project.init(arr.join(','), res.result)
        })
      } else {

        if (this.selectedRows.length) {
          this.selectedRows.map(item => {
            arr.push(item.tabletPcNum)
          })
          this.$refs.project.init(arr.join(','))
        }else {
          this.$message.warning("请选择表格信息再点击批量项目控制按钮")
        }
      }

    },
    handleDevice(record) {
      const arr = []
      if (record){
        arr.push( record.tabletPcNum)
        bizTabletPcQueryDeviceControlById(record.tabletPcId).then(res => {
          this.$refs.device.init(arr.join(','), res.result)
        })
        // this.$refs.device.init(arr.join(','))
      } else {
        if (this.selectedRows.length) {
          this.selectedRows.map(item => {
            arr.push(item.tabletPcNum)
          })
          this.$refs.device.init(arr.join(','))
        }else{
          this.$message.warning("请选择表格信息再点击批量设备控制按钮")
        }
      }

    },
    handleDisPlay(record) {
      const arr = []
      if (record){
        arr.push( record.tabletPcNum)
        bizTabletPcQueryDeviceControlById(record.tabletPcId).then(res => {
          this.$refs.display.init(arr.join(','), res.result)
        })
      } else {
        if (this.selectedRows.length) {
          this.selectedRows.map(item => {
            arr.push(item.tabletPcNum)
          })
          this.$refs.display.init(arr.join(','))
        }else{
          this.$message.warning("请选择表格信息再点击批量显示控制按钮")
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>