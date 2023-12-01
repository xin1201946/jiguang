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
        <a-button type="primary" @click="handleSync">同步</a-button>
      </a-space>
    </template>
    <template slot="default">
      <a-table
        bordered
        :columns="columns"
        :data-source="data"
        rowKey="deviceId"
        :pagination="pagination"
        @change="handleTableChange"
        :scroll="{x: 1400}"
      >
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
import { bizDevicePageList, bizDeviceDelete, bizDeviceSync } from '@api/biz'
import EquipmentModal from '@views/biz/equipment/modal/equipmentModal.vue'
// import ProjectModal from '@views/biz/equipment/modal/ProjectModal.vue'
// import ControlModal from '@views/biz/equipment/modal/ControlModal.vue'
// import DisplayModal from '@views/biz/equipment/modal/DisplayModal.vue'
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
      }
    }
  },
  mounted() {
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
          }else {
            this.$message.warning(res.message)
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
        }else {
          this.$message.warning(res.message)
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
    }
  }
}
</script>


<style scoped lang="less">

</style>