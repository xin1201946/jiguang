<template>
  <BizModal
    :title="title"
    :visible="visible"
    :loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="modal">
      <a-table
        :data-source="tableList"
        :columns="columns"
        :pagination="false"
        rowKey="tabletPcId"
        :row-selection="rowSelection"
      ></a-table>
    </div>
  </BizModal>
</template>

<script>
import { bizTabletPcList } from '@api/biz'
import BizModal from '@comp/modal/BizModal.vue'
import { bizContestProjectDeviceSave, bizContestProjectDeviceUpdate } from '@api/competition'

export default {
  name: 'projectPhaseDeviceTableModal',
  components: {
    BizModal
  },
  data() {
    return {
      title: "",
      visible: false,
      loading: false,
      type: 0,
      columns: [
        {
          title: '平板编号',
          dataIndex: 'tabletPcNum',
          align: 'center'
        },
        {
          // title: '平板对应设备编号枪',
          title: '激光训练器编号',
          dataIndex: 'deviceNum0',
          align: 'center'
        },
        {
          title: '激光接收靶编号',
          // title: '平板对应设备编号靶',
          dataIndex: 'deviceNum1',
          align: 'center'
        },
      ],
      formData: {
        targetSite: "",
        targetDeviceNum: "",
        tabletPcNum: "",
        gunDeviceNum: "",
        cproDeviceId: "",
      },
      tableList: [],
      rules: {
        targetSite: [
          { required: true, message: '请输入靶位', trigger: 'blur' }
        ],
        targetDeviceNum: [
          { required: true, message: '请选择枪设备号', trigger: 'blur' }
        ],
        tabletPcNum: [
          { required: true, message: '请选择靶设备号', trigger: 'blur' }
        ],
        gunDeviceNum: [
          { required: true, message: '请选择平板状态', trigger: 'blur' }
        ]
      },
      cproId: "",
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    rowSelection() {
      return {
        fixed: true,
        type: this.type === 0 ?'checkbox' : this.type === 1 && 'radio',
        onChange: this.handleChange,
        selectedRowKeys: this.selectedRowKeys
      }
    }
  },
  methods: {
    getPcTableList () {
      return bizTabletPcList().then(res => {
        console.log(res)
        this.tableList = res.result
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
            tabletPcList: this.selectedRows
          }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.$emit("list")
              this.visible = false
            }else {
              this.$message.warning(res.message)
              this.loading = false
            }
          })
         /*  const key = this.selectedRows[0]
          const obj =  this.tableList[key]
          const data = {
            gunDeviceNum: obj.deviceNum0,
            targetDeviceNum: obj.deviceNum1,
            tabletPcNum: obj.tabletPcNum,
            cproId: this.cproId,
            contestId: this.$route.query.id
          }
          bizContestProjectDeviceSave(data).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.$emit("list")
              this.visible = false
            }else {
              this.$message.warning(res.message)
              this.loading = false
            }
          }) */
        }
        if (this.type === 1) {
          const obj =  this.selectedRows[0]
          const data = {
            gunDeviceNum: obj.deviceNum0,
            targetDeviceNum: obj.deviceNum1,
            tabletPcNum: obj.tabletPcNum,
            cproId: this.cproId,
            contestId: this.$route.query.id
          }
          bizContestProjectDeviceUpdate({
            ...data,
            cproDeviceId: this.formData.cproDeviceId
          }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.$emit("list")
              this.visible = false
            }else {
              this.$message.warning(res.message)
              this.loading = false
            }
          })
        }

      }
     /*  this.$refs.form.validate(v => {
        if (v) {
          this.loading = true
          if (this.type === 0) {
            const data = JSON.parse(JSON.stringify(this.formData))
            delete data.cproDeviceId
            bizContestProjectDeviceSave({
              ...data,
              cproId: this.cproId,
              contestId: this.$route.query.id
            }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.$emit("list")
                this.visible = false
              }else {
                this.$message.warning(res.message)
                this.loading = false
              }
            })
          }
          if (this.type === 1) {
            bizContestProjectDeviceUpdate({
              ...this.formData,
              cproId: this.cproId,
              contestId: this.$route.query.id
            }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.$emit("list")
                this.visible = false
              }else {
                this.$message.warning(res.message)
                this.loading = false
              }
            })
          }
        }
      }) */
    },
    handleCancel() {
      this.visible = false
    },
    init(id, data) {
      console.log(data)
      this.cproId = id
      this.type = 0
      this.loading = false
      this.title = "添加比赛设备"
      this.visible = true
      this.getPcTableList().then(() => {
        console.log(this.tableList)
        const arr = []
        for (const item of this.tableList) {
          for (const key of data) {
            if (item.tabletPcNum === key) {
              arr.push(item)
            }
          }
        }
        this.selectedRowKeys = arr.map(item => item.tabletPcId)
        this.selectedRows = arr
        // const arr = this.tableList.filter(item => item.tabletPcNum.includes(data))
        console.log(arr)
        this.$nextTick(() => {
          for (const key in this.formData){
            this.formData[key] = ""
          }
        })
      })
    },
    edit(row, id) {
      console.log(row, id)
      this.cproId = id
      this.type = 1
      this.title = "编辑比赛设备"
      this.loading = false
      this.visible = true
      this.getPcTableList().then(() => {
        this.$nextTick(() => {
          for (const key in this.formData){
            this.formData[key] = row[key]
          }
          const keys = this.tableList.filter(item => item.tabletPcNum === row.tabletPcNum)[0]
          // console.log(keys)
          this.selectedRowKeys = [keys.tabletPcId]
          this.selectedRows = [keys]
          // tabletPcId
          // this.$refs.form.clearValidate()
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.modal{
  height: 100%;
  overflow-y: auto;
}
</style>