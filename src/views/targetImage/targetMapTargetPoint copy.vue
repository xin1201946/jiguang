<template>
  <div class="targetMapbox">
    <div class="btns">
      <a-select :placeholder="list.length && '请选择赛事' || '请先创建赛事'" style="width: 300px" v-model="contestId"
        @change="handleContest">
        <a-select-option v-for="(item, i) in list" :key="i" :value="item.contestId">{{ item.contestName
          }}</a-select-option>
      </a-select>
    </div>
    <div class="cards">
      <TreeCard ref="treeCard">
        <!-- 左侧树 -->
        <template slot="tree">
          <a-directory-tree multiple default-expand-all @select="onSelect" @expand="onExpand">
            <a-tree-node v-for="item in treeList" :key="item.projectId + item.projectGroup"
              :title="item.projectName + ' - ' + item.projectGroup">
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
        <!-- 右侧 内容 -->
        <div class="right_cont">
          <div class="gameInfoTables_group" v-if="groupList.length">
            运动员组：
            <a-button type="primary">{{ stageGroups }}</a-button>
            <!-- <a-tabs class="tabsC" v-model="group" @change="radioChangeHandle">
              <a-tab-pane v-for="item in groupList" :value="item.group" :key="item.group"
                :tab="`${numToCapital(item.group)}组`"></a-tab-pane>
            </a-tabs> -->
          </div>
          <div class="gameInfoTables_group" v-if="groupList.length">
            弹药组别：
            <a-tabs class="tabsC" v-model="group" @change="radioChangeHandle">
              <a-tab-pane v-for="item in groupList" :value="item" :key="item" :tab="item"></a-tab-pane>
            </a-tabs>
          </div>
        </div>
        <!-- 靶图 -->
        <div class="contScores">
          <div class="contBox" v-for="(item, index) in targetGoupList" :key="index">
            <div class="cont_box_top">
              <span class="cont_box_top_span">女子10米激光手枪-资格赛</span>
              <span class="cont_span">{{ item.playerName }}</span>
              <span class="cont_box_top_span cont_span">总环数：{{ item.totalScore }}</span>
              <!-- <a>总详情</a> -->
            </div>
            <div class="cont_box_bottom">
              <div class="svgimges">
                <img src="../../assets/350.jpg" alt="">
              </div>
              <div>
                <a-table :columns="columns" :data-source="item.playerScores" :pagination="false"
                  :scroll="{ x: 160, y: 200 }"></a-table>
                <div class="cont_bot_div">
                  <span class="cont_bot_div_span">组数：4</span>
                  <span class="cont_bot_div_span" style="border-left: solid 2px #fff;">总组数：6</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </TreeCard>
    </div>
  </div>
</template>

