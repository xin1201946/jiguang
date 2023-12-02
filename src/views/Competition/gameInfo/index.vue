<template>
  <div class="gameInfo">
    <div class="btns">
      <a-page-header @back="handleBack" :title="data.contestName"></a-page-header>
    </div>
    <div class="cards">
      <TreeCard>
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
            <a-button type="primary" @click="handleGroup">分组</a-button>
            <a-button v-if="group !== null" type="primary" @click="handleDraw">抽签</a-button>
            <a-button v-if="group !== null" type="primary" @click="pushPadHandle">推送平板</a-button>
            <a-button v-if="group !== null" type="primary" @click="nextStageHandle">下一阶段</a-button>
            <!--            选中组别-->
            <!-- <a-button v-show="group !== null && draw" type="primary">推送大屏</a-button> -->
            <a-button type="primary" @click="getTableList">刷新</a-button>
          </a-space>
        </template>
        <div class="gameInfoTables" v-show="groupActive">
          <div class="gameInfoTables_group">
            <!-- <a-radio-group v-model="group" @change="radioChangeHandle">
              <a-radio-button >{{ numToCapital(item.group) }}组</a-radio-button>
            </a-radio-group> -->
            <a-tabs v-model="group" @change="radioChangeHandle">
              <a-tab-pane v-for="item in groupList" :value="item.group" :key="item.group" :tab="`${numToCapital(item.group)}组`"></a-tab-pane>
            </a-tabs>
          </div>
          <div class="gameInfoTables_table">
            <a-space style="margin-bottom: 20px;">
              <a-button @click.stop="handleZhunbei(i)">准备</a-button>
              <a-button @click.stop="handleShishe(i)">试射</a-button>
              <a-button @click.stop="handleBisai(i)">开始</a-button>
              <a-button @click.stop="handleEnd(i)">结束</a-button>
            </a-space>
            <a-table bordered rowKey="i" :pagination="false" :columns="columns" :dataSource="dataSource" :loading="loading">
              <template slot="operation" slot-scope="text, record, index">
                <a-space>
                  <!--                  总环数为空不渲染成绩详情按钮-->
                  <a-button v-show="record.totalScore" type="primary" size="small" ghost icon="profile" @click="handleInfo(record)">成绩详情</a-button>
                  <a-button type="danger" size="small" ghost icon="stop" @click="handleStop(record)">停止比赛</a-button>
                </a-space>
              </template>
            </a-table>
          </div>
        </div>
        <!-- :dataSource="dataSource" -->
        <a-table bordered v-if="!groupActive" rowKey="playerId" :columns="columns" :dataSource="dataSource"></a-table>
        <gameInfoDrawModal ref="draw" @list="drawListHandle"></gameInfoDrawModal>
        <gameInfoTargetModal></gameInfoTargetModal>
        <GameInfoGroupModal ref="group" @delSuccess="getTableList"></GameInfoGroupModal>
      </TreeCard>
    </div>
  </div>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import { gameInfoColumns, gameInfoQuery } from '@views/Competition/gameInfo/gameInfo.config'
import gameInfoTargetModal from '@views/Competition/gameInfo/modal/gameInfoTargetModal.vue'
import gameInfoDrawModal from '@views/Competition/gameInfo/modal/gameInfoDrawModal.vue'
import GameInfoGroupModal from '@views/Competition/gameInfo/modal/gameInfoGroupModal.vue'
import TreeCard from '@comp/card/TreeCard.vue'
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
  getScoresByFinalScoreId,
  stopPlayer,
  delPlayerShootScore,
} from '@api/competition'
import { numToCapital, infoMessage } from '@/utils'
import BizMixins from '@views/biz/bizMixins'

export default {
  name: 'gameInfo',
  components: {
    TreeCard,
    Card,
    QuerySearch,
    gameInfoTargetModal,
    gameInfoDrawModal,
    GameInfoGroupModal,
  },
  inject: ['closeCurrent'],
  data() {
    return {
      treeList: [],
      cproStageId: null,
      cproId: null,
      columns: gameInfoColumns,
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
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
      },
    }
  },
  methods: {
    handleTableChange (pagination) {
      this.pagination = pagination
      // this.getList()
    },
    handleInfo(record) {
      this.$refs.group.edit({ ...record, stageId: this.cproStageId })
    },
    numToCapital,
    /**
     * 停止比赛
     */
    handleStop(row) {
      console.log(row)
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
      propePlayerSiteToPad({
        contestId: this.data.contestId, //赛事id
        cproId: this.cproId, //赛事项目id
        stageId: this.cproStageId, //项目阶段id
        group: this.group,
      }).then((res) => {
        if (res.success) {
          this.$message.success('推送成功！')
        } else {
          this.$message.error(res.message)
        }
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
        // console.log(res)
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
      })
        .then((res) => {
          if (res.result[0].group === -1) {
            this.group = null
            this.groupList = []
            this.groupActive = false
            this.dataSource = res.result[0].bizContestPlayerList.map((item, i) => ({
              ...item,
              i,
            }))
          } else {
            if (!this.group) {
              this.group = res.result[0].group
            }
            this.groupList = res.result
            this.groupActive = true
            this.radioChangeHandle(res.result[0].group)
          }
          // console.log(res)
        })
        .finally(() => {
          this.loading = false
        })
    },
    /**
     * 选择组别
     */
    radioChangeHandle(e) {
      this.group = e
      this.groupList.forEach((item) => {
        if (item.group == this.group) {
          this.dataSource = item.bizContestPlayerList.map((item, i) => ({
            ...item,
            i,
          }))
        }
      })
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
      this.$refs.draw.init()
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
            this.groupActive = true
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
        this.cproId = result[0].cproId
        this.getTableList()
      } else {
        this.cproStageId = null
        this.draw = false
        this.group = null
        this.groupActive = false
      }
    },
    onExpand() {},
    handleZhunbei(row) {
      // console.log('zhunbei')
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
      // console.log('@!#@!!@#@!')
      fireAdjust({
        stageId: this.cproStageId, //项目阶段id
        group: this.group,
      }).then((res) => {
        if (res.success) {
          this.$message.success('操作成功！')
        } else {
          this.$message.error(res.message)
        }
      })
      console.log('shishe')
    },
    handleBisai(row) {
      // console.log('bisai')
      startFire({
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
        // console.log(res)
        if (res.success) {
          this.$message.success('抽签成功！')
          this.getTableList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    groupListHandle() {},
  },
  mounted() {
    this.data = JSON.parse(decodeURI(this.$route.query.row))
    this.getProjectList()
  },
}
</script>

<style scoped lang="less">
@btnHeight: 50px;
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
    height: calc(100% - @btnHeight - 10px);
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
      width: 300px;
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
</style>