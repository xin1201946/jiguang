<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal"
    widths="35%">
    <div class="modal">
      <a-table :rowSelection="rowSelection" rowKey="playerScoreId" size="middle" :columns="columns"
        :dataSource="dataSource" :pagination="false" bordered>
      </a-table>
    </div>
  </BizModal>
</template>

<script>
import gameInfoEditResult from '@views/Competition/gameInfo/modal/gameInfoEditResult.vue'
import { bizUnifiedUserList, bizUnifiedSaveUnified } from '@api/competition'
import BizModal from '@comp/modal/BizModal.vue'
// import { infoMessage } from '@/utils'
export default {
  name: 'gameInfoAchievementModal',
  components: {
    BizModal,
    gameInfoEditResult,
  },
  data() {
    return {
      title: '成统裁判',
      visible: false,
      loadingModal: false,
      type: 0,
      columns: [
        {
          dataIndex: 'realname',
          title: '姓名',
          align: 'center',
          // customRender: this.renderContent,
        },
        {
          dataIndex: 'username',
          title: '用户账号',
          align: 'center',
        },
        // {
        //   dataIndex: 'post',
        //   title: '职位',
        //   align: 'center',
        // },
      ],
      formData: {},
      dataSource: [],
      selectedRowKeys: [],
      selectionRows: [],
      lists: {},
      userId: undefined
    }
  },
  computed: {
    rowSelection() {
      let { selectedRowKeys } = this
      return {
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.eliminationStatus == 1, // Column configuration not to be checked
          },
        }),
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
          // console.log(selectedRowKeys,selectedRows,'123123q');
          if (selectedRowKeys.length > 1 || selectedRowKeys.length === 0) {
            if (selectedRowKeys.length > 1) { } else {
              this.selectedRowKeys = selectedRowKeys
            }
            this.$message.error('请选择一个裁判员')
          } else {
            this.$nextTick(() => {
              this.selectedRowKeys = selectedRowKeys
              this.userId = selectedRows[0].id
            })
          }

        },
      }
    },
  },
  methods: {
    edit(arr) {
      this.visible = true
      bizUnifiedUserList().then((res) => {
        this.dataSource = res.result
        this.lists = arr
      })
      console.log(arr, '12312312312q')
    },
    // 关闭
    handleCancel() {
      this.visible = false
      this.selectedRowKeys = []
      this.userId = undefined
    },
    handleOk() {
      if (this.selectedRowKeys.length) {
        const dataD = {
          contestId: this.lists.contestId, //赛事id
          cproId: this.lists.cproId, //赛事项目id
          stageId: this.lists.stageId, //项目阶段id
          playerIds: this.lists.playerIds,
          userId: this.userId
        }
        bizUnifiedSaveUnified(dataD).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.handleCancel()
            this.lists = {}
            this.$emit('success')
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.$message.warning('请选择裁判员')
      }
    },
  },
}
</script>

<style scoped lang="less">
.modal {
  height: 100%;
  overflow-y: auto;
  font-size: 12px !important;

  h3 {
    margin-top: 20px;
    font-weight: 800;
  }
}

/deep/.ant-descriptions-item-label,
/deep/.ant-table {
  font-size: 12px !important;
}
</style>