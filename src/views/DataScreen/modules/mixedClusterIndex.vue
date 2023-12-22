<template>
  <div class="boxMixed">
    <!-- 混团信息 -->
    <div class="mixeTeamFinals">
      <a-carousel style="width: 100%; min-height: 100%">
        <div>
          <TableListVue type="混团赛金铜牌赛" :TitleList="mixeTeamFinalsList.title" :List="mixeTeamFinalsList.List[0]" />
        </div>
      </a-carousel>
      <div class="targetImage" v-if="state.indexOf('手枪') != -1">
        <template v-for="(item) in mixeTeamFinalsList.List[0]">
          <div class="div" v-for="(e, i) in item['姓名']" :key="e">
            <div class="name">{{ e }}</div>
            <div class="flex">
              <div class="box">
                <div :class="state.indexOf('手枪') == -1 ? 'buqiang' : 'shouqiang'">
                  <EchatTarget :dots="item.list.length ? item.list[i]:[]" :state="state" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="targetImage1" v-if="state.indexOf('步枪') != -1">
        <template v-for="(item) in mixeTeamFinalsList.List[0]">
          <div class="div1" v-for="(e, i) in item['姓名']" :key="e">
            <div class="name1">{{ e }}</div>
            <div class="flex1">
              <div class="box1">
                <div :class="state.indexOf('手枪') == -1 ? 'buqiang1' : 'shouqiang1'">
                  <EchatTargetB :dots="item.list.length ? item.list[i]:[]" :state="state" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { getMixeTeamFinalsListAPI } from '@api/competition'
// 混团赛滚动成绩tabelList
import TableListVue from './../components/tableList.vue'
import EchatTarget from '../../view/targetmap/modules/EchatTarget.vue'
import EchatTargetB from '../../view/targetmap/modules/EchatTargetB.vue'
export default {
  name: 'mixedClusterIndex', //混团金牌铜牌 手枪或步枪
  components: { TableListVue, EchatTarget, EchatTargetB },
  props: {
    data: {
      type: Object,
    },
    number: {
      type: [String, Number],
    },
  },
  data() {
    return {
      // 混团金铜牌赛
      isMixeTeamFinals: false,
      mixeTeamFinalsList: {
        title: [],
        List: [[]],
        //
        timer: null,
        // 标题
        // projectName: undefined,
        // stageGroup: undefined,
        // stageName: undefined,
        state: '',
      },
    }
  },
  created() {
    this.state = this.data.configName
    this.getData()
    this.timer = setInterval(() => {
      this.getData()
    }, 3000)
  },
  methods: {
    // 混团列表
    getData() {
      getMixeTeamFinalsListAPI({
        screenName: this.state,
        stageGroup: this.state.indexOf('金牌赛') ? 1 : 2,
      }).then((res) => {
        this.mixeTeamFinalsList.List = [[]]
        this.mixeTeamFinalsList.title = [
          {
            name: '排名',
            width: '60px',
          },
          {
            name: '代表队',
          },
          {
            name: '姓名',
            width: this.number == 1 ? '' : '140px',
          },
          {
            name: '发序',
            width: this.number == 1 ? '' : '60px',
          },
          {
            name: '环数',
            width: this.number == 1 ? '' : '100px',
          },
          {
            name: '总环数',
            width: this.number == 1 ? '' : '100px',
          },
          {
            name: '总分',
            width: this.number == 1 ? '' : '100px',
          },
        ]
        let data = res.result.scoreList
        // this.projectName = data[0].projectName
        // this.stageName = data[0].stageName
        // this.stageGroup = data[0].projectGroup
        if (data && data.length != 0) {
          data.forEach((item, index) => {
            if (item.detailScoreList1) {
              item.detailScoreList1.forEach((e, i) => {
                e['x_coord'] = e.xcoord
                e['y_coord'] = e.ycoord
              })
            }
            if (item.detailScoreList2) {
              item.detailScoreList2.forEach((e, i) => {
                e['x_coord'] = e.xcoord
                e['y_coord'] = e.ycoord
              })
            }
            let obj = {
              排名: index + 1,
              代表队: item.groupName,
              姓名: [item.player2Name, item.player1Name],
              发序: item.shootCode ? item.shootCode : 0,
              环数: [
                item.player2Score ? item.player2Score.toFixed(1) : 0,
                item.player1Score ? item.player1Score.toFixed(1) : 0,
              ],
              // 环数: [(Math.random() * 10).toFixed(1), (Math.random() * 10).toFixed(1)],
              总环数: item.stageTotal.toFixed(1),
              总分: item.total.toFixed(0),
              list: [item.detailScoreList2, item.detailScoreList1],
            }
            this.mixeTeamFinalsList.List[0].push(obj)
          })
        } else {
          this.mixeTeamFinalsList.List = [[]]
        }
      })
    },
  },
  destroyed() {
    clearInterval(this.timer)
    // clearInterval(this.next)
  },
}
</script>

<style lang="less" scoped>
.boxMixed {
  width: 100%;
  height: 100%;
}
.targetImage {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 494px;
  .div {
    position: relative;
    flex: 0 0 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .name {
    position: absolute;
    left: 10%;
    top: 0;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
  }
  .flex {
    // flex: 0 0 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    // width:25%;
    width: 244px;
    height: 244px;
    overflow: hidden;
    border-radius: 50%;

    .box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1000px;
      height: 1000px;

      .shouqiang {
        width: 282px;
        height: 282px;
      }

      .buqiang {
        width: 2000px;
        height: 2000px;
      }
    }
  }
}

.targetImage1 {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 494px;
  .div1 {
    position: relative;
    flex: 0 0 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .name1 {
    position: absolute;
    left: 10%;
    top: 0;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
  }
  .flex1 {
    // flex: 0 0 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    // width: 25%;
    width: 244px;
    height: 244px;
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
        width: 845px;
        height: 845px;
      }
    }
  }
}
.head {
  height: 10%;
  font-size: 24px;
  font-weight: 800;

  .top {
    display: flex;
    align-items: start;
    justify-content: space-between;

    .left {
      display: flex;
    }

    .right {
      .nameTitle {
        display: flex;
      }

      .times {
        letter-spacing: 6px;
      }
    }
  }

  // .bottom {
  //   margin-top: 10px;
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  // }
}

.mixeTeamFinals {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>