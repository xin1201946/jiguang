<template>
  <BizModal :title="title" :visible="visible" :loading="loading" @ok="handleOk" @cancel="handleCancel" :width="900">
    <div class="modal">
      <a-form>
        <a-row>
          <a-col :span="8">
            <a-form-item :labelCol="{span: 10}" :wrapperCol="{span: 14}" label="激光训练器类型">
              <a-select showSearch allowClear placeholder="请选择激光训练器类型" v-model="deviceType">
                <a-select-option v-for="item in deviceGunType" :key="item.value" :value="item.label">{{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :labelCol="{span: 10}" :wrapperCol="{span: 14}" label="平板编号">
              <a-input placeholder="请选择平板编号" v-model="tabletPcNum">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :labelCol="{span: 4}" :wrapperCol="{span: 16}" label="">
              <a-button style="margin-left: 20px" type="primary" @click="handleClick">查询</a-button>
              <a-button style="margin-left: 20px" @click="resetClick">重置</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="modal_body">
        <a-table :data-source="tableList" :columns="columns" :pagination="false" rowKey="tabletPcId" :row-selection="rowSelection" :customRow="customRow"></a-table>
      </div>
    </div>
  </BizModal>
</template>

<script>
import { bizTabletPcList } from '@api/biz'
import BizModal from '@comp/modal/BizModal.vue'
import { bizContestProjectDeviceSave, bizContestProjectDeviceUpdate } from '@api/competition'
import { deviceGunType } from '@views/biz/equipment/equipment.config'

export default {
  name: 'projectPhaseDeviceTableModal',
  components: {
    BizModal,
  },
  data() {
    return {
      deviceGunType,
      deviceType: undefined,
      tabletPcNum: undefined,
      tableLists: [],
      title: '',
      visible: false,
      loading: false,
      type: 0,
      columns: [
        {
          title: '平板编号',
          dataIndex: 'tabletPcNum',
          align: 'center',
        },
        {
          title: '激光训练器编号',
          dataIndex: 'deviceNum0',
          align: 'center',
          // customRender: (text, item) => {
          //   return text + (item.deviceGunType === '0'? ' - 长款激光训练器' : item.deviceGunType === '1'? ' - 短款激光训练器' : '')
          // }
        },
        {
          dataIndex: 'deviceGunType',
          align: 'center',
          title: '激光训练器类型',
          customRender: (text) => {
            return text === '0' ? '长款激光训练器' : text === '1' ? '短款激光训练器' : ''
          },
        },
        {
          title: '激光接收靶编号',
          dataIndex: 'deviceNum1',
          align: 'center',
        },
      ],
      formData: {
        targetSite: '',
        targetDeviceNum: '',
        tabletPcNum: '',
        gunDeviceNum: '',
        cproDeviceId: '',
      },
      tableList: [],
      rules: {
        targetSite: [{ required: true, message: '请输入靶位', trigger: 'blur' }],
        targetDeviceNum: [{ required: true, message: '请选择枪设备号', trigger: 'blur' }],
        tabletPcNum: [{ required: true, message: '请选择靶设备号', trigger: 'blur' }],
        gunDeviceNum: [{ required: true, message: '请选择平板状态', trigger: 'blur' }],
      },
      cproId: '',
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  computed: {
    rowSelection() {
      return {
        fixed: true,
        type: this.type === 0 ? 'checkbox' : this.type === 1 && 'radio',
        onChange: this.handleChange,
        selectedRowKeys: this.selectedRowKeys,
      }
    },
  },
  methods: {
    customRow(record) {
      return {
        on: {
          click: (event) => {
            this.selectedRowKeys.push(record.tabletPcId)
            this.selectedRows.push(record)
          },
        },
      }
    },
    resetClick() {
      this.deviceType = undefined
      this.tabletPcNum = undefined
      this.getPcTableList({
        deviceGunType: '',
        tabletPcNum: '',
      })
    },
    handleClick() {
      let value = ''
      for (const item of deviceGunType) {
        if (item.label === this.deviceType) {
          value = item.value
        }
      }
      this.getPcTableList({
        deviceGunType: value,
        tabletPcNum: this.tabletPcNum,
      })
    },
    getPcTableList(data) {
      return bizTabletPcList(data).then((res) => {
        this.tableList = res.result
        this.tableLists = res.result
        return
      })
    },
    handleChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk() {
      if (this.selectedRowKeys.length) {
        if (this.type === 0) {
          console.log(this.selectedRows)
          bizContestProjectDeviceSave({
            cproId: this.cproId,
            contestId: this.$route.query.id,
            tabletPcList: this.selectedRows,
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.$emit('list')
              this.visible = false
            } else {
              this.$message.error(res.message)
              this.loading = false
            }
          })
        }
        if (this.type === 1) {
          const obj = this.selectedRows[0]
          const data = {
            gunDeviceNum: obj.deviceNum0,
            targetDeviceNum: obj.deviceNum1,
            tabletPcNum: obj.tabletPcNum,
            cproId: this.cproId,
            contestId: this.$route.query.id,
          }
          bizContestProjectDeviceUpdate({
            ...data,
            cproDeviceId: this.formData.cproDeviceId,
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.$emit('list')
              this.visible = false
            } else {
              this.$message.error(res.message)
              this.loading = false
            }
          })
        }
      }
    },
    handleCancel() {
      this.visible = false
    },
    init(id, data) {
      this.cproId = id
      this.type = 0
      this.loading = false
      this.title = '添加比赛设备'
      this.visible = true
      this.getPcTableList({}).then(() => {
        const arr = []
        for (const item of this.tableList) {
          for (const key of data) {
            if (item.tabletPcNum === key) {
              arr.push(item)
            }
          }
        }
        this.selectedRowKeys = arr.map((item) => item.tabletPcId)
        this.selectedRows = arr
        this.$nextTick(() => {
          for (const key in this.formData) {
            this.formData[key] = ''
          }
        })
      })
    },
    edit(row, id) {
      this.cproId = id
      this.type = 1
      this.title = '编辑比赛设备'
      this.loading = false
      this.visible = true
      this.getPcTableList({}).then(() => {
        this.$nextTick(() => {
          for (const key in this.formData) {
            this.formData[key] = row[key]
          }
          const keys = this.tableList.filter((item) => item.tabletPcNum === row.tabletPcNum)[0]
          this.selectedRowKeys = [keys.tabletPcId]
          this.selectedRows = [keys]
        })
      })
    },
  },
}
</script>

<style scoped lang="less">
.modal {
  height: 100%;
  overflow-y: hidden;
}
.modal_body {
  height: calc(100% - 60px);
  overflow-y: auto;
}
</style>