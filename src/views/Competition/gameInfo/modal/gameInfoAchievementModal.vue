<template>
  <BizModal :title="title" :visible="visible" @cancel="handleCancel" :loading="loadingModal" :footer="false"
    widths="35%">
    <div class="modal">
      <a-descriptions bordered :columns="4" title="个人信息">
        <a-descriptions-item label="姓名" :span="1">{{ formData.playerName }}</a-descriptions-item>
        <a-descriptions-item label="性别" :span="1">{{ formData.playerSex == '1' ? '男' : '女' }}</a-descriptions-item>
        <a-descriptions-item label="代表队" :span="1">{{ formData.groupName }}</a-descriptions-item>
        <a-descriptions-item label="靶位" :span="1">{{ formData.targetSite }}</a-descriptions-item>
        <a-descriptions-item label="当前组总环数" :span="2">{{ formData.numberOfRings }}</a-descriptions-item>
        <!-- <a-descriptions-item label="总环数" :span="2">{{ formData.totalScore }}</a-descriptions-item> -->
        <!--        <a-descriptions-item label="组数" :span="1"></a-descriptions-item>-->
      </a-descriptions>
      <div style="display: flex;align-items:center;justify-content: space-between">
        <h3>每次射击信息</h3>
        <a-button type="primary" @click="handleEdit({}, 'add')">添加成绩</a-button>
      </div>
      <div>
        <a-table rowKey="playerScoreId" size="middle" :rowClassName="(r, i) => rowClassName(r, i)" :columns="columns" :dataSource="dataSource" :pagination="false"
          bordered>
          <template slot="scoreSlots" slot-scope="text,record">
            <a-input style="width: 60px;" placeholder="请输入" v-if="record.editable" :value="text"
              @change="e => handleChange(e.target.value, record.playerScoreId)"
              @blur="handleBlur(record.playerScoreId)" />
            <template v-else>
              <!-- 单击 -->
              <!-- <a @click="handleClickAchievement(record)">{{ text }}---*</a> -->
              <a @click="editAchievement(record.playerScoreId)">{{ text }}</a>
              <!-- 双击 -->
              <!-- <a @dblclick="editAchievement(record.playerScoreId)">{{ text }}---*</a> -->
            </template>
          </template>
          <template slot="operation" slot-scope="text, record">
            <a-space>
              <!-- <a-button type="primary" size="small" ghost icon="edit" @click="handleEdit(record,'edit')">修改成绩</a-button> -->
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
import { getScoresByFinalScoreId, delPlayerShootScore, updateScore, saveScore,processGetPlayerScore } from '@api/competition'
import BizModal from '@comp/modal/BizModal.vue'
import { infoMessage } from '@/utils'
export default {
  name: 'gameInfoAchievementModal',
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
          scopedSlots: {
            customRender: 'scoreSlots',
          },
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
      customRow: {}
    }
  },
  methods: {
    rowClassName(r, i) {
      if (r.state == -1) {
        return 'red'
      }
    },
    // 可编辑
    handleChange(value, playerScoreId) {
      const newData = [...this.dataSource]
      const target = newData.find(item => playerScoreId === item.playerScoreId)
      if (target) {
        target.score = value
        this.dataSource = newData
      }
    },
    editAchievement(playerScoreId) {
      const newData = this.dataSource
      const target = newData.find(item => playerScoreId === item.playerScoreId)
      // this.editingKey = playerScoreId
      if (target) {
        // target.editable = true
        this.$set(target, 'editable', true)
        this.dataSource = newData
      }

    },
    handleBlur(playerScoreId) {
      // console.log('Input 失去焦点', playerScoreId);  
      const newData = [...this.dataSource]
      const target = newData.find(item => playerScoreId === item.playerScoreId)
      if (target){
        delete this.$set(target, 'editable')
        this.dataSource = newData
        this.$forceUpdate()
      }
      // return
      updateScore({
          playerScoreId:playerScoreId,
          score: target.score,
        }).then((res) => {
          if (res.success) {
            this.$message.success('修改成功！')
            // this.$refs.gameInfoEditResult.handleCancel()
            this.edit(this.formData)
            this.$emit('success')
          } else {
            this.$message.error(res.message)
          }
        })
      // const newData = [...this.dataSource]
      // const newCacheData = [...this.dataSource]
      // const target = newData.find(item => playerScoreId === item.playerScoreId)
      // const targetCache = newCacheData.find(item => playerScoreId === item.playerScoreId)
      // if (target && targetCache) {
      //   delete this.$set(target, 'editable')
      //   this.dataSource = newData
      //   Object.assign(targetCache, target)
      //   this.dataSource = newCacheData
      //   this.$forceUpdate()
      // }
      // this.editingKey = ''
    },
    editResultHandle(row) {
      if (row.type === 'edit') {
        updateScore({
          playerScoreId: row.data.playerScoreId,
          score: row.data.score,
        }).then((res) => {
          if (res.success) {
            this.$message.success('修改成功！')
            this.$refs.gameInfoEditResult.handleCancel()
            this.edit(this.formData)
            this.$emit('success')
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        const data = {
          ...row.data,
          begin_time: `${row.data.begin_time}:00`,
          pad_code: this.formData.padCode,
          project_name: this.formData.projectName,
          playerId: this.formData.playerId,
        }
        saveScore(data).then((res) => {
          if (res.success) {
            this.$message.success('添加成功！')
            this.$refs.gameInfoEditResult.handleCancel()
            this.edit(this.formData)
            this.$emit('success')
            this.formData.totalScore = (this.formData.totalScore * 1).toFixed(1)
            row.data.score = (row.data.score * 1).toFixed(1)
            this.formData.totalScore = (this.formData.totalScore * 1 + row.data.score * 1).toFixed(1)
          } else {
            this.$message.error(res.message)
          }
        })
      }
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
      // console.log(record,'---**-212');
      // return
      const dataA ={
        finalScoreId:record.finalScoreId,
        groupCount:record.col
      }
      processGetPlayerScore(dataA).then((res)=>{
        if(res.success){
          this.dataSource = res.result
        }else{
          this.$message.error(res.message)
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    handleEdit(row, type) {
      this.$refs.gameInfoEditResult.init(row, type)
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
/deep/.red {
  background: rgba(209, 35, 4, 0.3);
}
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
/deep/.ant-table{
  font-size: 12px !important;
}
</style>