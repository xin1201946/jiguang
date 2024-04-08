<template>
  <BizModal :title="title" :visible="visible" @cancel="handleCancel" :loading="loadingModal" :footer="false"
    widths="90%">
    <div class="targetMapbox">
      <div class="cards">
        <Card>
          <!-- 内容 -->
          <div class="right_cont">
            <div class="gameInfoTables_group" v-if="getstageList.length">
              运动员组：
              <a-tabs class="tabsC" v-model="stageGroups" @change="radioChangeHandle1">
                <a-tab-pane v-for="item in getstageList" :value="item.stageGroups" :key="item.stageGroups"
                  :tab="`${numToCapital(item.stageGroups)}组`"></a-tab-pane>
              </a-tabs>
              <!-- <a-button type="primary">{{ stageGroups }}</a-button> -->
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
                <!-- <span class="cont_box_top_span">{{ nameTitle }}</span>   比赛标题 -->
                <span class="cont_span cont_box_top_span">{{ item.playerName }}</span>
                <span class="cont_box_top_span cont_span">靶位：{{ item.target }}</span>
                <span class="cont_box_top_span cont_span">总环数：{{ item.totalScore }}</span>
                <!-- <a>总详情</a> -->
              </div>
              <div class="cont_box_bottom">
                <!-- 手枪 -->
                <div class="targetImage" v-if="state.indexOf('手枪') != -1">
                  <div class="flex">
                    <div class="box">
                      <div :class="state.indexOf('手枪') == -1 ? 'buqiang' : 'shouqiang'">
                        <EchatTarget :dots="item.playerScores" :state="state" />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 步枪 -->
                <div class="targetImage1" v-if="state.indexOf('步枪') != -1">
                  <div class="flex1">
                    <div class="box1">
                      <div :class="state.indexOf('手枪') == -1 ? 'buqiang1' : 'shouqiang1'">
                        <EchatTargetB :dots="item.playerScores" :state="state" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cont_right_cont">
                  <a-table :columns="columns" :data-source="item.playerScores" :loading="loading" :pagination="false"
                    :scroll="{ x: 200, y: 240 }"></a-table>
                  <!-- <div class="cont_bot_div">
                    <span class="cont_bot_div_span">组数：4</span>
                    <span class="cont_bot_div_span" style="border-left: solid 2px #fff;">总组数：6</span>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </BizModal>
</template>

<script>
import Card from '@comp/card/card.vue'
import TreeCard from '@comp/card/TreeCard.vue'
import { numToCapital, infoMessage, deleteMessage } from '@/utils'
// 靶图
import EchatTarget from '../view/targetmap/modules/EchatTarget.vue'
import EchatTargetB from '../view/targetmap/modules/EchatTargetB.vue'
import {
  processGetStageGroups,
  processGetPlayerTargetScores,
} from '@api/competition'
import BizModal from '@comp/modal/BizModal.vue'
export default {
  name: 'targetMapTargetPoint', //靶图靶点
  components: {
    Card,
    TreeCard,
    BizModal,
    EchatTarget,
    EchatTargetB,
  },
  data() {
    return {
      title: '靶图靶点',
      visible: false,
      loadingModal: false,
      loading: false,
      stageName: '',
      cproId: '',
      projectName: '',
      groupList: [],
      stageGroups: '', //当前组
      getstageList: [],
      group: null,
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
      nameTitle: '',
      state: '',
    }
  },
  mounted() {

  },
  methods: {
    numToCapital,
    // 获取比赛信息
    eidt(record) {
      this.visible = true
      this.stageId = record.stageId
      this.loadingModal = false
      this.$nextTick(() => {
        setTimeout(() => [
          this.getTableList()
        ])
      })
    },
    /**
     * 获取table数据
     */
    getTableList() {
      this.getstageList = []
      processGetStageGroups({ stageId: this.stageId }).then((res) => {
        // processGetStageGroups({ stageId: '45' }).then((res) => {
        if (res.success) {
          this.groupList = res.result.scoreGroups
          if (this.groupList.length) {
            this.group = this.groupList[0]
          }
          let arrs = res.result.stageGroups
          let resultArray = []
          if (arrs >= 1) {
            for (let i = 1; i <= arrs; i++) {
              resultArray.push({ stageGroups: i })
            }
          }
          this.getstageList = [...resultArray]
          this.$nextTick(() => {
            this.stageGroups = this.getstageList[0].stageGroups
            this.handleProcessTargetScores()
          })
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 选择组别
    */
    radioChangeHandle1(event) {
      this.stageGroups = event
      this.handleProcessTargetScores()
    },
    radioChangeHandle(e) {
      this.group = e
      this.handleProcessTargetScores()
    },
    // 详情
    handleProcessTargetScores() {
      this.loading = true
      const adat = {
        // stageId: '45',
        stageId: this.stageId,
        stageGroup: this.stageGroups,
        scoreGroup: this.group,
      }
      processGetPlayerTargetScores(adat).then((res) => {
        if (res.success) {
          console.log(res, '23423')
          // this.targetGoupList = res.result
          let dataARR = res.result
          dataARR.forEach((item, index) => {
            if (item.playerScores) {
              item.playerScores.forEach((e, i) => {
                e['x_coord'] = e.xcoord
                e['y_coord'] = e.ycoord
              })
            }
          })
          this.targetGoupList = dataARR
          if (this.targetGoupList) {
            let a = this.targetGoupList[0].playerScores
            this.nameTitle = `${a[0].projectName}-${a[0].projectGroup}-${a[0].stageName}`
            this.state = a[0].projectName
            console.log(this.state)
          }
          this.loading = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 关闭
    handleCancel() {
      this.visible = false
    },
  },

}
</script>

<style scoped lang="less">
.targetMapbox {
  width: 100%;
  height: 100%;
  overflow-y: hidden;

  .cards {
    position: relative;
    height: 100%;

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
      overflow: auto;
      height: 70vh;

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
          // width: 400px;
          height: 30px;
          line-height: 30px;
          background: #baccfa;
          margin-bottom: 5px;

          .cont_box_top_span {
            padding: 0 10px;
          }

          .cont_span {
            font-weight: bold;
          }
        }

        .cont_box_bottom {
          display: flex;
          justify-content: space-between;

          .cont_right_cont {
            padding: 0 0 0 10px;
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

/deep/.ant-drawer-body {
  height: initial;
  padding: 5px 24px;
}

.targetImage {
  // position: absolute;
  // left: 0;
  // bottom: 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 500px;

  .div {
    position: relative;
    flex: 0 0 25%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .name {
    position: absolute;
    left: 5%;
    top: 0;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
  }

  .flex {
    // flex: 0 0 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    // width: 25%;
    width: 250px;
    height: 250px;
    overflow: hidden;
    border-radius: 50%;

    .box {
      display: flex;
      align-items: center;
      justify-content: center;

      .shouqiang {
        width: 285px;
        height: 285px;
      }
    }
  }
}

.targetImage1 {
  // position: absolute;
  // left: 0;
  // bottom: 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 500px;

  .div1 {
    position: relative;
    flex: 0 0 25%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .name1 {
    position: absolute;
    left: 5%;
    top: 0;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
  }

  .flex1 {
    // flex: 0 0 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    // width: 25%;
    width: 260px;
    height: 260px;
    overflow: hidden;
    border-radius: 50%;

    .box1 {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2000px;
      height: 2000px;

      .shouqiang1 {
        width: 1000px;
        height: 1000px;
      }

      .buqiang1 {
        width: 860px;
        height: 860px;
      }
    }
  }
}
</style>