<script>
import Card from '@comp/card/card.vue'
import TreeCard from '@comp/card/TreeCard.vue'
import { numToCapital, infoMessage, deleteMessage } from '@/utils'
import {
  bizContestList,
  bizContestPlayerList,
  bizContestProjectList,
  bizContestProjectStageList,
  processGetStageGroups,
  processGetPlayerTargetScores,
  getStagePlayerGroup,
  bizPlayerFinalScoreSportsList, bizPlayerFinalScoreSportsListGroup,
  bizPlayerFinalScoreSportsScoresList, bizPlayerFinalScoreSportsScoresListGroup
} from '@api/competition'
export default {
  name: 'targetMapTargetPoint', //靶图靶点
  components: {
    Card, TreeCard
  },
  data() {
    return {
      // 运动员组别
      groupList: [],
      stageGroups: '', //当前组
      group: null,
      //赛事名字列表
      contestId: "",
      list: [],
      // 项目列表
      treeList: [],
      loading: false,
      cproStageId: undefined,
      draw: false,
      stageName: '',
      isAdjustment: '',
      cproId: '',
      projectName: '',
      status: '',
      targetGoupList: [],
      dataSource: [],
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          // width: 60,
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          dataIndex: 'score',
          title: '整环',
          align: 'center',
        },
        {
          dataIndex: 'score1',
          title: '小数环',
          align: 'center',
        },
      ],
    }
  },
  mounted() {
    this.getTreeList()
  },
  methods: {
    numToCapital,
    // 获取比赛信息
    getTreeList() {
      bizContestList({}).then(res => {
        this.list = res.result
        this.contestId = res.result[0].contestId
        // this.pagination.current = 1
        // 通过比赛获取左侧项目
        this.getProjectList()
      })
    },
    // 修改赛事
    handleContest() {
      // if (this.$refs.query) {
      this.getProjectList()
      // }
    },
    // 获取项目
    getProjectList() {
      bizContestProjectList({
        contestId: this.contestId,
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
        this.getTableList()
      } else {
        this.cproStageId = null
        this.draw = false
        this.group = null
        this.groupActive = false
        this.$refs.treeCard.loading = false
      }
    },
    onExpand() { },
    /**
     * 获取table数据
     */
    getTableList() {
      processGetStageGroups({ stageId: this.cproStageId }).then((res) => {
        if (res.success) {
          this.groupList = res.result.scoreGroups
          this.group = res.result.scoreGroups[0]
          this.stageGroups = res.result.stageGroups
          this.handleProcessTargetScores()
        } else {
          this.$message.error(res.message)
        }
      })
      // this.loading = true
      // getStagePlayerGroup({
      //   contestId: this.contestId, //赛事id
      //   cproId: this.cproId, //赛事项目id
      //   stageId:this.cproStageId, //项目阶段id
      // })
      //   .then((res) => {
      //     if (res.success) {
      //       if (res.result[0].group === -1) {
      //         this.group = null
      //         this.groupList = []
      //         this.groupActive = false
      //         this.status = ''
      //         this.dataSource = res.result[0].bizContestPlayerList.map((item, i) => ({
      //           ...item,
      //           i,
      //         }))
      //       } else {
      //         if (!this.group) {
      //           this.group = res.result[0].group
      //           this.status = res.result[0].status
      //           this.groupList = res.result
      //           this.groupActive = true
      //           this.radioChangeHandle(res.result[0].group)
      //         } else {
      //           this.status = res.result[0].status
      //           this.groupList = res.result
      //           this.groupActive = true
      //           this.radioChangeHandle(this.group)
      //         }
      //       }
      //     } else {
      //       this.$message.error(res.message)
      //     }
      //   })
      //   .finally(() => {
      //     this.loading = false
      this.$refs.treeCard.loading = false
      //   })
    },
    /**
     * 选择组别
    */
    radioChangeHandle() {
    },
    // 详情
    handleProcessTargetScores() {
      const adat = {
        stageId: this.cproStageId,
        stageGroup: this.stageGroups,
        scoreGroup: this.group,
      }
      processGetPlayerTargetScores(adat).then((res) => {
        if (res.success) {
          console.log(res, '23423')
          this.targetGoupList = res.result
        } else {
          this.$message.error(res.message)
        }
      })
    },
  },

}
</script>

<style scoped lang="less">
.targetMapbox {
  width: 100%;
  height: 100%;
  overflow-y: hidden;

  .btns {
    height: 50px;
    background: #fff;
    margin-bottom: 10px;
    line-height: 50px;
    overflow: hidden;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    justify-content: space-between;

    /deep/.ant-page-header-heading {
      display: flex;
      align-items: center;
    }
  }

  .cards {
    position: relative;
    height: calc(100% - 50px - 10px);

    /deep/.ant-tree-child-tree.ant-tree-child-tree-open {
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

      .ant-tree-treenode-selected {}

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

    .right_cont {
      .gameInfoTables_group {
        display: flex;
        align-items: center;

        .tabsC {
          flex: 1;
        }
      }
    }

    .contScores {
      display: flex;
      flex-wrap: wrap;
      padding: 10px;

      .contBox {
        height: 320px;
        // overflow: auto;
        // flex: 1;
        font-size: 14px;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 0 10px #5f5f5f;
        padding: 10px;
        margin: 8px;

        .cont_box_top {
          height: 30px;
          line-height: 30px;
          background: #baccfa;
          margin-bottom: 5px;

          .cont_box_top_span {
            padding: 0 15px;
          }

          .cont_span {
            font-weight: bold;
          }
        }

        .cont_box_bottom {
          display: flex;
          justify-content: space-between;

          .svgimges {
            width: 220px;
            height: 250px;
            padding: 0 5px 0 0;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .cont_bot_div {
            width: 100%;
            display: flex;

            .cont_bot_div_span {
              flex: 1;
              background: #1890FF;
              padding: 5px 5px;
              color: #fff;
              border-radius: 2px;
            }
          }

        }
      }
    }
  }
}

/deep/.ant-card-body {
  padding: 5px 24px;
}

/deep/.ant-table-tbody .ant-table-row td {
  padding: 5px 0;
}

/deep/.ant-table-thead>tr>th {
  padding: 0;
}
</style>