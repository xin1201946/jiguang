<template>
  <dv-border-box-8 :dur="20" class="DataScreen container">
    <div class="head">
      <div class='top'>
        <div>
          <div class="left">
            <img class="logo" src="../../assets/logo1.png" alt="" />
            <div>
              <!-- {{ data.configName }} -->
              {{ stageName }}-{{ projectName }}-{{ stageGroup }}
            </div>
          </div>
          <!-- <div>{{ logoTitle }}</div> -->
        </div>
        <div class='right'>
          <div>
            <div class="nameTitle">
              <div>{{ '1208青少年射击比赛' }}</div>
              <div style="margin-left: 15px;">{{ "保定市星光酒店" }}</div>
            </div>
            <div class="times">2023-12-14 09:06</div>
          </div>
        </div>
      </div>
      <!-- <div class='bottom'>
        <div>{{ logoTitle }}</div>
        <div>时间：2023-12-14</div>
      </div> -->
    </div>
    <!-- 个人赛 -->
    <div class="box_box" v-if="data.configName.indexOf('个人资格赛') != -1 || data.configName.indexOf('个人决赛') != -1">
      <!--    表头-->
      <div class='th'>
        <div v-for='(item, i) in th' :key='i'
          :style="`width:${item.width};flex:${item.width ? 'none' : '1'};text-align:${item.align ? item.align : 'center'}`">
          {{ item.name }}
        </div>
      </div>
      <div style="width: 100%;height: 100%;" v-if="fiftyRounds === '0' && logoTitle.indexOf('个人资格赛') != -1">
        <!--    整页的滚动-->
        <div class="foots" ref="scorllBox">
          <div class="footContent" ref="scorllArr">
            <div v-for="(item, i) in listsList" :key="i" class="finalEightRow">
              <div style="width: 80px">{{ item.rank }}</div>
              <div style="width: 80px">{{ item.targetSite }}</div>
              <div style="width: 140px">{{ item.playerName }}</div>
              <div style="flex: 1;text-align: left;">{{ item.groupName }}</div>
              <div v-for="k in shootGroups" :key="k" style="width: 80px;">
                {{ item.groupList[k - 1] && item.groupList[k - 1].groupTotal }}
              </div>
              <div style="width: 150px;">{{ item.total }}</div>
              <div style="flex: 1;">{{ item.remarkPenalty }}</div>
              <div style="width: 60px">{{ item.bePromoted }}</div>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 100%;height: 100%;" v-if="fiftyRounds != '0' && logoTitle.indexOf('个人资格赛') != -1">
        <!--    前8位-->
        <div class='finalEight'>
          <div v-for="(item, i) in finalEight" :key="i" class="finalEightRow">
            <div style="width: 80px">{{ item.rank }}</div>
            <div style="width: 80px">{{ item.targetSite }}</div>
            <div style="width: 140px">{{ item.playerName }}</div>
            <div style="flex: 1;text-align: left;">{{ item.groupName }}</div>
            <div v-for="k in shootGroups" :key="k" style="width: 80px;">
              {{ item.groupList[k - 1] && item.groupList[k - 1].groupTotal }}
            </div>
            <div style="width: 150px;">{{ item.total }}</div>
            <div style="flex: 1;">{{ item.remarkPenalty }}</div>
            <div style="width: 60px">{{ item.bePromoted }}</div>
          </div>
        </div>
        <!-- 后半页滚动 -->
        <div class="foot" ref="scorllBox">
          <div class="footContent" ref="scorllArr">
            <div v-for="(item, i) in list" :key="i" class="finalEightRow">
              <div style="width: 80px">{{ item.rank }}</div>
              <div style="width: 80px">{{ item.targetSite }}</div>
              <div style="width: 140px">{{ item.playerName }}</div>
              <div style="flex: 1;text-align: left;">{{ item.groupName }}</div>
              <div v-for="k in shootGroups" :key="k" style="width: 80px;">
                {{ item.groupList[k - 1] && item.groupList[k - 1].groupTotal }}
              </div>
              <div style="width: 150px;">{{ item.total }}</div>
              <div style="flex: 1;">{{ item.remarkPenalty }}</div>
              <div style="width: 60px">{{ item.bePromoted }}</div>
            </div>
          </div>
        </div>
      </div>

      <div style="width: 100%;height: 100%;" v-if="logoTitle.indexOf('个人决赛') != -1">
        <!--    前8位-->
        <div class='finalEight'>
          <div v-for="(item, i) in finalEight" :key="i" class="finalEightRow">
            <div style="width: 80px">{{ item.rank }}</div>
            <div style="width: 80px">{{ item.targetSite }}</div>
            <div style="width: 140px">{{ item.playerName }}</div>
            <div style="flex: 1;text-align: left;">{{ item.groupName }}</div>
            <div v-for="k in item.groupList" :key="k.id" style="width: 80px;">
              {{ k.groupTotal }}
            </div>
            <div style="width: 150px;">{{ item.total }}</div>
            <div style="flex: 1;">{{ item.remarkPenalty }}</div>
            <div style="width: 60px">{{ item.bePromoted }}</div>
          </div>
        </div>
        <div class="targetImage">
          <div class="flex" v-for="(item) in finalEight" :key="item.targetSite">
            <div class="box">
              <div class="name">{{ item.playerName }}</div>
              <div :class="logoTitle.indexOf('手枪') != -1 ? 'buqiang' : 'shouqiang'">
                <EchatTarget :dots="item.playerScores" :state="logoTitle" />
              </div>
            </div>
          </div>
        </div>
        <!-- 后半页滚动 -->
        <!-- <div class="foot" ref="scorllBox">
          <div class="footContent" ref="scorllArr">
            <div v-for="(item, i) in list" :key="i" class="finalEightRow">
              <div style="width: 80px">{{ item.rank }}</div>
              <div style="width: 80px">{{ item.targetSite }}</div>
              <div style="width: 100px">{{ item.playerName }}</div>
              <div style="flex: 1;text-align: left;">{{ item.groupName }}</div>
              <div v-for="k in shootGroups" :key="k" style="width: 80px;">
                {{ item.groupList[k - 1] && item.groupList[k - 1].groupTotal }}
              </div>
              <div style="width: 150px;">{{ item.total }}</div>
              <div style="flex: 1;">{{ item.notes }}</div>
              <div style="width: 60px">{{ item.bePromoted }}</div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <!-- 混团赛 -->
    <div class="box_box"
      v-if="data.configName === '手枪混团铜牌赛排名' || data.configName === '手枪混团金牌赛排名' || data.configName === '步枪混团金牌赛排名' || data.configName === '步枪混团铜牌赛排名'">
      <mixedClusterIndex></mixedClusterIndex>
    </div>
    <!-- 团队赛 -->
    <div class="box_box" v-if="data.configName.indexOf('团体排名') != -1">
      <!--    表头-->
      <div class='th'>
        <div v-for='(item, i) in th' :key='i'
          :style="`width:${item.width};flex:${item.width ? 'none' : '1'};text-align:${item.align ? item.align : 'center'}`">
          {{ item.name }}
        </div>
      </div>
      <div style="width: 100%;height: 100%;">
        <!--    整页的滚动-->
        <div class="foots" ref="scorllBox">
          <div class="footContent" ref="scorllArr">
            <div v-for="(item, i) in listsList" :key="i" class="finalEightRow">
              <div style="width: 80px">{{ item.rank }}</div>
              <div style="width: 300px;text-align: left;">{{ item.groupName }}</div>
              <div style="width: 140px">{{ item.playerName }}</div>
              <div v-for="k in item.groupList" :key="k.id" style="width: 80px;">
                {{ k.groupTotal }}
              </div>
              <div style="width: 150px;">{{ item.stageTotal }}</div>
              <div style="width: 150px;">{{ item.total }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 排名 -->
    <div class="box_box" v-if="data.configName === '团队综合排名'">
      <div class="head">
        <div class='top'>
          <div>
            <div class="left">
              <img class="logo" src="../../assets/logo1.png" alt="" />
              <div>
                {{ data.configName }}
                <!-- {{ stageName }}-{{ projectName }}-{{ stageGroup }} -->
              </div>
            </div>
            <!-- <div>{{ logoTitle }}</div> -->
          </div>
          <div class='right'>
            <div>
              <div class="nameTitle">
                <!-- <div>{{ '1208青少年射击比赛' }}</div> -->
                <!-- <div style="margin-left: 15px;">{{ "保定市星光酒店" }}</div> -->
              </div>
              <!-- <div class="times">2023-12-14 09:06</div> -->
            </div>
          </div>
        </div>
        <!-- <div class='bottom'>
        <div>{{ logoTitle }}</div>
        <div>时间：2023-12-14</div>
      </div> -->
      </div>
      <RankingList :data="rankingList" />
    </div>
  </dv-border-box-8>
</template>

<script>
import { getMixeTeamFinalsListAPI, getTeamScoresAPI, getTeamTotalScores, littleScreen } from '@api/competition'
import Display from '@views/control/display/index.vue'
import mixedClusterIndex from './modules/mixedClusterIndex.vue'
// 靶图
import EchatTarget from '../view/targetmap/modules/EchatTarget.vue'
import RankingList from './components/rankingList.vue'
export default {
  name: 'dataScreen',
  components: { Display, mixedClusterIndex, EchatTarget, RankingList },
  data() {
    return {
      title: '',
      data: JSON.parse(window.name),
      time: null,

      th: [],
      // 几组
      shootGroups: 0,
      // 前8实时数据
      finalEight: [],
      // 除了前8名的实时数据
      list: [],
      // 旧数据
      oldList: [],
      listsList: [],
      // 高度
      hei: 0,
      // 动画定时器
      animate: undefined,
      projectName: '',
      stageGroup: '',
      stageName: '',

      teamList: [],
      rankingList: [],
      fiftyRounds: '0',
    }
  },
  computed: {
    logoTitle() {
      const data = JSON.parse(window.name)
      const configName = data.configName
      return configName
      // if (configName.includes('个人资格赛')) {
      //   return '个人成绩'
      // }
    },
  },
  mounted() {
    this.getList()
    this.time = setInterval(() => {
      this.getData()
    }, 3000)
  },
  methods: {
    // 向上滚动
    upload() {
      const box = this.$refs.scorllBox
      const arr = this.$refs.scorllArr
      const arr2 = document.createElement('div')
      arr2.innerHTML = arr.innerHTML
      const thit = this
      function scrolls() {
        box.scrollTop = thit.hei
        if (box.scrollTop > arr.offsetHeight) {
          thit.hei = 0
        } else {
          // 移动速度
          thit.hei += 0.3
        }
        thit.animate = window.requestAnimationFrame(scrolls)
      }
      if (arr.offsetHeight > box.offsetHeight) {
        if (box.children.length < 2) {
          box.appendChild(arr2)
        } else {
          box.children[1].innerHTML = arr.innerHTML
        }
        if (this.animate === undefined) {
          scrolls()
        }
      } else {
        box.scrollTop = 0
        if (box.children[1]) {
          box.removeChild(box.children[1])
        }
        window.cancelAnimationFrame(this.animation)
        this.animation = undefined
      }
    },
    // 个人资格赛
    geren(old) {
      littleScreen({
        type: this.data.configName,
      }).then((res) => {
        const { result } = res
        this.projectName = result.projectName
        this.stageGroup = result.stageGroup
        this.stageName = result.stageName
        // 设置表头
        this.th = [
          {
            name: '排名',
            width: '80px',
          },
          {
            name: '靶位',
            width: '80px',
          },
          {
            name: '姓名',
            width: '140px',
          },
          {
            name: '代表队',
            align: 'left',
          },
        ]
        if (result.shootGroups) {
          this.shootGroups = result.shootGroups
          for (let i = 0; i < result.shootGroups; i++) {
            this.th.push({
              name: `${i + 1}0`,
              width: '80px',
            })
          }
        }
        this.th.push({ name: '总环数', width: '150px' }, { name: '备注' }, { name: '-', width: '60px' })
        if (old === 'old') {
          this.oldList = result.players
        }
        // 判断到没有到50发
        result.players.map((item) => {
          item.groupList.map((it, i) => {
            // console.log(it, i, '123', it.groupTotal, it.groupCount === 5 && it.groupTotal != '0')
            if (it.groupCount === 5 && it.groupTotal != '0') {
              this.fiftyRounds = it.groupTotal
              // 设置前8名
              this.finalEight = result.players
                .filter((item) => item.rank <= 8)
                .map((item, i) => {
                  return {
                    ...item,
                    total: result.isGood === '是' ? `${item.totalScore}-${item.good}x` : item.totalScore,
                    notes: '---',
                    bePromoted: 'Q',
                  }
                })
              // 除了前8名
              this.list = result.players
                .filter((item) => item.rank > 8)
                .map((item) => {
                  return {
                    ...item,
                    total: result.isGood === '是' ? `${item.totalScore}-${item.good}x` : item.totalScore,
                    notes: '---',
                    bePromoted: '',
                  }
                })
            } else {
              this.listsList = result.players.map((item) => {
                return {
                  ...item,
                  total: result.isGood === '是' ? `${item.totalScore}-${item.good}x` : item.totalScore,
                  notes: '---',
                  bePromoted: '',
                }
              })
            }
          })
        })
        this.$nextTick(() => {
          this.upload()
        })
      })
    },
    // 个人决赛
    gerenjuesaii(old) {
      littleScreen({
        type: this.data.configName,
      }).then((res) => {
        this.finalEight = []
        const { result } = res
        this.projectName = result.projectName
        this.stageGroup = result.stageGroup
        this.stageName = result.stageName
        this.th = [
          {
            name: '排名',
            width: '80px',
          },
          {
            name: '靶位',
            width: '80px',
          },
          {
            name: '姓名',
            width: '140px',
          },
          {
            name: '代表队',
            align: 'left',
          },
        ]
        if (result.shoots) {
          result.shoots.forEach((item) => {
            this.th.push({
              name: item,
              width: '80px',
            })
          })
        }
        this.th.push({ name: '总环数', width: '150px' }, { name: '备注' }, { name: '-', width: '60px' })
        if (result.players && result.players.length != 0) {
          result.players.forEach((item, index) => {
            let obj = {
              ...item,
              total: result.isGood === '是' ? `${item.totalScore}-${item.good}x` : item.totalScore,
              notes: '---',
              bePromoted: '',
            }
            item.groupList.forEach((e, v) => {
              obj[e.groupCount] = e.groupTotal
            })
            this.finalEight.push(obj)
          })
        } else {
          this.finalEight = []
        }
        console.log(this.finalEight)
      })
    },
    // 团体赛
    tuanti() {
      getTeamScoresAPI({
        screenName: this.data.configName,
      }).then((res) => {
        this.listsList = []
        const { result } = res
        this.projectName = result[0].projectName
        this.stageGroup = result[0].stageGroup
        this.stageName = result[0].stageName
        this.th = [
          {
            name: '排名',
            width: '80px',
          },
          {
            name: '代表队',
            align: 'left',
            width: '300px'
          },
          {
            name: '姓名',
            width: '140px',
          },
        ]
        if (result[0].groupCount) {
          for (let i = 0; i < result[0].groupCount; i++) {
            this.th.push({
              name: `${i + 1}0`,
              width: '80px',
            })
          }
        }
        this.th.push({ name: '个人成绩', width: '150px' }, { name: '总环数', width: '150px' })
        if (result && result.length != 0) {
          result.forEach((item, index) => {
            item.playerList.forEach((e, v) => {
              let obj = {
                ...item,
                ...e,
                rank: v == 0 ? index + 1 : item.playerList[v - 1].groupName == e.groupName ? '' : index + 1,
                total:
                  v == 0 ? item.stageTotal : item.playerList[v - 1].groupName == e.groupName ? '' : item.stageTotal,
                groupName:
                  v == 0 ? item.groupName : item.playerList[v - 1].groupName == e.groupName ? '' : item.groupName,
              }
              e.groupList.forEach((s, c) => {
                obj[`${c + 1}0`] = s.groupTotal
              })
              this.listsList.push(obj)
            })
          })
        } else {
          this.listsList = []
        }
        this.$nextTick(() => {
          this.upload()
        })
      })
    },
    // 团队综合排名
    tuandui() {
      getTeamTotalScores({
        configName: this.data.configName,
      }).then((res) => {
        console.log(res)
        this.rankingList = res.result
      })
    },
    // 混团
    huntuan() {
      getMixeTeamFinalsListAPI({
        screenName: this.data.configName,
        stageGroup: this.data.configName.includes('金牌赛') ? 1 : 2,
      }).then((res) => {
        const { result } = res
        this.projectName = result[0].projectName
        this.stageGroup = result[0].stageGroup
        this.stageName = result[0].stageName
      })
    },
    getData() {
      const data = JSON.parse(window.name)
      if (data.configName.includes('个人资格赛')) {
        this.geren()
      }
      if (data.configName.includes('个人决赛')) {
        this.gerenjuesaii()
      }
      if (data.configName.includes('团体排名')) {
        this.tuanti()
      }
      if (data.configName.includes('混团')) {
        this.huntuan()
      }
      if (data.configName.includes('综合排名')) {
        this.tuandui()
      }
    },
    getList() {
      const data = JSON.parse(window.name)
      if (data.configName.includes('个人资格赛')) {
        this.geren('old')
      }
      if (data.configName.includes('个人决赛')) {
        console.log(data)
        this.gerenjuesaii('old')
      }
      if (data.configName.includes('团体排名')) {
        this.tuanti()
      }
      if (data.configName.includes('混团')) {
        this.huntuan()
      }
      if (data.configName.includes('综合排名')) {
        this.tuandui()
      }
    },
  },
  destroyed() {
    clearInterval(this.time)
  },
}
</script>

<style scoped lang='less'>
@height: 46px;

.targetImage {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .flex {
    position: relative;
    flex: 0 0 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25%;
    height: 190px;
    overflow: hidden;

    .box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 300px;
      height: 300px;

      .name {
        position: absolute;
        left: 0;
        bottom: 0;
        color: #fff;
        font-size: 24px;
        font-weight: bold;
      }

      .shouqiang {
        width: 300px;
        height: 300px;
      }

      .buqiang {
        width: 300px;
        height: 300px;
      }
    }
  }
}

.container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: #001441;
  box-sizing: border-box;
  color: #fff;
  border: 2px solid #2174b6;
}

.box_box {
  width: 100%;
  height: 100%;
  padding: 30px 30px 10px 30px;
  // border: 2px solid #2174B6;
}

.head {
  height: 10%;
  font-size: 24px;
  font-weight: 800;
  padding: 30px 30px 10px 30px;

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

.th {
  display: flex;
  justify-content: space-between;
  font-size: 26px;
  font-weight: 800;
  height: 45px;
  line-height: 40px;
  margin-bottom: 5px;
  border-bottom: 2px solid #2174b6;

  &>div {
    flex: 1;
    text-align: center;
  }
}

.finalEight {
  // display: flex;
  // justify-content: space-between;
  padding-bottom: 5px;
  border-bottom: 2px solid #2174b6;
}

.finalEightRow {
  flex: 1;
  display: flex;
  justify-content: space-between;
  height: @height;
  line-height: @height;

  div {
    text-align: center;
    font-size: 20px;
    // font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.foot {
  height: calc(100% - 10% - (@height * 8) - 40px);
  overflow: hidden;
}

.foots {
  height: calc(100% - 10% - 40px);
  overflow: hidden;
}
</style>