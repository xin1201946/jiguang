<template>
  <dv-border-box-8 :dur="20" class="DataScreen container">
    <!-- 头部 -->
    <div class="head">
      <div class="left">
        <img class="logo" src="../../assets/logo1.png" alt="" />
        <div>
          <h1 class="theme">2023年河北省青少年射击锦标赛</h1>
          <h1 class="title" v-if="['团队综合排名','混团赛排名'].indexOf(state) == -1">{{ stageName }}-{{ projectName }}-{{stageGroup}}</h1>
        </div>
      </div>
      <div class="right">
        <h1 class="state">{{ state }}</h1>
      </div>
      <dv-decoration-10 style="width: 100%; height: 5px" />
    </div>
    <!-- 个人资格赛 -->
    <div class="personally" v-if="state.indexOf('个人资格赛') != -1">
      <TableListVue type="个人赛" :TitleList="personallyList.title" :List="[...personallyList.List[0], ...personallyList.List[1], ...personallyList.List[2]]" style="width: 100%; min-height: 100%"/>
    </div>
    <!-- 个人资格赛总排名 -->
    <div class="personally" v-if="state.indexOf('资格赛总排名') != -1">
      <TableListVue type="个人赛" :TitleList="personallyList.title" :List="[...personallyList.List[0], ...personallyList.List[1], ...personallyList.List[2]]" style="width: 100%; min-height: 100%"/>
    </div>
    <!-- 个人赛淘汰赛 -->
    <div class="personally" v-if="state.indexOf('个人决赛') != -1 || state.indexOf('个人淘汰赛') != -1">
      <a-carousel style="width: 100%; min-height: 100%">
        <div>
          <TableListVue2 type="个人赛淘汰赛" :TitleList="personallyFinalsList.title" :List="personallyFinalsList.List[0]" />
        </div>
      </a-carousel>
      <div class="targetImage">
        <div class="flex" v-for="(item, index) in personallyFinalsList.List[0]" :key="index">
          <div class="box">
            <div class="name">{{item['姓名']}}</div>
            <div :class="state.indexOf('手枪') != -1 ? 'buqiang' : 'shouqiang'">
              <EchatTarget :dots="item.playerScores" :state="state" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 团队赛 -->
    <div class="team" v-if="state.indexOf('团体排名') != -1">
      <TameRankingList style="width: 100%; min-height: 100%" type="团队赛" :TitleList="teamList.title" :List="teamList.List[0]" />
      <!-- <a-carousel ref="personally1" style="width: 100%; min-height: 100%">
        <div>
          <TableListVue type="团队赛" :TitleList="teamList.title" :List="teamList.List[0]" />
        </div>
        <div v-if="teamList.List[1].length != 0">
          <TableListVue type="团队赛" :TitleList="teamList.title" :List="teamList.List[1]" />
        </div>
        <div v-if="teamList.List[2].length != 0">
          <TableListVue type="团队赛" :TitleList="teamList.title" :List="teamList.List[2]" />
        </div>
        <div v-if="teamList.List[3].length != 0">
          <TableListVue type="团队赛" :TitleList="teamList.title" :List="teamList.List[3]" />
        </div>
      </a-carousel> -->
    </div>
    <!-- 混团 -->
    <div class="mixeTeamFinals" v-if="[
          '手枪混团铜牌赛排名',
          '手枪混团金牌赛排名',
          '步枪混团金牌赛排名',
          '步枪混团铜牌赛排名',
        ].indexOf(state) != -1">
      <a-carousel style="width: 100%; min-height: 100%">
        <div>
          <TableListVue type="混团赛金铜牌赛" :TitleList="mixeTeamFinalsList.title" :List="mixeTeamFinalsList.List[0]" />
        </div>
      </a-carousel>
    </div>
    <!-- 排名 -->
    <div class="team" v-if="['团队综合排名','混团赛排名'].indexOf(state) != -1">
      <RankingList :data="rankingList" />
    </div>
  </dv-border-box-8>
</template>

