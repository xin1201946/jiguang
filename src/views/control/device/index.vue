<template>
  <Card>
    <template slot="query">
      <QuerySearch ref="query" @reset="handleSearch" @submit="handleSearch"></QuerySearch>
    </template>
    <template slot="operator">
      <a-space>
        <a-button type="primary" @click="handleSync">同步</a-button>
        <a-button type="primary" icon="edit" @click="handleProject()">项目控制</a-button>
        <a-button type="primary" icon="edit" @click="handleDisPlay()">显示控制</a-button>
        <a-button type="primary" icon="edit" @click="handleDevice()">设备控制</a-button>
        <a-button type="primary" icon="edit" @click='handleSlabCut()'>模式切换</a-button>
        <a-button type="primary" icon="edit" @click='handleProjectCut()'>项目切换</a-button>
        <a-button type="primary" icon="edit" @click='handleUserDelivery()'>用户下发</a-button>
        <a-button type="primary" icon="edit" @click='handleArguments'>参数配置</a-button>
      </a-space>
    </template>
    <a-table :columns="columns" :data-source="data" rowKey="tabletPcId" :pagination="pagination" @change="handleTableChange" :rowSelection="rowSelection" bordered :scroll="{x: 1400}">
      <template slot="operation" slot-scope="text, record, index">
        <a-space>
          <a-space>
            <!-- <a-button type="primary" size="small" ghost icon="edit" @click="handleProject(record)">项目控制</a-button>
            <a-button type="primary" size="small" ghost icon="edit" @click="handleDisPlay(record)">显示控制</a-button>
            <a-button type="primary" size="small" ghost icon="edit" @click="handleDevice(record)">设备控制</a-button> -->
            <a-button type="primary" size="small" ghost icon="copy" @click="handleInfo(record)">详情</a-button>
          </a-space>
        </a-space>
      </template>
    </a-table>
    <DeviceModal ref="info"></DeviceModal>
    <DeviceModalDisplay ref="display" @list="handleLists"></DeviceModalDisplay>
    <DeviceModalDevice ref="device" @list="handleLists"></DeviceModalDevice>
    <DeviceModalProject ref="project" @list="handleLists"></DeviceModalProject>
    <DeviceModalCut ref='cut' @list="handleLists"></DeviceModalCut>
    <DeviceArgument ref='argument' @list="handleLists"></DeviceArgument>
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
import { bizTabletPcPageList1, bizTabletPcSync } from '@api/biz'
import DeviceModalDisplay from '@views/control/device/Modal/DeviceModalDisplay.vue'
import DeviceModalDevice from '@views/control/device/Modal/DeviceModalDevice.vue'
import DeviceModalProject from '@views/control/device/Modal/DeviceModalProject.vue'
import DeviceModalCut from '@views/control/device/Modal/DeviceModalCut.vue'
import DeviceArgument from '@views/control/device/Modal/DeviceArgument.vue'

export default {
  name: 'device',
  components: {
    Card,
    QuerySearch,
    DeviceModal,
    DeviceModalDisplay,
    DeviceModalDevice,
    DeviceModalProject,
    DeviceModalCut,
    DeviceArgument,
  },
  mixins: [BizMixins],
  data() {
    return {
      data: [],
      columns: deviceTableColumns,
      query: {
        tabletPcNum: undefined,
        tabletPcName: undefined,
        tabletPcStatus: undefined,
        tabletPcModel: undefined,
      },
      selectedRowKeys: [],
      selectedRows: [],
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
    },
  },
  mounted() {
    this.$refs.query.init(deviceQuery)
    this.getList()
  },
  methods: {
    handleInfo(record) {
      console.log(record.tabletPcId)
      bizTabletPcQueryDeviceControlById(record.tabletPcId).then((res) => {
        this.$refs.info.init(res.result)
      })
    },
    handleChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    getList() {
      const data = {
        ...this.query,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
      }
      bizTabletPcPageList1(data).then((res) => {
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
        controlDelete(record.deviceControlId).then((res) => {
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
    handleProject(record) {
      const arr = []
      if (record) {
        arr.push(record.tabletPcNum)
        bizTabletPcQueryDeviceControlById(record.tabletPcId).then((res) => {
          this.$refs.project.init(arr.join(','), res.result)
        })
      } else {
        if (this.selectedRows.length) {
          if (this.selectedRows.length === 1) {
            arr.push(this.selectedRows[0].tabletPcNum)
            bizTabletPcQueryDeviceControlById(this.selectedRows[0].tabletPcId).then((res) => {
              this.$refs.project.init(arr.join(','), res.result)
            })
          } else {
            this.selectedRows.map((item) => {
              arr.push(item.tabletPcNum)
            })
            this.$refs.project.init(arr.join(','))
          }
        } else {
          this.$message.error('请选择表格信息再点击批量项目控制按钮')
        }
      }
    },
    // 模式切换
    handleSlabCut() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请选择表格信息再点击模式切换按钮')
      } else {
        this.$refs.cut.slabInit(this.selectedRows)
      }
    },
    // 项目切换
    handleProjectCut() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请选择表格信息再点击项目切换按钮')
      } else {
        this.$refs.cut.projectInit(this.selectedRows)
      }
    },
    handleArguments() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请选择表格信息再点击用户下发按钮')
      } else {
        this.$refs.argument.userInit(this.selectedRows)
      }
    },
    // 用户下发
    handleUserDelivery() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请选择表格信息再点击用户下发按钮')
      } else {
        this.$refs.cut.userInit(this.selectedRows)
      }
    },
    handleDevice(record) {
      const arr = []
      if (record) {
        arr.push(record.tabletPcNum)
        bizTabletPcQueryDeviceControlById(record.tabletPcId).then((res) => {
          console.log(arr.join(','))
          this.$refs.device.init(arr.join(','), res.result)
        })
        // this.$refs.device.init(arr.join(','))
      } else {
        if (this.selectedRows.length) {
          if (this.selectedRows.length === 1) {
            arr.push(this.selectedRows[0].tabletPcNum)
            bizTabletPcQueryDeviceControlById(this.selectedRows[0].tabletPcId).then((res) => {
              this.$refs.device.init(arr.join(','), res.result)
            })
          } else {
            this.selectedRows.map((item) => {
              arr.push(item.tabletPcNum)
            })
            this.$refs.device.init(arr.join(','))
          }
        } else {
          this.$message.error('请选择表格信息再点击批量设备控制按钮')
        }
      }
    },
    handleDisPlay(record) {
      const arr = []
      if (record) {
        arr.push(record.tabletPcNum)
        bizTabletPcQueryDeviceControlById(record.tabletPcId).then((res) => {
          this.$refs.display.init(arr.join(','), res.result)
        })
      } else {
        if (this.selectedRows.length) {
          if (this.selectedRows.length === 1) {
            arr.push(this.selectedRows[0].tabletPcNum)
            bizTabletPcQueryDeviceControlById(this.selectedRows[0].tabletPcId).then((res) => {
              this.$refs.display.init(arr.join(','), res.result)
            })
          } else {
            this.selectedRows.map((item) => {
              arr.push(item.tabletPcNum)
            })
            this.$refs.display.init(arr.join(','))
          }
        } else {
          this.$message.error('请选择表格信息再点击批量显示控制按钮')
        }
      }
    },
  },
}
</script>

<style scoped lang="scss">
</style>