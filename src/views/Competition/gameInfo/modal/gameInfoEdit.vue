<template>
  <BizModal class="gameInfoEdit" :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal" widths="50%">
    <a-table :scroll="{ y: 500 }" :row-selection="rowSelection" :pagination="false" bordered rowKey="playerId" :columns="columns" :dataSource="dataSource">

    </a-table>
  </BizModal>
</template>

<script>
import { getStageInPlayerList } from '@api/competition'
import { gameInfoColumns, gameInfoQuery } from '@views/Competition/gameInfo/gameInfo.config'
import BizModal from '@comp/modal/BizModal.vue'
export default {
  name: 'gameInfoTargetModal',
  components: {
    BizModal,
  },
  data() {
    return {
      columns: [
        {
          dataIndex: 'serialNumber',
          title: '选手编号',
          align: 'center',
        },
        {
          dataIndex: 'playerName',
          title: '姓名',
          align: 'center',
        },
        {
          dataIndex: 'playerSex',
          customRender: (text, record, index) => {
            return record.playerSex == '1' ? '男' : '女'
          },
          title: '性别',
          align: 'center',
        },
        {
          dataIndex: 'idCardNum',
          title: '身份证号',
          align: 'center',
        },
        {
          dataIndex: 'groupName',
          title: '团体名称',
          align: 'center',
        },
        {
          dataIndex: 'isGroup',
          title: '是否团体排名',
          align: 'center',
        },
        {
          dataIndex: 'targetSite',
          title: '靶位',
          align: 'center',
        },
        {
          dataIndex: 'totalScore',
          title: '总环数',
          align: 'center',
        },
      ],
      title: '编辑参赛人员',
      visible: false,
      loadingModal: false,
      dataSource: {},
      rules: {
        // RealTimeView
      },
      row: {},

      selectedRowKeys: [],
      selectionRows: [],
    }
  },
  computed: {
    /** 主table选择事件 */
    rowSelection() {
      let { selectedRowKeys } = this
      return {
        onSelect: (record, selected) => {
          selected
            ? this.selectionRows.push(record)
            : this.selectionRows.splice(
                this.selectionRows.findIndex((x) => x.id === record.id),
                1
              )
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          this.selectionRows = selected
            ? this.selectionRows.concat(changeRows)
            : this.selectionRows.filter((x) => !changeRows.find((i) => i.id === x.id))
        },
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.$nextTick(() => {
            this.selectedRowKeys = selectedRowKeys
          })
        },
      }
    },
  },
  methods: {
    init(obj) {
      this.visible = true
      this.loadingModal = false
      this.dataSource = []

      this.row = obj
      this.selectedRowKeys = obj.dataSource.map((item) => {
        return item.playerId
      })
      this.selectionRows = [...obj.dataSource]
      console.log(this.selectedRowKeys, this.selectionRows)
      getStageInPlayerList({
        stageId: obj.cproStageId,
      }).then((res) => {
        console.log(res)
        if (res.success) {
          this.dataSource = res.result
        }
      })
    },
    handleOk() {
      let obj = {
        stageId: this.row.cproStageId, //阶段id
        players: this.selectionRows.map((item) => {
          return {
            playerId: item.playerId, //运动员id
            playerName: item.playerName, //运动员姓名
          }
        }),
      }
      this.$emit('confirm', obj)
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style scoped lang="less">
</style>