<script>
import {
  littleScreen,
  getMixeTeamFinalsListAPI,
  getTeamScoresAPI,
  getTeamTotalScores,
  littleScreenByTotal,
  getMassingScores,
} from '@api/competition'
// 个人赛和混团赛滚动成绩tabelList
import TableListVue from './components/tableList.vue'
import TableListVue2 from './components/tableList2.vue'
// 排名
import RankingList from './components/rankingList.vue'
import TameRankingList from './components/tameRankingList.vue'
// 靶图
import EchatTarget from '../view/targetmap/modules/EchatTarget.vue'
export default {
  components: { TableListVue, RankingList, EchatTarget, TableListVue2, TameRankingList },
  data() {
    return {
      projectName: '',
      stageGroup: '',
      shootGroups: '',
      stageName: '',
      state: '排名',

      // 个人资格赛
      isPersonally: false,
      personallyList: {
        title: [],
        List: [[], [], [], []],
      },
      // 个人决赛
      isPersonallyFinals: false,
      personallyFinalsList: {
        title: [],
        List: [],
      },
      // 团队赛
      isTeam: false,
      teamList: {
        title: [],
        List: [[], [], [], []],
      },
      // 混团金铜牌赛
      isMixeTeamFinals: false,
      mixeTeamFinalsList: {
        title: [
          {
            name: '排名',
            width: '80px',
          },
          {
            name: '代表队',
          },
          {
            name: '姓名',
          },
          {
            name: '发序',
          },
          {
            name: '环数',
          },
          {
            name: '总环数',
          },
          {
            name: '总分',
          },
        ],
        List: [[]],
      },
      // 排名
      rankingList: [],
      timer: null,
      next: null,
    }
  },
  created() {
    document.body.style.overflow = 'hidden'
    // console.log(this.$getDpi(45.5))
    this.state = this.$route.query.type
    this.getData()
    this.timer = setInterval(() => {
      this.getData()
    }, 3000)
  },
  mounted() {
    if (this.$refs.personally1) {
      this.next = setInterval(() => {
        this.$refs.personally1.next()
      }, 10000)
    }
  },
  methods: {
    getData() {
      if (this.state.indexOf('个人资格赛') != -1) {
        littleScreen({ type: this.state }).then((res) => {
          this.personallyList.List = [[], [], [], []]
          let data = res.result
          this.projectName = data.projectName
          this.stageGroup = data.stageGroup
          this.shootGroups = data.shootGroups
          this.stageName = data.stageName
          this.personallyList.title = [
            {
              name: '排名',
              width: '80px',
            },
            {
              name: '代表队',
            },
            {
              name: '靶位',
              width: '80px',
            },
            {
              name: '姓名',
            },
          ]
          if (data.shootGroups) {
            for (let i = 0; i < data.shootGroups; i++) {
              this.personallyList.title.push({
                name: `${i + 1}0`,
              })
            }
          }
          this.personallyList.title.push({
            name: '总环数',
          })
          if (data.players && data.players.length != 0) {
            data.players.forEach((item, index) => {
              let obj = {
                id: item.playerName,
                排名: item.rank,
                代表队: item.groupName,
                靶位: item.targetSite,
                姓名: item.playerName,
                总环数: data.isGood == '是' ? `${item.totalScore}-${item.good}x` : item.totalScore,
              }
              item.groupList.forEach((e, v) => {
                obj[`${v + 1}0`] = e.groupTotal
              })
              if (index < 8) {
                this.personallyList.List[0].push(obj)
              } else if (index < 16 && index > 7) {
                this.personallyList.List[1].push(obj)
              } else if (index < 24 && index > 15) {
                this.personallyList.List[2].push(obj)
              } else if (index < 32 && index > 23) {
                this.personallyList.List[3].push(obj)
              }
            })
          } else {
            this.personallyList.List = [[], [], [], []]
          }
        })
      } else if (this.state.indexOf('个人决赛') != -1 || this.state.indexOf('个人淘汰赛') != -1) {
        littleScreen({ type: this.state }).then((res) => {
          this.personallyFinalsList.List = [[]]
          let data = res.result
          this.projectName = data.projectName
          this.stageGroup = data.stageGroup
          this.shootGroups = data.shootGroups
          this.stageName = data.stageName
          this.personallyFinalsList.title = [
            {
              name: '排名',
              width: '80px',
            },
            {
              name: '代表队',
            },
            {
              name: '靶位',
            },
            {
              name: '姓名',
            },
          ]
          if (data.shoots) {
            data.shoots.forEach((item) => {
              this.personallyFinalsList.title.push({
                name: item,
                width: '70px',
              })
            })
          }
          this.personallyFinalsList.title.push({
            name: '总环数',
          })
          if (data.players && data.players.length != 0) {
            data.players.forEach((item, index) => {
              let obj = {
                id: item.playerName,
                排名: item.rank,
                代表队: item.groupName,
                靶位: item.targetSite,
                姓名: item.playerName,
                总环数: data.isGood == '是' ? `${item.totalScore}-${item.good}x` : item.totalScore,
                playerScores: item.playerScores,
              }
              item.groupList.forEach((e, v) => {
                obj[e.groupCount] = e.groupTotal
              })
              this.personallyFinalsList.List[0].push(obj)
            })
          } else {
            this.personallyFinalsList.List = [[]]
          }
          console.log(this.personallyFinalsList, 123456)
        })
      } else if (['步枪团体排名', '手枪团体排名'].indexOf(this.state) != -1) {
        getTeamScoresAPI({ screenName: this.state }).then((res) => {
          this.teamList.List = [[], [], [], []]
          let data = res.result
          this.projectName = data[0].projectName
          this.stageGroup = data[0].projectGroup
          this.shootGroups = data.shootGroups
          this.stageName = data[0].stageName
          this.teamList.title = [
            {
              name: '排名',
              width: '80px',
            },
            {
              name: '代表队',
            },
            {
              name: '姓名',
            },
          ]
          if (data[0].groupCount) {
            for (let i = 0; i < data[0].groupCount; i++) {
              this.teamList.title.push({
                name: `${i + 1}0`,
              })
            }
          }

          this.teamList.title.push({
            name: '总环数',
          })
          if (data && data.length != 0) {
            data.forEach((item, index) => {
              item.playerList.forEach((e, v) => {
                let obj = {
                  id: item.playerName,
                  排名: index + 1,
                  姓名: e.playerName,
                  代表队: item.groupName,
                  总环数: `${item.stageTotal}`,
                }
                e.groupList.forEach((s, c) => {
                  obj[`${c + 1}0`] = s.groupTotal
                })
                if (index < 8) {
                  this.teamList.List[0].push(obj)
                } else if (index < 16 && index > 7) {
                  this.teamList.List[1].push(obj)
                } else if (index < 24 && index > 15) {
                  this.teamList.List[2].push(obj)
                } else if (index < 32 && index > 23) {
                  this.teamList.List[3].push(obj)
                }
                console.log(this.teamList.List[0])
              })
            })
          } else {
            this.teamList.List = [[], [], [], []]
          }
        })
      } else if (
        ['手枪混团铜牌赛排名', '手枪混团金牌赛排名', '步枪混团金牌赛排名', '步枪混团铜牌赛排名'].indexOf(this.state) !=
        -1
      ) {
        getMixeTeamFinalsListAPI({
          screenName: this.state,
          stageGroup: this.state.indexOf('金牌赛') ? 1 : 2,
        }).then((res) => {
          this.mixeTeamFinalsList.List = [[]]
          let data = res.result
          this.projectName = data[0].projectName
          this.stageName = data[0].stageName
          this.stageGroup = data[0].projectGroup
          if (data && data.length != 0) {
            data.forEach((item, index) => {
              let obj = {
                排名: index + 1,
                代表队: item.groupName,
                姓名: [item.player1Name, item.player2Name],
                发序: item.shootCode ? item.shootCode : 0,
                环数: [item.player1Score ? item.player1Score : 0, item.player2Score ? item.player2Score : 0],
                // 环数: [(Math.random() * 10).toFixed(1), (Math.random() * 10).toFixed(1)],
                总环数: item.stageTotal,
                总分: item.total,
              }
              this.mixeTeamFinalsList.List[0].push(obj)
            })
          } else {
            this.mixeTeamFinalsList.List = [[]]
          }
        })
      } else if (this.state.indexOf('综合排名') !== -1) {
        getTeamTotalScores({
          configName: this.state,
        }).then((res) => {
          this.rankingList = res.result
        })
      }else if(this.state.indexOf('资格赛总排名') == -1){
         
        littleScreenByTotal({ type: this.state }).then((res) => {

          console.log(res);
          this.personallyFinalsList.List = [[]]
          let data = res.result
          this.projectName = data.projectName
          this.stageGroup = data.stageGroup
          this.shootGroups = data.shootGroups
          this.stageName = data.stageName
          this.personallyFinalsList.title = [
            {
              name: '排名',
              width: '80px',
            },
            {
              name: '代表队',
            },
            {
              name: '靶位',
            },
            {
              name: '姓名',
            },
          ]
          if (data.shoots) {
            data.shoots.forEach((item) => {
              this.personallyFinalsList.title.push({
                name: item,
                width: '70px',
              })
            })
          }
          this.personallyFinalsList.title.push({
            name: '总环数',
          })
          if (data.players && data.players.length != 0) {
            data.players.forEach((item, index) => {
              let obj = {
                id: item.playerName,
                排名: item.rank,
                代表队: item.groupName,
                靶位: item.targetSite,
                姓名: item.playerName,
                总环数: data.isGood == '是' ? `${item.totalScore}-${item.good}x` : item.totalScore,
                playerScores: item.playerScores,
              }
              item.groupList.forEach((e, v) => {
                obj[e.groupCount] = e.groupTotal
              })
              this.personallyFinalsList.List[0].push(obj)
            })
          } else {
            this.personallyFinalsList.List = [[]]
          }
          console.log(this.personallyFinalsList, '个人资格赛总排名')
        })
      }
      // else if (
      //   [
      //     '手枪混团铜牌赛排名',
      //     '手枪混团金牌赛排名',
      //     '手枪混团资格赛排名',
      //     '步枪混团金牌赛排名',
      //     '步枪混团资格赛排名',
      //   ].indexOf(this.state) !== -1
      // ) {
      //   getMassingScores({
      //     screenName: this.state,
      //   }).then((res) => {
      //     let arr = []
      //     for (let i in res.result) {
      //       console.log(i)
      //       arr.push({
      //         groupName: i,
      //         total: res.result[i],
      //       })
      //     }
      //     this.rankingList = arr
      //   })
      // }
    },
  },
  destroyed() {
    clearInterval(this.timer)
    clearInterval(this.next)
  },
}
</script>

