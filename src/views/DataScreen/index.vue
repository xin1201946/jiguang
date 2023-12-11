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
      <a-carousel ref="personally1" style="width: 100%; min-height: 100%">
        <div>
          <TableListVue type="个人赛" :TitleList="personallyList.title" :List="personallyList.List[0]" />
        </div>
        <div v-if="personallyList.List[1].length != 0">
          <TableListVue type="个人赛" :TitleList="personallyList.title" :List="personallyList.List[1]" />
        </div>
        <div v-if="personallyList.List[2].length != 0">
          <TableListVue type="个人赛" :TitleList="personallyList.title" :List="personallyList.List[2]" />
        </div>
        <div v-if="personallyList.List[3].length != 0">
          <TableListVue type="个人赛" :TitleList="personallyList.title" :List="personallyList.List[3]" />
        </div>
      </a-carousel>
    </div>
    <!-- 个人赛淘汰赛 -->
    <div class="personally" v-if="state.indexOf('个人决赛') != -1 || state.indexOf('个人淘汰赛') != -1">
      <a-carousel style="width: 100%; min-height: 100%">
        <div>
          <TableListVue2 type="个人赛淘汰赛" :TitleList="personallyFinalsList.title" :List="personallyFinalsList.List[0]" />
        </div>
      </a-carousel>
      <div class="targetImage">
        <div class="flex">
          <div class="box">
            <div class="name">某某某</div>
            <div class="wrap">
              <EchatTarget />
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="box">
            <div class="name">某某某</div>
            <div class="wrap">
              <EchatTarget />
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="box">
            <div class="name">某某某</div>
            <div class="wrap">
              <EchatTarget :dots="[{x: 20, y: 33},{x: 200, y: 330}]" />
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="box">
            <div class="name">某某某</div>
            <div class="wrap">
              <EchatTarget />
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="box">
            <div class="name">某某某</div>
            <div class="wrap">
              <EchatTarget />
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="box">
            <div class="name">某某某</div>
            <div class="wrap">
              <EchatTarget />
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="box">
            <div class="name">某某某</div>
            <div class="wrap">
              <EchatTarget />
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="box">
            <div class="name">某某某</div>
            <div class="wrap">
              <EchatTarget />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 团队赛 -->
    <div class="team" v-if="state.indexOf('团体排名') != -1">
      <a-carousel ref="personally1" style="width: 100%; min-height: 100%">
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
      </a-carousel>
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
  getMassingScores,
} from '@api/competition'
// 个人赛和混团赛滚动成绩tabelList
import TableListVue from './components/tableList.vue'
import TableListVue2 from './components/tableList2.vue'
// 排名
import RankingList from './components/rankingList.vue'
// 靶图
import EchatTarget from '../view/targetmap/modules/EchatTarget.vue'
export default {
  components: { TableListVue, RankingList, EchatTarget, TableListVue2 },
  data() {
    return {
      projectName: '',
      stageGroup: '',
      shootGroups: '',
      stageName: '',
      state: '排名',

      isSpin: false,
      drawList: {
        title: [
          {
            name: '选手编号',
          },
          {
            name: '选手姓名',
          },
          {
            name: '代表队',
          },
          {
            name: '靶位',
          },
        ],
        List: [
          [
            {
              选手编号: '123',
              选手姓名: '姓名1',
              代表队: '团队1',
              靶位: '一号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名2',
              代表队: '团队2',
              靶位: '二号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名3',
              代表队: '团队1',
              靶位: '三号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名4',
              代表队: '团队1',
              靶位: '四号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名5',
              代表队: '团队1',
              靶位: '五号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名6',
              代表队: '团队1',
              靶位: '六号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名7',
              代表队: '团队1',
              靶位: '七号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名8',
              代表队: '团队1',
              靶位: '八号靶',
            },
          ],
          [
            {
              选手编号: '123',
              选手姓名: '姓名9',
              代表队: '团队1',
              靶位: '九号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名10',
              代表队: '团队1',
              靶位: '十号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '十一号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '十二号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '十三号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '十四号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '十五号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '十六号靶',
            },
          ],
        ],
        List2: [
          [
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '十七号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '十八号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '十九号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '二十号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '二十一号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '二十二号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '二十三号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '二十四号靶',
            },
          ],
          [
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '二十五号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '二十六号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '二十七号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '二十八号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '二十九号靶',
            },
            {
              选手编号: '123',
              选手姓名: '姓名11',
              代表队: '团队1',
              靶位: '三十号靶',
            },
          ],
        ],
      },
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

    console.log(this.$getDpi(16))
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
          console.log(res)
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
              width: '120px',
            },
            {
              name: '靶位',
            },
            {
              name: '姓名',
            },
          ]
          for (let i = 0; i < data.shootGroups; i++) {
            this.personallyList.title.push({
              name: `${i + 1}0`,
            })
          }
          this.personallyList.title.push({
            name: '总环数',
          })
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
        })
      } else if (this.state.indexOf('个人决赛') != -1 || state.indexOf('个人淘汰赛') != -1) {
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
              width: '120px',
            },
            {
              name: '靶位',
            },
            {
              name: '姓名',
            },
          ]
          data.shoots.forEach((item) => {
            this.personallyFinalsList.title.push({
              name: item,
              width: '70px',
            })
          })
          this.personallyFinalsList.title.push({
            name: '总环数',
          })
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
              obj[e.groupCount] = e.groupTotal
            })
            this.personallyFinalsList.List[0].push(obj)
          })
        })
      } else if (['步枪团体排名', '手枪团体排名'].indexOf(this.state) != -1) {
        getTeamScoresAPI({
          contestId: 4,
          cproStageId: 4,
        }).then((res) => {
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
          ]
          this.teamList.title.push({
            name: '总环数',
          })
          data.forEach((item, index) => {
            let obj = {
              id: item.playerName,
              排名: index + 1,
              代表队: item.groupName,
              总环数: `${item.stageTotal}-${item.goodTotal ? item.goodTotal : 0}x`,
            }
            // if (item.detailScoreList) {
            //   item.detailScoreList.forEach((e, v) => {
            //     obj[`${v + 1}0`] = e.gunGroupTotal
            //   })
            // }
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
            console.log(this.mixeTeamFinalsList.List[0])
            this.mixeTeamFinalsList.List[0].push(obj)
          })
        })
      } else if (this.state.indexOf('综合排名') !== -1) {
        getTeamTotalScores({
          configName: this.state,
        }).then((res) => {
          this.rankingList = res.result
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
    height: 150px;
    overflow: hidden;
    .box {
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
      .wrap {
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
  background: url(../../assets/350.jpg) no-repeat center center/cover;
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
    height: 120px;
    margin-bottom: 20px;
    .left {
      display: flex;
      align-items: center;
      .logo {
        width: 150px;
        height: 32px;
        margin-bottom: 20px;
      }
      .theme {
        color: #fff;
        font-weight: 1000;
        font-size: 30px;
      }
      .title {
        color: #fff;
        font-weight: 1000;
        font-size: 30px;
      }
    }
    .right {
      .state {
        display: inline-block;
        color: #fff;
        font-weight: 1000;
        font-size: 30px;
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