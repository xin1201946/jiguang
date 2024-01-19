<template>
  <BizModal width="800" :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <div class="modal">
      <a-table :columns="columns" rowKey="id" :dataSource="table" :pagination="false" bordered size="small">
        <template slot="operation" slot-scope="record">
          <!--       <span @click="edit(record)">123456</span>-->
          <a-button @click="edit(record)">结束阶段</a-button>
        </template>
      </a-table>
    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { endFire, selectStageStatusList, startFire } from '@api/competition'
import { infoMessage, numToCapital } from '@/utils'
export default {
  name: 'gameInfoStartModal',
  components: {
    BizModal,
  },
  data() {
    return {
      title: '正在进行的阶段',
      visible: false,
      loadingModal: false,
      option: {},
      table: [],
      columns: [
        {
          title: '赛事名称',
          key: 'contestName',
          align: 'center',
          dataIndex: 'contestName',
        },
        {
          title: '项目名称',
          key: 'cproName',
          dataIndex: 'cproName',
          customRender: (text, record, index) => {
            return `${record.cproName} - ${record.projectGroup}`
          },
          align: 'center',
        },
        /* {
          title: "阶段组别",
          key: "projectGroup",
          dataIndex: "projectGroup"
        }, */
        {
          title: '阶段名称',
          key: 'stageName',
          align: 'center',
          dataIndex: 'stageName',
        },
        {
          title: '阶段组别',
          key: 'stageGroup',
          dataIndex: 'stageGroup',
          align: 'center',
          customRender: (text, record, index) => {
            return `${numToCapital(record.stageGroup)}组`
          },
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: {
            customRender: 'operation',
          },
          width: 100,
        },
      ],
    }
  },
  methods: {
    init(data, option) {
      if (data.code === 200) {
        console.log(data.result)
        this.table = data.result
        this.option = option
        this.visible = true
      } else {
        this.$message.warning(data.message)
      }
    },
    handleOk() {
      startFire(this.option).then((res) => {
        if (res.success) {
          this.$message.success('操作成功！')
          this.visible = false
          this.$emit('list')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    edit(record) {
      infoMessage(
        `是否结束${record.cproName}-${record.projectGroup}  ${record.stageName}${numToCapital(record.stageGroup)}组`
      ).then(() => {
        endFire({
          stageId: record.stageId,
          group: record.stageGroup,
        }).then((res) => {
          if (res.success) {
            this.$message.success('结束成功！')
            selectStageStatusList().then((r) => {
              if (r.code === 200) {
                this.table = r.result
              }
            })
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>


<style scoped lang="less">
.modal {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
</style>