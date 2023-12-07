<template>
  <BizModal :title="title" :visible="visible" @cancel="handleCancel" :loading="loadingModal" :footer="false" widths="50%">
    <div class="modal">
      <a-descriptions bordered :columns="4" title="个人信息">
        <a-descriptions-item label="姓名" :span="1">{{formData.playerName}}</a-descriptions-item>
        <a-descriptions-item label="性别" :span="1">{{formData.playerSex == '1' ? '男' : '女'}}</a-descriptions-item>
        <a-descriptions-item label="团体名称" :span="1">{{formData.groupName}}</a-descriptions-item>
        <a-descriptions-item label="靶位" :span="1">{{formData.targetSite}}</a-descriptions-item>
        <a-descriptions-item label="总环数" :span="2">{{formData.totalScore}}</a-descriptions-item>
        <!--        <a-descriptions-item label="组数" :span="1"></a-descriptions-item>-->
      </a-descriptions>
      <h3>每次射击信息</h3>
      <div>
        <a-table rowKey="playerScoreId" size="middle" :columns="columns" :dataSource="dataSource" :pagination="false" bordered>
          <template slot="operation" slot-scope="text, record">
            <a-space>
              <a-button type="primary" size="small" ghost icon="edit" @click="handleEdit(record)">修改成绩</a-button>
              <a-button type="danger" size="small" ghost icon="stop" @click="handleStop(record)">删除成绩</a-button>
            </a-space>
          </template>
        </a-table>
      </div>
    </div>
    <gameInfoEditResult ref="gameInfoEditResult" @ok="editResultHandle" />
  </BizModal>
</template>

<script>
import gameInfoEditResult from '@views/Competition/gameInfo/modal/gameInfoEditResult.vue'
import { gameInfoModalColumns } from '@views/Competition/gameInfo/gameInfo.config'
import { getScoresByFinalScoreId, delPlayerShootScore, updateScore } from '@api/competition'
import BizModal from '@comp/modal/BizModal.vue'
import { infoMessage } from '@/utils'
export default {
  name: 'gameInfoGroupModal',
  components: {
    BizModal,
    gameInfoEditResult,
  },
  data() {
    return {
      title: '成绩详情',
      visible: false,
      loadingModal: false,
      type: 0,
      columns: [
        {
          dataIndex: 'groupCount',
          title: '组数',
          align: 'center',
          customRender: this.renderContent,
        },
        {
          dataIndex: 'shootCode',
          title: '发序',
          align: 'center',
        },
        {
          dataIndex: 'score',
          title: '成绩',
          align: 'center',
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: {
            customRender: 'operation',
          },
        },
      ],
      formData: {},
      dataSource: [],

      spanArr: [],
      pos: 0,
    }
  },
  methods: {
    editResultHandle(row) {
      updateScore({
        playerScoreId: row.playerScoreId,
        score: row.score,
      }).then((res) => {
        if (res.success) {
          this.$message.success('修改成功！')
          this.$refs.gameInfoEditResult.handleCancel();
          this.edit(this.formData)
          this.$emit('success')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    renderContent: (value, row, index) => {
      const obj = {
        children: value,
        attrs: {
          rowSpan: row.colSpan,
        },
      }
      return obj
    },
    edit(record) {
      this.visible = true
      this.type = 1
      this.loadingModal = false
      this.formData = record
      getScoresByFinalScoreId({
        stageId: record.stageId, //阶段id
        playerId: record.playerId, //运动员id
      }).then((res) => {
        this.spanArr = []
        this.pos = 0
        let data = res.result
        // 循环
        for (var i = 0; i < data.length; i++) {
          // 循环的第一行默认角标给个0，合并数给个1，因为rowspan和colspan需要默认是1，如果是0的话就不显示这个单元格了
          if (i === 0) {
            data[0]['colSpan'] = 1
            this.pos = 0
          } else {
            //这里已经循环到第二行了才会走这里
            // 判断当前行的某一个字段和上一行的某一个字段是否相同？
            if (data[i].groupCount === data[i - 1].groupCount) {
              //如果相同代表要合并，就给上一个元素合并数+1。
              data[this.pos]['colSpan'] += 1 //这里pos是0。所以是给spanArr内第一条数据的合并数加了1，变成了2，代表从第一行开始合并1格，记住，1是默认有一格，没加1代表合并一格
              data[i]['colSpan'] = 0
            } else {
              data[i]['colSpan'] = 1
              this.pos = i //pos的角标也改为当前的循环。方便下一次循环的时候如果两个字段相同，合并数直接从下一个角标算起
            }
          }
        }
        this.dataSource = data
      })
    },
    handleCancel() {
      this.visible = false
    },
    handleEdit(row) {
      console.log()
      this.$refs.gameInfoEditResult.init(row)
    },
    handleStop(row) {
      infoMessage('此操作将删除该运动员选中的成绩！是否继续？').then(() => {
        delPlayerShootScore({
          playerScoreId: row.playerScoreId,
        }).then((res) => {
          if (res.success) {
            this.$message.success('操作成功！成绩已删除！')
            this.edit(this.formData)
            this.$emit('success')
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
  },
}
</script>

<style scoped lang="less">
.modal {
  height: 100%;
  overflow-y: auto;
  h3 {
    margin-top: 20px;
    font-weight: 800;
  }
}
</style>