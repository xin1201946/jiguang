<template>
  <div class="gameInfo">
    <div class="btns">
      <a-page-header @back="handleBack" :title="data.contestName"></a-page-header>
      <div class="btns_right">
        <!-- v-if="groupActive" -->
        <div class="btns_right_left" v-if="groupActive">
          <a-tooltip>
            <template slot="title"> {{ projectName }} - {{ projectGroup }}- {{ stageName }} </template>
            {{ projectName }} - {{ projectGroup }}- {{ stageName }}
          </a-tooltip>
        </div>
        <div style="margin-left: 10px">
          <a-form :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="靶位">
                  <a-input placeholder="请输入靶位号" v-model="targetSite" />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item :labelCol="{ span: 0 }">
                  <a-space>
                    <a-button html-type="submit" type="primary" icon="search" @click="handleSubmit">查询</a-button>
                    <a-button @click="handleReset" icon="reload">重置</a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </div>
    <div class="cards">
      <div class="example" v-if="loading2">
        <div>
          <a-spin />
          <p style="width: 100%; color: #333">推送数据中...请稍后</p>
        </div>
      </div>
      <!--  -->
      <AppstoreTreeCard ref="treeCard" @success="successOkTree">
        <template slot="tree">
          <a-directory-tree multiple default-expand-all @select="onSelect" @expand="onExpand">
            <a-tree-node v-for="item in treeList" :key="item.projectId + item.projectGroup" :title="item.projectName + ' - ' + item.projectGroup">
              <a-tree-node v-for="i in item.children" is-leaf :slots="{ title: 'title' }" :key="i.cproStageId">
                <template slot="title">
                  <div class="title">
                    <span>{{ i.stageName }}</span>
                  </div>
                </template>
              </a-tree-node>
            </a-tree-node>
          </a-directory-tree>
        </template>
        <template slot="query">
          <QuerySearch ref="query"></QuerySearch>
        </template>
        <template slot="operator">
          <a-space v-show="cproStageId !== null">
            <a-button type="primary" @click="importHandle">导入参赛人员</a-button>
            <a-button v-if="group === null" type="primary" @click="editHandle">编辑参赛人员</a-button>
            <a-button type="primary" @click="handleGroup">分组</a-button>
            <a-button v-if="group !== null" type="primary" @click="handleDraw">抽签</a-button>
            <a-button v-if="group !== null" type="primary" @click="pushPadHandle">推送平板</a-button>
            <a-button v-if="group !== null && stageName !== '金/铜牌赛' && stageName !== '淘汰赛'" type="primary" @click="nextStageHandle">下一阶段</a-button>
            <a-button v-if="group !== null && (stageName == '金/铜牌赛' || stageName == '淘汰赛')" type="primary" @click="nextStageHandle">结束阶段</a-button>
            <!--            选中组别-->
            <!-- <a-button v-show="group !== null && draw" type="primary">推送大屏</a-button> -->
            <a-button v-if="group !== null" type="primary" @click="handleExports">靶位导出</a-button>
            <a-button v-if="group !== null" type="primary" @click="handleDate">时间管理</a-button>
            <a-button type="primary" @click="handleSameScore">同分</a-button>
            <a-button type="danger" @click="handleEliminate()">淘汰</a-button>
            <a-button type="primary" @click="getTableList">刷新</a-button>
            <a-button type="primary" @click="handleChengTong">成统裁判员</a-button>
            <!-- <a-button type="primary" v-if="groupActive" @click="getGrouping">变更组别</a-button> -->
          </a-space>
        </template>
        <div class="gameInfoTables" v-if="groupActive">
          <div class="gameInfoTables_group">
            <a-tabs v-model="group" @change="radioChangeHandle">
              <a-tab-pane v-for="item in groupList" :value="item.group" :key="item.group" :tab="`${numToCapital(item.group)}组`"></a-tab-pane>
            </a-tabs>
          </div>
          <div class="gameInfoTables_table">
            <div class="table_box_total">
              <a-space style="margin-bottom: 20px">
                <span>总人数：{{ this.dataSource.length }}</span>
                <span v-if="status">当前状态：{{ status }}</span>
                <a-button @click.stop="handleZhunbei()">准备</a-button>
                <a-button @click.stop="handleShishe()" v-if="isAdjustment == '1'">试射</a-button>
                <a-button @click.stop="handleBisai()">开始</a-button>
                <a-button @click.stop="handleEnd()">结束</a-button>
              </a-space>
              <div class="table_box_total_right">
                <a-button type="primary" style="margin-right: 8px" @click="handleTargetLocation()">靶图</a-button>
                <a-button type="primary" style="" @click="handleTablet()">平板监控</a-button>
              </div>
            </div>
            <a-table :rowSelection="rowSelection" :rowClassName="(r, i) => rowClassName(r, i)" bordered rowKey="playerId" :pagination="false" :columns="columns" :dataSource="dataSource" :loading="loading" :scroll="{ x: 1500 }">
              <template slot="power0Slot" slot-scope="text, record">
                <div style="display: flex; justify-content: space-around; align-items: center">
                  <!-- <span :class="record.pcStatus == '0' ? 'spanGRed' : record.pcStatus == '1' ? 'spanGreen' : ''"></span> -->
                  <span :class="record.pcStatus == '0' ? 'spanGreen' : record.pcStatus == '1' ? 'spanGreen' : ''"></span>
                  <!-- <img width='32' height='32' v-if="record.pcStatus == '0'" src="../../../assets/未连接.svg" alt="未连接">
                  <img  width='32' height='32' v-if="record.pcStatus == '1'" src="../../../assets/已连接.svg" alt="已连接"> -->
                  <img width="25" height="25" v-if="record.model == '0'" src="../../../assets/icon-copy.png" alt="试射" />
                  <!-- <img width='25' height='25' v-if="record.model == '0'" src="../../../assets/bottom-left.png" alt="试射"> -->
                  <img width="15" height="15" v-if="record.model == '1'" src="../../../assets/zhengfangxing.png" alt="射击" />
                  <!-- <img width='32' height='32' v-if="record.model == '0'" src="../../../assets/试射.svg" alt="试射">
                  <img width='32' height='32' v-if="record.model == '1'" src="../../../assets/射击.svg" alt="射击"> -->
                  <Electricitylevel :power="text" width="32" height="32"></Electricitylevel>
                  <Electricitylevel :power="record.power1" width="32" height="32"></Electricitylevel>
                </div>
              </template>
              <!-- 总成绩 -->
              <template slot="totalScoreSlot" slot-scope="text, record">
                <a-input placeholder="请输入" v-if="record.editableTotal" :value="text" @change="(e) => handleChangeTotal(e.target.value, record.playerId, record.totalScore)" @blur="handleBlurTotal(record, text)" />
                <template v-else>
                  <!-- 单击 -->
                  <a @click="editAchievementTotal(record.playerId)">{{ record.totalScore }}</a>
                </template>
              </template>
              <!-- 10 20 30组别编辑 -->
              <template v-for="col in strArr" v-slot:[col]="text, record, index">
                <div :key="col" @contextmenu.prevent="handleActionsColumnContextMenu(record, $event, col,index)">
                  <a-input placeholder="请输入" v-if="record.editable" :value="text" @change="(e) => handleChange(e.target.value, record.playerId, col)" @blur="handleBlur(record, col, text)" />
                  <template v-else>
                    <!-- 单击 -->
                    <!-- <a @click="handleClickAchievement(record)">{{ text }}---*</a> -->
                    <a @click="editAchievement(record.playerId)">{{ text }}</a>
                    <!-- 双击 -->
                    <!-- <a @dblclick="editAchievement(record.serialNumber)">{{ text }}---*</a> -->
                  </template>
                </div>
              </template>
              <!-- 操作 -->
              <template slot="operation" slot-scope="text, record">
                <a-space>
                  <!-- 总环数为空不渲染成绩详情按钮-->
                  <!-- <a-button v-if="['准备中', '试射中', '比赛中', '成绩显示', '已结束'].indexOf(status) !== -1" type="primary"
                    size="small" ghost icon="profile" @click="handleInfo(record)">成绩详情</a-button> -->
                  <!-- ['成绩显示','已结束'].indexOf(status) == -1 &&  -->
                  <a-button v-if="projectName.includes('团体')" type="primary" size="small" ghost icon="profile" @click="handleInfo(record)">成绩详情</a-button>
                  <a-button v-if="record.eliminationStatus != 1" type="danger" size="small" ghost icon="stop" @click="handleStop(record)">停止比赛</a-button>
                  <a-dropdown>
                    <a style="display: block; width: 80px" @click="(e) => e.preventDefault()">
                      更多 <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item v-if="record.targetSite && record.eliminationStatus != 1">
                        <a-button type="link" size="small" icon="retweet" @click="handleRetweet(record)">更换靶位</a-button>
                      </a-menu-item>
                      <a-menu-item>
                        <a-button type="link" size="small" icon="flag" @click="handlePenalty(record)">判罚</a-button>
                      </a-menu-item>
                      <a-menu-item>
                        <a-button type="link" size="small" icon="form" @click="handleRemark(record)">备注</a-button>
                      </a-menu-item>
                      <a-menu-item>
                        <a-button type="link" size="small" icon="swap" v-if="stageName !== '金/铜牌赛' && stageName !== '决赛'" @click="handleGrouping(record)">变更组别</a-button>
                      </a-menu-item>
                      <a-menu-item>
                        <a-button type="link" size="small" icon="swap" v-if="stageName !== '金/铜牌赛'" @click="handleSetShoot(record)">设置发序无效</a-button>
                      </a-menu-item>

                    </a-menu>
                  </a-dropdown>
                </a-space>
              </template>
            </a-table>
          </div>
        </div>
        <a-space style="margin-bottom: 20px" v-if="!groupActive && this.dataSource.length != 0">
          <span>总人数：{{ this.dataSource.length }}</span>
        </a-space>
        <a-table bordered v-if="!groupActive" rowKey="playerId" :columns="columns" :dataSource="dataSource" :pagination="false" :loading="loading">
        </a-table>
        <!-- 抽签 -->
        <gameInfoDrawModal ref="draw" @list="drawListHandle"></gameInfoDrawModal>
        <!-- 抽签混合团体 -->
        <gameInfoBlendModal ref="blend" @list="blendListHandle"></gameInfoBlendModal>
        <!-- 编辑靶位 -->
        <gameInfoTargetModal></gameInfoTargetModal>
        <!-- 分组 -->
        <GameInfoGroupModal ref="group" @success="getTableList"></GameInfoGroupModal>
        <!-- 判罚 -->
        <GameInfoPenaltyModal ref="penalty" @confirm="setPenalty" />
        <!-- 编辑比赛人员 -->
        <GameInfoEditModal ref="edit" @confirm="editSuccessHandle" />
        <!-- 备注 -->
        <GameInfoRemarkModal ref="remark" @ok="remarkSuccessHandle" />
        <!-- 时间管理 -->
        <GameInfoDateModal ref="date"></GameInfoDateModal>
        <!-- 更改靶位 -->
        <GameRetweetModal ref="retweet" @confirm="retweetSuccessHandle" />
        <!-- 同分 -->
        <GameInfoSameScoreModal ref="sameScore" @ok="sameScoreSuccessHandle" />
        <!-- 切换分组 -->
        <GameInfoSwitchGrouping ref="switchGrouping" @ok="switchSuccessHandle" />
        <!-- 变更组别 -->
        <GameInfoChangeGroup ref="gameChangeGroupRef" @ok="changeGroupRefHandle" />
        <!-- 平板监控 -->
        <TabletMonitoring ref="TabletMonitoringRef" />
        <GameInfoStartModal ref="start" @list="getTableList"></GameInfoStartModal>
        <!-- 行内成绩详情 -->
        <GameInfoAchievementModal ref="Achievement" @success="getTableList"></GameInfoAchievementModal>
        <!-- 成统裁判员 -->
        <GameinfoChengTongJudge ref="gameinfoChengTongJudgeRef" @success="successOk"></GameinfoChengTongJudge>
        <!-- 靶图靶点 -->
        <TargetMapTargetPoint ref="TargetMapTargetPointRef" @success="successOk"></TargetMapTargetPoint>
        <!-- 靶图靶点 -->
        <GameSetShootModel ref="GameSetShootModel" @confirm="setShootSuccessHandle"></GameSetShootModel>
      </AppstoreTreeCard>
    </div>
  </div>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import { gameInfoColumns } from '@views/Competition/gameInfo/gameInfo.config'