<style scoped lang="less">
v-deep ::-webkit-scrollbar {
  width: 0 !important;
}
v-deep ::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}
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
    height: 156px;
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
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  // background: radial-gradient(rgb(30, 61, 163) 15.4639%, rgb(1, 9, 43) 99.4845%);
  // background: url(../../assets/350.jpg) no-repeat center center/cover;
  background: #001441;
  // background: url(https://fujian.passboat.com/uploads/0108/1578471990000fa2f.png) no-repeat center center/cover;
  // background: url(../../assets/20b1OOOPICe1.jpg) no-repeat center center/cover;

  padding: 30px;
  box-sizing: border-box;
  color: #fff;
  .head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 80px;
    margin-bottom: 20px;
    .left {
      display: flex;
      align-items: center;
      .logo {
        width: 150px;
        height: 26px;
        margin-bottom: 20px;
      }
      .theme {
        color: #fff;
        font-weight: 1000;
        font-size: 24px;
      }
      .title {
        color: #fff;
        font-weight: 1000;
        font-size: 24px;
      }
    }
    .right {
      .state {
        display: inline-block;
        color: #fff;
        font-weight: 1000;
        font-size: 24px;
      }
    }
  }
}
.example {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  .loading {
    font-size: 100px;
    margin-bottom: 20px;
  }
  p {
    font-size: 28px;
  }
}
.draw {
  display: flex;
  justify-content: space-between;
  width: 100%;
  &-tit {
    display: flex;
    align-items: center;
    text-align: center;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.3);
    p {
      flex: 1;
      font-weight: 1000;
      font-size: 28px;
      line-height: 80px;
      margin-bottom: 0;
    }
  }
  &-list {
    width: 100%;
    height: calc(100% - 160px);
    &-item {
      display: flex;
      text-align: center;
      p {
        flex: 1;
        font-size: 24px;
      }
    }
  }
}
.personally,
.team,
.mixeTeam,
.mixeTeamFinals {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.textLoading,
.teamLoading,
.personallyLoading,
.mixeTeamLoading,
.mixeTeamFinalsLoading {
  line-height: 150px;
  font-weight: 1000;
  font-size: 70px;
}
/deep/ .ant-carousel .slick-dots-bottom {
  bottom: 0%;
}
</style>