import gameInfoTargetModal from '@views/Competition/gameInfo/modal/gameInfoTargetModal.vue'
import gameInfoBlendModal from '@views/Competition/gameInfo/modal/gameInfoBlendModal.vue'
import gameInfoDrawModal from '@views/Competition/gameInfo/modal/gameInfoDrawModal.vue'
import GameInfoGroupModal from '@views/Competition/gameInfo/modal/gameInfoGroupModal.vue'
import GameInfoAchievementModal from '@views/Competition/gameInfo/modal/gameInfoAchievementModal.vue'
import GameInfoPenaltyModal from '@views/Competition/gameInfo/modal/gameInfoPenalty.vue'
import GameInfoEditModal from '@views/Competition/gameInfo/modal/gameInfoEdit.vue'
import GameInfoRemarkModal from '@views/Competition/gameInfo/modal/gameInfoRemark.vue'
import TreeCard from '@comp/card/TreeCard.vue'
import AppstoreTreeCard from '@comp/card/appstoreTreeCard.vue'
import GameInfoDateModal from '@views/Competition/gameInfo/modal/gameInfoDateModal.vue'
import GameRetweetModal from '@views/Competition/gameInfo/modal/gameInfoRetweet.vue'
import GameInfoSameScoreModal from '@views/Competition/gameInfo/modal/gameInfoSameScore.vue'
import GameInfoSwitchGrouping from '@views/Competition/gameInfo/modal/gameInfoSwitchGrouping.vue'
import GameInfoChangeGroup from '@views/Competition/gameInfo/modal/gameInfoChangeGroup.vue'
import TabletMonitoring from '../../tabletMonitoring/index'
import GameInfoStartModal from '@views/Competition/gameInfo/modal/gameInfoStartModal.vue'
import GameinfoChengTongJudge from '@views/Competition/gameInfo/modal/gameinfoChengTongJudge.vue'
import TargetMapTargetPoint from '@/views/targetImage/targetMapTargetPoint'
import Electricitylevel from '@views/Competition/gameInfo/electricitylevel.vue'
import GameSetShootModel from '@views/Competition/gameInfo/modal/gameSetShootModel.vue'
import {
  bizContestProjectList,
  bizContestProjectStageList,
  getStagePlayerGroup,
  addStagePlayer,
  stagePlayerGroup,
  drawing,
  propePlayerSiteToPad,
  ready,
  fireAdjust,
  startFire,
  endFire,
  nextStage,
  stopPlayer,
  penalty,
  editStagePlayer,
  contest_processGetSitePdf,
  remark,
  contest_processGetStageGroupTime,
  retarget,
  eliminationFinal,
  sameFinals,
  changeGroup, //切换分组
  changeGroupContest,
  selectStageStatusList, //变更分组
  processEditGroupScore,
  grabShot, // 设置发序无效
} from '@api/competition'
import { numToCapital, infoMessage, deleteMessage } from '@/utils'
function extractValue(str) {
  const regex = /_([^_]*?)x/
  const match = str.match(regex)
  if (match) {
    return match[1] // 返回第一个捕获组的内容
  } else {
    return null // 如果没有匹配，返回null或其他适当的值
  }
}
function extractValueBeforeUnderscore(str) {
  const match = str.match(/^(.*?)_(.*)$/)
  if (match) {
    // 如果存在_，则返回_之前的部分
    return match[1]
  } else {
    // 如果不存在_，则返回原字符串或根据需要返回其他值
    return str // 或者返回null，表示没有提取到值
  }
}
export default {
  name: 'gameInfo',
  components: {
    TreeCard,
    Card,
    AppstoreTreeCard,
    QuerySearch,
    gameInfoTargetModal,
    gameInfoDrawModal,
    GameInfoGroupModal,
    GameInfoPenaltyModal,
    GameInfoEditModal,
    GameInfoRemarkModal,
    GameInfoDateModal,
    GameRetweetModal,
    GameInfoSameScoreModal,
    GameInfoSwitchGrouping,
    GameInfoChangeGroup,
    TabletMonitoring, //平板监控
    GameInfoStartModal,
    GameInfoAchievementModal,
    GameinfoChengTongJudge,
    TargetMapTargetPoint,
    Electricitylevel,
    gameInfoBlendModal,
    GameSetShootModel,
  },
  inject: ['closeCurrent'],
  data() {
    return {
      loading2: false,

      treeList: [],
      cproStageId: null,
      cproId: null,
      // columns: gameInfoColumns,
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
          dataIndex: 'targetSite',
          title: '靶位',
          align: 'center',
        },
        {
          dataIndex: 'padCode',
          title: '设备号',
          align: 'center',
        },
        {
          dataIndex: 'power0',
          title: '设备连接状态（枪、靶）',
          align: 'center',
          scopedSlots: {
            customRender: 'power0Slot',
          },
        },
        // {
        //   dataIndex: 'playerSex',
        //   customRender: (text, record, index) => {
        //     return record.playerSex == '1' ? '男' : '女'
        //   },
        //   title: '性别',
        //   align: 'center',
        // },
        // {
        //   dataIndex: 'idCardNum',
        //   title: '身份证号',
        //   align: 'center',
        // },
        {
          dataIndex: 'groupName',
          title: '代表队',
          align: 'center',
        },
        {
          dataIndex: 'isGroup',
          title: '是否团体排名',
          align: 'center',
        },
        {
          dataIndex: 'totalScore',
          title: '总环数',
          align: 'center',
          scopedSlots: {
            customRender: 'totalScoreSlot',
          },
        },
      ],
      group: null,
      groupList: [],
      groupActive: false,
      draw: false,

      data: {},

      dataSource: [],
      loading: false,

      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
      },

      status: '',
      stageName: '',
      isAdjustment: '',
      projectName: '',

      selectedRowKeys: [],
      selectionRows: [],

      // 可编辑参数
      editingKey: '',
      // 每一列的插槽名 - 表格行内编辑用
      strArr: [],
      // 对于某些自动赋值的input框设为 只读
      readonlyArr: [''],
      menuVisible: false,
      targetSite: '',
      projectGroup: '',
    }
  },
  methods: {
    //设置发序无效
    handleSetShoot(row) {
      this.$refs.GameSetShootModel.init(row)
    },
    setShootSuccessHandle(row) {
      const data = {
        finalScoreId: row.finalScoreId,
        groupCount: row.groupCount,
        mode: this.stageName === '资格赛' ? 1 : 2,
        shootCode: row.shootCode,
      }
      grabShot(data).then((res) => {
        if (res.success) {
          this.$message.success('设置成功！')
          this.getTableList()
          this.$refs.GameSetShootModel.handleCancel()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleActionsColumnContextMenu(record, event, col, i) {
      // console.log(col, record.col,i)
      event.preventDefault() // 阻止默认的右键菜单
      // 在这里添加你的自定义右键菜单逻辑
      // console.log('Right-clicked on actions column for record:', record, event, event.target.innerText, 'qaaaaa')
      this.$refs.Achievement.edit({
        ...record,
        col,
        stageId: this.cproStageId,
        projectName: this.projectName,
        numberOfRings: event.target.innerText,
      })
    },
    // 可编辑
    handleChange(value, playerId, column) {
      const newData = [...this.dataSource]
      const target = newData.find((item) => playerId === item.playerId)
      if (target) {
        target[column] = value
        this.dataSource = newData
      }
    },
    editAchievement(playerId) {
      const newData = this.dataSource
      const target = newData.find((item) => playerId === item.playerId)
      this.editingKey = playerId
      if (target) {
        target.editable = true
        this.dataSource = newData
        this.$forceUpdate()
      }
    },
    handleBlur(record, cal, text) {
      // console.log('Input 失去焦点', record, cal, text)
      const dataBlur = {
        type: 1,
        finalScoreId: record.finalScoreId,
        scoreGroup: cal,
        score: text,
      }
      processEditGroupScore(dataBlur).then((res) => {
        if (res.success) {
          const newData = [...this.dataSource]
          const target = newData.find((item) => record.playerId === item.playerId)
          if (target) {
            delete target.editable
            this.dataSource = newData
            this.$forceUpdate()
          }
          this.$message.success('修改组别成绩成功！')
          this.getTableList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    cancelAchievement(playerId) {
      const newData = [...this.dataSource]
      const target = newData.find((item) => playerId === item.playerId)
      this.editingKey = ''
      if (target) {
        Object.assign(
          target,
          this.dataSource.find((item) => playerId === item.playerId)
        )
        delete target.editable
        this.dataSource = newData
        this.$forceUpdate()
      }
    },
    // 总成绩
    editAchievementTotal(playerId) {
      const newData = this.dataSource
      const target = newData.find((item) => playerId === item.playerId)
      // this.editingKey = playerId
      if (target) {
        target.editableTotal = true
        this.dataSource = newData
        this.$forceUpdate()
      }
    },
    // 编辑赋值
    handleChangeTotal(value, playerId) {
      const newData = [...this.dataSource]
      const target = newData.find((item) => playerId === item.playerId)
      if (target) {
        target.totalScore = value
        this.dataSource = newData
      }
    },

    // 总成绩失去焦点
    handleBlurTotal(record, cal) {
      let dataBlur
      if (extractValue(cal) !== null) {
        dataBlur = {
          type: 0,
          finalScoreId: record.finalScoreId,
          goodTotal: extractValue(cal), //好十环，type=0，且页面显示好十环时
          score: extractValueBeforeUnderscore(cal),
        }
      } else {
        dataBlur = {
          type: 0,
          finalScoreId: record.finalScoreId,
          score: extractValueBeforeUnderscore(cal),
        }
      }
      processEditGroupScore(dataBlur).then((res) => {
        if (res.success) {
          const newData = [...this.dataSource]
          const target = newData.find((item) => record.playerId === item.playerId)
          if (target) {
            delete target.editableTotal
            this.dataSource = newData
            this.$forceUpdate()
          }
          this.$message.success('修改总成绩成功！')
          this.getTableList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /*** 可编辑结尾****/

    rowClassName(r, i) {
      if (r.remarkPenalty) {
        return 'red'
      }
      if (r.sameStatus == 1) {
        return 'tongfen'
      }
      if (r.eliminationStatus == 1) {
        return 'taotai'
      }
      if (r.remark) {
        if (r.remark.toUpperCase() === 'DNF') {
          return 'dnf'
        }
        if (r.remark.toUpperCase() === 'DNS') {
          return 'dns'
        }
      }
    },
    /**
     * 同分
     */
    handleSameScore() {
      if (this.selectedRowKeys.length < 2) {
        return this.$message.error('至少选中两名参赛选手!')
      }
      this.$refs.sameScore.init(this.selectionRows)
    },
    sameScoreSuccessHandle(data) {
      sameFinals({
        ...data,
        stageId: this.cproStageId,
      }).then((res) => {
        if (res.success) {
          this.$message.success('同分操作成功！')
          this.getTableList()
          this.$refs.sameScore.handleCancel()
          this.selectedRowKeys = []
          this.selectionRows = []
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 切换分组
    getGrouping() {
      if (this.selectedRowKeys.length < 1) {
        return this.$message.error('至少选中一名参赛选手!')
      }
      this.$refs.switchGrouping.init(this.selectionRows)
    },
    // switchGrouping   没有核对
    switchSuccessHandle(data) {
      let arrData = {
        contestId: this.data.contestId, //赛事id
        cproId: this.cproId, //赛事项目id
        stageId: this.cproStageId, //项目阶段id,
      }
      changeGroup({
        ...data,
        ...arrData,
      }).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.getTableList()
          this.$refs.switchGrouping.handleCancel()
          this.selectedRowKeys = []
          this.selectionRows = []
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 淘汰接口
     */
    handleEliminate() {
      let arr = this.dataSource.filter((item) => {
        if (item.sameStatus == 1) {
          return item.playerId
        }
      })
      let playerIds = arr.map((item) => {
        return item.playerId
      })
      infoMessage('此操作将淘汰该运动员！是否继续？').then(() => {
        eliminationFinal({
          playerIds,
          stageId: this.cproStageId,
        }).then((res) => {
          if (res.success) {
            this.$message.success('操作成功！该运动员已被淘汰！')
            this.getTableList()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    /**
     * 更换靶位
     */
    handleRetweet(row) {
      this.$refs.retweet.init({ ...row, cproId: this.cproId, stageGroup: this.group, stageId: this.cproStageId })
    },
    retweetSuccessHandle(row) {
      const data = {
        contestId: row.contestId, //赛事id
        cproId: row.cproId, //赛事项目id
        stageId: row.stageId, //项目阶段id
        playerId: row.playerId, //运动员id
        targetSiteOld: row.targetSite,
        targetSiteNew: row.targetSiteNew,
        stageGroup: row.stageGroup,
        remark: row.remark, //备注
      }
      retarget(data).then((res) => {
        if (res.success) {
          this.$message.success('更换靶位成功！')
          this.getTableList()
          this.$refs.retweet.handleCancel()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 时间管理
    handleDate() {
      const obj = {
        contestId: this.data.contestId, //赛事id
        cproId: this.cproId, //赛事项目id
        stageId: this.cproStageId, //项目阶段id
      }
      contest_processGetStageGroupTime(obj).then((res) => {
        if (res.code === 200) {
          this.$refs.date.init(res.result, obj)
        }
      })
    },
    editSuccessHandle(e) {
      editStagePlayer(e).then((res) => {
        if (res.success) {
          this.$message.success('编辑参赛人员成功！')
          this.getTableList()
          this.$refs.edit.handleCancel()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 编辑参赛人员
     */
    editHandle() {
      this.$refs.edit.init({
        cproStageId: this.cproStageId,
        dataSource: this.dataSource,
      })
    },
    /**
     * 打开备注
     */
    handleRemark(row) {
      this.$refs.remark.init(row)
    },
    remarkSuccessHandle(e) {
      remark({
        stageId: this.cproStageId, //阶段id
        playerId: e.playerId, //运动员id
        remark: e.remark, //备注
      }).then((res) => {
        if (res.success) {
          this.$message.success('操作成功！')
          this.getTableList()
          this.$refs.remark.handleCancel()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 打开判罚
    handlePenalty(row) {
      this.$refs.penalty.init(row)
    },
    /**
     * 判罚扣分
     */
    setPenalty(e) {
      penalty({
        stageId: this.cproStageId, //阶段id
        playerId: e.playerId, //运动员id
        shootCode: e.shootCode, //发序
        score: e.score, //环数
        remarkPenalty: e.remarkPenalty, //备注
      }).then((res) => {
        if (res.success) {
          this.$message.success('改判成功！')
          this.getTableList()
          this.$refs.penalty.handleCancel()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 打开变更组别 handleGrouping
     */
    handleGrouping(row) {
      this.$refs.gameChangeGroupRef.init({
        ...row,
        cproId: this.cproId,
        stageGroup: this.group,
        stageId: this.cproStageId,
      })
    },
    /**
     * 变更组别
     */
    changeGroupRefHandle(i) {
      changeGroupContest({
        contestId: i.contestId,
        cproId: i.cproId,
        playerId: i.playerId,
        stageId: i.stageId,
        stageGroup: i.stageGroupNew,
        targetSite: i.targetSiteNew,
      }).then((res) => {
        if (res.success) {
          this.$message.success('变更组别成功！')
          this.getTableList()
          this.$refs.gameChangeGroupRef.handleCancel()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleTableChange(pagination) {
      this.pagination = pagination
      // this.getList()
    },
    handleInfo(record) {
      this.$refs.group.edit({ ...record, stageId: this.cproStageId, projectName: this.projectName })
    },
    numToCapital,
    /**
     * 停止比赛
     */
    handleStop(row) {
      infoMessage('此操作将停止该运动员继续比赛！是否继续？').then(() => {
        stopPlayer({
          playerId: row.playerId,
          stageId: this.cproStageId, //项目阶段id
        }).then((res) => {
          if (res.success) {
            this.$message.success('操作成功！该运动员已被停止比赛！')
            this.getTableList()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    /**
     * 推送到pad
     */
    pushPadHandle() {
      this.loading2 = true
      propePlayerSiteToPad({
        playerIds: this.selectedRowKeys,
        contestId: this.data.contestId, //赛事id
        cproId: this.cproId, //赛事项目id
        stageId: this.cproStageId, //项目阶段id
        group: this.group,
      })
        .then((res) => {
          if (res.success) {
            this.$message.success('推送成功！')
            this.selectedRowKeys = []
            this.selectionRows = []
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.loading2 = false
        })
    },
    /**
     * 导入
     */
    importHandle() {
      addStagePlayer({
        contestId: this.data.contestId, //赛事id
        cproId: this.cproId, //赛事项目id
        stageId: this.cproStageId, //项目阶段id
      }).then((res) => {
        if (res.success) {
          this.$message.success('导入成功！')
          this.getTableList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 获取table数据
     */
    getTableList() {
      this.loading = true
      getStagePlayerGroup({
        contestId: this.data.contestId, //赛事id
        cproId: this.cproId, //赛事项目id
        stageId: this.cproStageId, //项目阶段id
        targetSite: this.targetSite,
      })
        .then((res) => {
          if (res.success) {
            if (res.result[0].group === -1) {
              this.group = null
              this.groupList = []
              this.groupActive = false
              this.status = ''
              this.dataSource = res.result[0].bizContestPlayerList.map((item, i) => ({
                ...item,
                i,
              }))
            } else {
              if (!this.group) {
                this.group = res.result[0].group
                this.status = res.result[0].status
                this.groupList = res.result
                this.groupActive = true
                this.radioChangeHandle(res.result[0].group)
              } else {
                this.status = res.result[0].status
                this.groupList = res.result
                this.groupActive = true
                this.radioChangeHandle(this.group)
              }
            }
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = false
          this.$refs.treeCard.loading = false
        })
    },
    /**
     * 选择组别
     */
    radioChangeHandle(e) {
      let strArr = []
      // this.group = e
      // console.log(this.groupList)
      this.groupList.forEach((item) => {
        if (item.group == this.group) {
          // console.log(item)
          this.status = item.status
          strArr = item.scoreGroup
          this.strArr = item.scoreGroup
          /*let Source = item.bizContestPlayerList.map((item, i) => ({
            ...item,
            i,
          }))
          const newSource = Source.map((item) => {
            const newItem = { ...item }
            for (let index = 0; index < strArr.length && index < item.groupScoreList.length; index++) {
              newItem[strArr[index]] = item.groupScoreList[index].gunGroupTotal
              newItem['strArr'] = strArr
            }
            return newItem // 返回新对象
          })*/
          let Source = item.bizContestPlayerList.map((key, i) => ({
            ...key,
            i,
          }))
          const newSource = Source.map((key) => {
            // console.log(key)
            const newItem = { ...key }
            if (key.groupScoreList) {
              for (let index = 0; index < strArr.length && index < key.groupScoreList.length; index++) {
                newItem[strArr[index]] = key.groupScoreList[index].gunGroupTotal
                newItem['strArr'] = strArr
              }
            }
            return newItem // 返回新对象
          })
          // console.log(newSource, 123456)
          this.dataSource = [...newSource]
          // console.log(this.dataSource)
          // console.log(this.dataSource, 'qweqweqwewqq123123232')
        }
      })
      // gameInfoColumns
      this.columns = [
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
          dataIndex: 'targetSite',
          title: '靶位',
          align: 'center',
        },
        {
          dataIndex: 'padCode',
          title: '设备号',
          align: 'center',
        },
        {
          dataIndex: 'power0',
          title: '设备连接状态（枪、靶）',
          align: 'center',
          width: 200,
          scopedSlots: {
            customRender: 'power0Slot',
          },
        },
        // {
        //   dataIndex: 'playerSex',
        //   customRender: (text, record, index) => {
        //     return record.playerSex == '1' ? '男' : '女'
        //   },
        //   title: '性别',
        //   align: 'center',
        // },
        // {
        //   dataIndex: 'idCardNum',
        //   title: '身份证号',
        //   align: 'center',
        // },
        {
          dataIndex: 'groupName',
          title: '代表队',
          align: 'center',
        },
        {
          dataIndex: 'isGroup',
          title: '是否团体排名',
          align: 'center',
        },
        {
          dataIndex: 'totalScore',
          title: '总环数',
          align: 'center',
          scopedSlots: {
            customRender: 'totalScoreSlot',
          },
        },
      ]
      let arrColumns = []
      for (let i = 0; i < strArr.length; i++) {
        arrColumns.push({
          dataIndex: strArr[i],
          title: `${strArr[i]}`,
          align: 'center',
          scopedSlots: {
            customRender: strArr[i],
          },
        })
      }
      this.columns.push(...arrColumns, {
        title: '操作',
        align: 'center',
        dataIndex: 'operation',
        scopedSlots: {
          customRender: 'operation',
        },
        width: 220,
        fixed: 'right',
      })
      // }
    },
    /**
     * 头部返回
     */
    handleBack() {
      this.$nextTick(() => {
        this.closeCurrent()
        this.$router.push('/competition/competitionList')
      })
    },
    /**
     * 下一阶段
     */
    nextStageHandle() {
      infoMessage('此操作将进入下一阶段！是否继续？').then(() => {
        nextStage({
          stageId: this.cproStageId, //项目阶段id
        }).then((res) => {
          if (res.success) {
            this.$message.success('操作成功！')
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    /**
     * 主表单按钮功能
     */
    handleDraw() {
      if (this.projectName.includes('混合团体')) {
        this.$refs.blend.init()
      } else {
        this.$refs.draw.init()
      }
    },
    /**
     * 分组
     */
    handleGroup() {
      infoMessage('此操作将给选手分组！是否继续？').then(() => {
        stagePlayerGroup({
          contestId: this.data.contestId, //赛事id
          cproId: this.cproId, //赛事项目id
          stageId: this.cproStageId, //项目阶段id
        }).then((res) => {
          if (res.success) {
            this.$message.success('分组成功！')
            this.status = ''
            this.groupActive = true
            this.group = null
            this.getTableList()
          } else {
            this.$message.error(res.message)
          }
        })
      })
      /* this.$confirm({
        title: '提示',
        content: '此操作将给选手分组！是否继续？',
        onOk: () => {
          stagePlayerGroup({
            contestId: this.data.contestId, //赛事id
            cproId: this.cproId, //赛事项目id
            stageId: this.cproStageId, //项目阶段id
          }).then((res) => {
            if (res.success) {
              this.$message.success('分组成功！')
              this.groupActive = true
              this.getTableList()
            } else {
              this.$message.error(res.message)
            }
          })
        },
        onCancel() {},
      }) */
    },
    /**
     * 获取数据
     */
    getProjectList() {
      bizContestProjectList({
        contestId: this.data.contestId,
      }).then((res) => {
        const arr = res.result.map(async (item) => {
          const stage = await bizContestProjectStageList({
            contestId: item.contestId,
            cproId: item.cproId,
          })
          return {
            ...item,
            children: stage.result.length ? stage.result : [],
          }
        })
        this.getTree(arr)
      })
    },
    getTree(arr) {
      Promise.all(arr).then((res) => {
        this.treeList = res
      })
    },
    /**
     * 左侧功能
     */

    onSelect(keys, event) {
      // console.log('Trigger Select', event.node)
      this.$refs.treeCard.loading = true
      // isLeaf 为true时是最底层
      // keys 阶段id
      if (event.node.isLeaf) {
        this.cproStageId = keys[0]
        this.draw = false
        this.group = null
        this.groupActive = false
        function findParent(data, target, result) {
          data.forEach((item) => {
            item.children.forEach((e) => {
              if (e.cproStageId === target) {
                result.push(item)
              }
            })
          })
        }
        let result = []
        findParent(this.treeList, this.cproStageId, result)

        function searchItem(data, target, list) {
          data.forEach((item) => {
            if (item.cproStageId == target) {
              list.push(item)
            }
            if (item.children) {
              searchItem(item.children, target, list)
            }
          })
        }
        let arr = []
        searchItem(this.treeList, this.cproStageId, arr)
        this.stageName = arr[0].stageName
        this.isAdjustment = arr[0].isAdjustment
        this.cproId = result[0].cproId
        this.projectName = result[0].projectName
        this.projectGroup = result[0].projectGroup
        this.getTableList()
      } else {
        this.cproStageId = null
        this.draw = false
        this.group = null
        this.groupActive = false
        this.$refs.treeCard.loading = false
      }
    },
    onExpand(v, e) {
      console.log(1)
    },
    // 查询
    handleSubmit() {
      this.getTableList()
    },
    // 重置
    handleReset() {
      this.targetSite = undefined
      this.getTableList()
    },
    handleZhunbei(row) {
      ready({
        stageId: this.cproStageId, //项目阶段id
        group: this.group,
      }).then((res) => {
        if (res.success) {
          this.$message.success('操作成功！')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleShishe(row) {
      fireAdjust({
        playerIds: this.selectedRowKeys,
        stageId: this.cproStageId, //项目阶段id
        group: this.group,
      }).then((res) => {
        if (res.success) {
          this.$message.success('操作成功！')
          his.selectedRowKeys = []
          this.selectionRows = []
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleBisai(row) {
      selectStageStatusList({
        contestId: this.data.contestId,
        cproId: this.cproId, //赛事项目id
        stageGroup: this.group,
      }).then((r) => {
        if (r.result.length) {
          this.$refs.start.init(r, {
            stageId: this.cproStageId, //项目阶段id
            group: this.group,
          })
        } else {
          startFire({
            stageId: this.cproStageId, //项目阶段id
            group: this.group,
            playerIds: this.selectedRowKeys,
          }).then((res) => {
            if (res.success) {
              this.$message.success('操作成功！')
              his.selectedRowKeys = []
              this.selectionRows = []
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    handleEnd() {
      endFire({
        stageId: this.cproStageId, //项目阶段id
        group: this.group,
      }).then((res) => {
        if (res.success) {
          this.$message.success('操作成功！')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 弹窗回调
     */
    drawListHandle(e) {
      this.draw = true
      drawing({
        contestId: this.data.contestId, //赛事id
        cproId: this.cproId, //赛事项目id
        stageId: this.cproStageId, //项目阶段id
        group: this.group, //人员组别
        startNo: e.startNo, //靶位开始编号
        endNo: e.endNo, //靶位结束编号
      }).then((res) => {
        if (res.success) {
          this.$message.success('抽签成功！')
          this.getTableList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 抽签混合弹窗
    blendListHandle(e) {
      this.draw = true
      const noStr = e.noStr
      drawing({
        contestId: this.data.contestId, //赛事id
        cproId: this.cproId, //赛事项目id
        stageId: this.cproStageId, //项目阶段id
        group: this.group, //人员组别
        noStr: noStr,
      }).then((res) => {
        if (res.success) {
          // console.log(res);
          this.$message.success('抽签成功！')
          this.getTableList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleExports() {
      // 导出
      const data = {
        contestId: this.data.contestId, //赛事id
        cproId: this.cproId, //赛事项目id
        stageId: this.cproStageId, //项目阶段id,
        group: this.group, // 组
      }
      const dc = () => {
        contest_processGetSitePdf(data).then((res) => {
          const blob = new Blob([res], { type: 'text/plain' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.style.display = 'none'
          a.href = url
          a.setAttribute('download', '靶位导出.pdf')
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        })
      }
      const list = this.dataSource.map((item) => item.targetSite).filter((item) => item)
      if (list.length) {
        dc()
      } else {
        infoMessage('当前组别未进行抽签，是否确认导出。').then((res) => {
          dc()
        })
      }
    },
    groupListHandle() {},

    // 平板监控
    handleTablet() {
      const res = {
        contestId: this.data.contestId, //赛事id
        cproId: this.cproId, //赛事项目id
        cproStageId: this.cproStageId, //项目阶段id
        // status:this.status,
        stageGroup: this.group,
      }
      this.$refs.TabletMonitoringRef.init(res)
    },
    // 分配成统裁判员
    handleChengTong() {
      if (this.selectedRowKeys.length) {
        // console.log(this.selectedRowKeys,'qaaaww111');
        const arr = {
          contestId: this.data.contestId, //赛事id
          cproId: this.cproId, //赛事项目id
          stageId: this.cproStageId, //项目阶段id
          playerIds: this.selectedRowKeys.join(','),
        }
        this.$refs.gameinfoChengTongJudgeRef.edit(arr)
      } else {
        this.$message.warning('请选择要分配裁判的运动员！')
      }
    },
    // 靶图靶点
    handleTargetLocation() {
      const arr = {
        stageId: this.cproStageId, //项目阶段id
        projectName: this.projectName, //项目名称
      }
      this.$refs.TargetMapTargetPointRef.eidt(arr)
    },
    successOk() {
      this.selectedRowKeys = []
      this.getTableList()
    },
    successOkTree() {
      if (this.data.contestId !== null && this.cproId !== null && this.cproStageId !== null) {
        this.selectedRowKeys = []
        this.getTableList()
      }
    },
  },
  mounted() {
    this.data = JSON.parse(decodeURI(this.$route.query.row))
    this.getProjectList()
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
          this.$nextTick(() => {
            this.selectedRowKeys = selectedRowKeys
          })
        },
      }
    },
  },
}
</script>

<style scoped lang="less">
@btnHeight: 50px;

/deep/.treeCard .treeCard_tree {
  overflow: scroll;
  background-color: #fff;
}

/deep/.red {
  background: rgba(209, 35, 4, 0.3);
}

/deep/.tongfen {
  background: rgba(252, 241, 87, 0.3);
}

/deep/.taotai {
  background: rgba(124, 124, 124, 0.3);
}

/deep/.dnf {
  background: #79beec;
}

/deep/.dns {
  background: #eeb478;
}

.gameInfo {
  height: 100%;
  overflow: hidden;

  .btns {
    height: @btnHeight;
    background: #fff;
    margin-bottom: 10px;
    line-height: @btnHeight;
    overflow: hidden;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    justify-content: space-between;
  }

  .cards {
    position: relative;
    height: calc(100% - @btnHeight - 10px);

    .example {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9999;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      text-align: center;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 4px;
    }

    /deep/.ant-tree-child-tree.ant-tree-child-tree-open {
      //选中后设置背景色及高度
      .ant-tree-node-content-wrapper.ant-tree-node-content-wrapper-normal.ant-tree-node-selected::before {
        height: 30px;
      }

      .ant-tree-node-content-wrapper.ant-tree-node-content-wrapper-normal.ant-tree-node-selected {
        .title {
          color: #fff;
        }
      }

      li {
        display: flex;
      }

      .ant-tree-treenode-selected {
      }

      .ant-tree-node-content-wrapper.ant-tree-node-content-wrapper-normal {
        display: flex;
        align-items: center;
      }
    }

    .title {
      color: #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .gameInfoTables {
    height: 100%;
    overflow: hidden;

    &_group {
      width: 100%;
      // height: 100%;
      overflow: auto;
    }

    &_table {
      height: 100%;
      overflow: auto;
    }
  }
}

.table_box_total {
  display: flex;
  justify-content: space-between;
}

.table_box_total_right {
  margin-right: 15px;
}

.query {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tables {
  overflow: hidden;
  max-height: 640px;

  &_top {
    margin-bottom: 20px;
    width: 100%;
    height: 340px;
  }

  &_buttom {
    height: 300px;
  }
}

.editable-row-operations {
  display: flex;
  width: 90px;
  justify-content: space-around;
  align-items: center;
}

.editable-row-operations a {
  margin-right: 8px;
  color: #1890ff;
}

.custom-context-menu {
  position: absolute;
  z-index: 1000;
  /* 确保菜单显示在其他内容之上 */
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  // display: none; /* 默认情况下不显示菜单 */
}

// .custom-context-menu.visible {
//   display: block; /* 当 contextMenuVisible 为 true 时显示菜单 */
// }
.custom-context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.custom-context-menu li {
  cursor: pointer;
  padding: 5px;
}

.custom-context-menu li:hover {
  background-color: #f5f5f5;
}

.spanGreen {
  width: 15px;
  height: 15px;
  // background: #1aef1a;
  // background: #098111;
  background: #06b712;
  border-radius: 50%;
}

.spanGRed {
  width: 15px;
  height: 15px;
  background: red;
  border-radius: 50%;
}

.btns_right {
  display: flex;
  flex: 1;
  align-items: center;

  .btns_right_left {
    flex: 0.5;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    font-size: 14px;
    font-weight: bold;
  }

  /deep/.ant-form-item {
    margin-bottom: 0;
  }
}
</style>