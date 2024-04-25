<template>
  <div style="width: 100%; display: flex" v-show='!len'>
    <dv-border-box-8 :dur="20" class="DataScreen container" v-for="data in projectList" :key="data.configName">
      <!-- 头部 -->
      <div class="head">
        <div class='top'>
          <div>
            <div class="left">
              <img class="logo" :src="data.configName.indexOf('手枪') != -1 ? shou :
                data.configName.indexOf('步枪') != -1 ? bu : shou" alt="" />
              <div>
                <div style="margin-bottom: 10px;">{{ data.contestName }}</div>
                <div v-if="data.configName != '团队综合排名'">
                  <span v-if="data.stageName">{{ data.stageName }}</span>
                  <span v-if="data.projectName">-{{ data.projectName }}</span>
                  <span v-if="data.stageGroup">-{{ data.stageGroup }}</span>
                </div>
              </div>
              <div v-if="data.configName == '团队综合排名'">
                {{ data.configName }}
              </div>
            </div>
          </div>
          <div class='right'>
            <div>
              <div class="nameTitle">
                <div style="margin-left: 15px;margin-bottom: 10px;">{{ data.addr }}</div>
              </div>
              <div class="times">{{ data.bisaiTime }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 个人赛 -->
      <div class="box_box" v-if="data.configName.indexOf('个人资格赛') != -1 || data.configName.indexOf('个人决赛') != -1">
        <!--    表头-->
        <div class='th'>
          <div v-for='(item, i) in data.th' :key='i' :style="`width:${item.width};flex:${item.width ? 'none' : '1'};text-align:${item.align ? item.align : 'center'}`">
            {{ item.name }}
          </div>
        </div>
        <div style="width: 100%;height: 100%;" v-if="data.fiftyRounds === '0' && data.configName.indexOf('个人资格赛') != -1">
          <!--    整页的滚动-->
          <vueSeamless :classOption="classOption" class="foots" :data="data.listsList" ref="scorllBox">
            <div class="footContent" ref="scorllArr">
              <div v-for="(item, i) in data.listsList" :key="i" class="finalEightRow">
                <div style="width: 60px">{{ item.rank }}</div>
                <div style="width: 60px">{{ item.targetSite }}</div>
                <div style="width: 100px">{{ item.playerName }}</div>
                <div style="flex: 1;text-align: left;">{{ item.groupName }}</div>
                <div v-if="item.groupList[k - 1]" :class="item.groupList[k - 1].status === 1 ? 'xiahuaxian' : ''" v-for="k in data.shootGroups" :key="k" style="width: 50px;position: relative;">
                  {{ item.groupList[k - 1] && item.groupList[k - 1].groupTotal }}
                  <!-- <span class="spanDiv" v-if="item.groupList[k - 1].status === 1"></span> -->
                </div>
                <div style="width: 80px;">{{ item.total }}</div>
                <div style="width: 60px;">{{ item.remark }}</div>
                <div style="width: 30px">{{ item.bePromoted }}</div>
              </div>
            </div>
          </vueSeamless>
        </div>
        <div style="width: 100%;height: 100%;" v-if="data.fiftyRounds != '0' && data.configName.indexOf('个人资格赛') != -1">
          <!--    前8位-->
          <div class='finalEight'>
            <div v-for="(item, i) in data.finalEight" :key="i" class="finalEightRow">
              <div style="width: 60px">{{ item.rank }}</div>
              <div style="width: 60px">{{ item.targetSite }}</div>
              <div style="width: 100px">{{ item.playerName }}</div>
              <div style="flex: 1;text-align: left;">{{ item.groupName }}</div>
              <div v-if="item.groupList[k - 1]" :class="item.groupList[k - 1].status === 1 ? 'xiahuaxian' : ''" v-for="k in data.shootGroups" :key="k" style="width: 50px;position: relative;">
                {{ item.groupList[k - 1] && item.groupList[k - 1].groupTotal }}
                <!-- <span class="spanDiv" v-if="item.groupList[k - 1].status === 1"></span> -->
              </div>
              <div style="width: 80px;">{{ item.total }}</div>
              <!--              <div style="width: 60px;">{{ item.remarkPenalty }}</div>-->
              <div style="width: 60px;">{{ item.remark }}</div>
              <div style="width: 30px">{{ item.bePromoted }}</div>
            </div>
          </div>
          <!-- 后半页滚动 -->
          <vueSeamless :classOption="classOption" :data="data.list" class="foot" ref="scorllBox">
            <div class="footContent" ref="scorllArr">
              <div v-for="(item, i) in data.list" :key="i" class="finalEightRow">
                <div style="width: 60px">{{ item.rank }}</div>
                <div style="width: 60px">{{ item.targetSite }}</div>
                <div style="width: 100px">{{ item.playerName }}</div>
                <div style="flex: 1;text-align: left;">{{ item.groupName }}</div>
                <div v-if="item.groupList[k - 1]" :class="item.groupList[k - 1].status === 1 ? 'xiahuaxian' : ''" v-for="k in data.shootGroups" :key="k" style="width: 50px;position: relative;">
                  {{ item.groupList[k - 1] && item.groupList[k - 1].groupTotal }}
                  <!-- <span class="spanDiv" v-if="item.groupList[k - 1].status === 1"></span> -->
                </div>
                <div style="width: 80px;">{{ item.total }}</div>
                <!--                <div style="width: 60px;">{{ item.remarkPenalty }}</div>-->
                <div style="width: 60px;">{{ item.remark }}</div>
                <div style="width: 30px">{{ item.bePromoted }}</div>
              </div>
            </div>
          </vueSeamless>
        </div>

        <div style="width: 100%;height: 100%;display: flex;flex-direction: column" v-if="data.configName.indexOf('个人决赛') != -1">
          <!--    前8位-->
          <div :class="data.finalEight.length == 0 ? '' : 'finalEight'">
            <div v-for="(item, i) in data.finalEight" :key="i" :class="item.eliminationStatus == 1 ? 'finalEightRow taotai' : item.sameStatus == 1 ? 'tongfen finalEightRow' : 'finalEightRow'">
              <div style="width: 60px">{{ item.rank }}</div>
              <div style="width: 60px">{{ item.targetSite }}</div>
              <div style="width: 100px">{{ item.playerName }}</div>
              <div style="width: 300px;text-align: left;">{{ item.groupName }}</div>
              <div v-for="k in data.shootGroups" :key="k.id" style="flex: 1;">
                {{ item[k] }}
              </div>
              <div style="flex: 1;" v-for="(n, i) in data.number" :key="n">
                {{ item.sameScoreList && item.sameScoreList[i] ? item.sameScoreList[i].scores : '' }}
              </div>
              <div style="flex: 1;">{{ item.total }}</div>
              <div style="flex: 1;">{{ item.diff }}</div>
              <!--              <div style="flex: 1;">{{ item.remarkPenalty }}</div>-->
              <div style="flex: 1;">{{ item.remark }}</div>
            </div>
          </div>
          <div class="targetImage" v-if="data.configName.indexOf('手枪') != -1">
            <div class="div" v-for="(item) in data.finalEight" :key="item.targetSite">
              <div class="flex">
                <div class="box">
                  <div class="name">{{ item.playerName }}</div>
                  <div :class="data.configName.indexOf('手枪') == -1 ? 'buqiang' : 'shouqiang'">
                    <EchatTarget :dots="item.playerScores" :state="data.configName" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="targetImage1" v-if="data.configName.indexOf('步枪') != -1">
            <div class="div1" v-for="(item) in data.finalEight" :key="item.targetSite">
              <div class="name1">{{ item.playerName }}</div>
              <div class="flex1">
                <div class="box1">
                  <div :class="data.configName.indexOf('手枪') == -1 ? 'buqiang1' : 'shouqiang1'">
                    <EchatTargetB :dots="item.playerScores" :state="data.configName" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 后半页滚动 -->
          <!-- <div class="foot" ref="scorllBox">
          <div class="footContent" ref="scorllArr">
            <div v-for="(item, i) in list" :key="i" class="finalEightRow">
              <div style="width: 60px">{{ item.rank }}</div>
              <div style="width: 60px">{{ item.targetSite }}</div>
              <div style="width: 100px">{{ item.playerName }}</div>
              <div style="flex: 1;text-align: left;">{{ item.groupName }}</div>
              <div v-for="k in shootGroups" :key="k" style="width: 60px;">
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
      <div class="box_box" v-if="data.configName === '手枪混团铜牌赛排名' || data.configName === '手枪混团金牌赛排名' || data.configName === '步枪混团金牌赛排名' || data.configName === '步枪混团铜牌赛排名'">
        <mixedClusterIndex :data="data" :number="projectList.length"></mixedClusterIndex>
      </div>
      <!-- 团队赛 -->
      <div class="box_box" v-if="data.configName.indexOf('团体排名') != -1">
        <!--    表头-->
        <div class='th'>
          <div v-for='(item, i) in data.th' :key='i' :style="`width:${item.width};flex:${item.width ? 'none' : '1'};text-align:${item.align ? item.align : 'center'}`">
            {{ item.name }}
          </div>
        </div>
        <div style="width: 100%;height: 100%;">
          <!--    整页的滚动-->
          <vueSeamless :classOption="classOption" :data="data.listsList" class="foots" ref="scorllBox">
            <div class="footContent" ref="scorllArr">
              <div v-for="(item, i) in data.listsList" :key="i" class="finalEightRow">
                <div style="width: 60px">{{ item.rank }}</div>
                <div style="width: 250px;text-align: left;">{{ item.groupName }}</div>
                <div style="width: 140px">{{ item.playerName }}</div>
                <div v-for="k in item.groupList" :key="k.id" style="width: 60px;">
                  {{ k.groupTotal }}
                </div>
                <div style="width: 80px;">{{ item.stageTotal }}</div>
                <div style="width: 80px;">{{ item.total }}</div>
              </div>
            </div>
          </vueSeamless>
        </div>
      </div>
      <!-- 排名 -->
      <div class="box_box" v-if="data.configName === '团队综合排名'">
        <RankingList :data="data.rankingList" />
      </div>
    </dv-border-box-8>
  </div>
</template>

<script>
import {
  getMixeTeamFinalsListAPI,
  getTeamScoresAPI,
  getTeamTotalScores,
  littleScreen,
  getDataScreenCurrentConfigApi,
} from '@api/competition'
import Display from '@views/control/display/index.vue'
import mixedClusterIndex from './modules/mixedClusterIndex.vue'
// 靶图
import EchatTarget from '../view/targetmap/modules/EchatTarget.vue'
import EchatTargetB from '../view/targetmap/modules/EchatTargetB.vue'
import RankingList from './components/rankingList.vue'
import vueSeamless from 'vue-seamless-scroll'
export default {
  name: 'dataScreen',
  components: { Display, mixedClusterIndex, EchatTarget, RankingList, EchatTargetB, vueSeamless },
  data() {
    return {
      classOption: {
        step: 0.3,
        limitMoveNum: 16,
      },
      shou: require('@/assets/logoS.png'),
      bu: require('@/assets/logoB.png'),

      title: '',
      projectList: null,
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
      contestName: undefined,
      addr: undefined,
      bisaiTime: undefined,

      teamList: [],
      rankingList: [],
      fiftyRounds: '0',

      dos: [],
      timer: null,
      currentProject: [],
      len: false
    }
  },
  created() {
    getDataScreenCurrentConfigApi().then((res) => {
      this.currentProject = JSON.parse(JSON.stringify(res.result))
      this.projectList = res.result
      this.projectList.map((item) => {
        item['fiftyRounds'] = 0
        item['finalEight'] = []
        item['list'] = []
        item['listsList'] = []
        item['projectName'] = ''
        item['stageGroup'] = ''
        item['stageName'] = ''
        item['bisaiTime'] = ''
        item['contestName'] = ''
        item['addr'] = ''
        item['th'] = []
        item['shootGroups'] = 0
        item['rankingList'] = []
        item['number'] = 0
      })
      this.getList()
    })

    this.timer = setInterval(() => {
      getDataScreenCurrentConfigApi().then((res) => {
        this.len = false
        if (JSON.stringify(this.currentProject) != JSON.stringify(res.result)) {
          this.currentProject = JSON.parse(JSON.stringify(res.result))
          this.len = true
          // console.log(this.len !== res.result.length && this.len !== 0)
          // console.log(this.len)
          // if (this.len !== res.result.length && this.len !== 0) {
          //   this.$router.go(0)
          // }
          // this.len = res.result.length
          // console.log(this.len)
          this.projectList = res.result
          this.projectList.map((item) => {
            item['fiftyRounds'] = 0
            item['finalEight'] = []
            item['list'] = []
            item['listsList'] = []
            item['projectName'] = ''
            item['stageGroup'] = ''
            item['stageName'] = ''
            item['bisaiTime'] = ''
            item['contestName'] = ''
            item['addr'] = ''
            item['th'] = []
            item['shootGroups'] = 0
            item['rankingList'] = []
            item['number'] = 0
          })
          this.getList()
        }
      })
    }, 3000)
  },
  mounted() {
    document.body.style.overflow = 'hidden'
    this.time = setInterval(() => {
      this.getData()
    }, 3000)
  },
  methods: {
    // 向上滚动
    upload() {
      // const box = this.$refs.scorllBox
      // const arr = this.$refs.scorllArr
      // const arr2 = document.createElement('div')
      // arr2.innerHTML = arr.innerHTML
      // const thit = this
      // function scrolls() {
      //   box.scrollTop = thit.hei
      //   if (box.scrollTop > arr.offsetHeight) {
      //     thit.hei = 0
      //   } else {
      //     // 移动速度
      //     thit.hei += 0.3
      //   }
      //   thit.animate = window.requestAnimationFrame(scrolls)
      // }
      // if (arr.offsetHeight > box.offsetHeight) {
      //   if (box.children.length < 2) {
      //     box.appendChild(arr2)
      //   } else {
      //     box.children[1].innerHTML = arr.innerHTML
      //   }
      //   if (this.animate === undefined) {
      //     scrolls()
      //   }
      // } else {
      //   box.scrollTop = 0
      //   if (box.children[1]) {
      //     box.removeChild(box.children[1])
      //   }
      //   window.cancelAnimationFrame(this.animation)
      //   this.animation = undefined
      // }
    },
    // 个人资格赛
    geren(data, index) {
      littleScreen({
        type: data.configName,
      }).then((res) => {
        data.finalEight = []
        data.list = []
        data.listsList = []
        const { result } = res
        data.projectName = result.projectName
        data.stageGroup = result.stageGroup
        data.stageName = result.stageName
        data.bisaiTime = result.time
        data.contestName = result.contestName
        data.addr = result.addr
        // 设置表头
        data.th = [
          {
            name: '排名',
            width: '60px',
          },
          {
            name: '靶位',
            width: '60px',
          },
          {
            name: '姓名',
            width: '100px',
          },
          {
            name: '代表队',
            align: 'left',
          },
        ]
        if (result.shootGroups) {
          data.shootGroups = result.shootGroups
          for (let i = 0; i < result.shootGroups; i++) {
            data.th.push({
              name: `${i + 1}0`,
              width: '50px',
            })
          }
        }
        data.th.push({ name: '总环数', width: '80px' }, { name: '备注', width: '60px' }, { name: '-', width: '30px' })
        data.fiftyRounds = '0'
        // 判断到没有到50发
        if (result.players) {
          result.players.map((item) => {
            item.groupList.map((it, i) => {
              if (it.groupCount === 5 && Number(it.groupTotal)) {
                this.classOption.limitMoveNum = 8
                data.fiftyRounds = it.groupTotal
                // 设置前8名
                data.finalEight = result.players
                  .filter((item) => item.rank <= 8)
                  .map((item, i) => {
                    return {
                      ...item,
                      total:
                        result.isGood === '是'
                          ? !item.totalScore
                            ? item.totalScore
                            : `${item.totalScore}-${item.good}x`
                          : item.totalScore,
                      notes: '',
                      bePromoted: 'Q',
                    }
                  })
                // 除了前8名
                data.list = result.players
                  .filter((item) => item.rank > 8)
                  .map((item) => {
                    return {
                      ...item,
                      total:
                        result.isGood === '是'
                          ? !item.totalScore
                            ? item.totalScore
                            : `${item.totalScore}-${item.good}x`
                          : item.totalScore,
                      notes: '',
                      bePromoted: '',
                    }
                  })
              } else {
                this.classOption.limitMoveNum = 16
                data.listsList = result.players.map((item) => {
                  return {
                    ...item,
                    total:
                      result.isGood === '是'
                        ? !item.totalScore
                          ? item.totalScore
                          : `${item.totalScore}-${item.good}x`
                        : item.totalScore,
                    notes: '',
                    bePromoted: '',
                  }
                })
                // data.listsList = [
                //   ...data.listsList,
                // ]
              }
            })
          })
        }

        this.$nextTick(() => {
          this.$forceUpdate()
          this.upload()
        })
      })
    },
    // 个人决赛
    gerenjuesaii(data) {
      littleScreen({
        type: data.configName,
      }).then((res) => {
        data.finalEight = []
        const { result } = res
        data.projectName = result.projectName
        data.stageGroup = result.stageGroup
        data.stageName = result.stageName
        data.bisaiTime = result.time
        data.contestName = result.contestName
        data.addr = result.addr
        data.th = [
          {
            name: '排名',
            width: '60px',
          },
          {
            name: '靶位',
            width: '60px',
          },
          {
            name: '姓名',
            width: '100px',
          },
          {
            name: '代表队',
            align: 'left',
            width: '300px',
          },
        ]
        if (result.shoots) {
          data.shootGroups = result.shoots
          result.shoots.forEach((item) => {
            data.th.push({
              name: item,
            })
          })
        }
        if (result)
          if (result.players && result.players.length != 0) {
            let arr = result.players.filter((item) => item.sameStatus == 1)
            data.number = 0
            arr.forEach((item) => {
              if (data.number < item.sameScoreList.length) {
                data.number = item.sameScoreList.length
              }
            })
            for (let i = 0; i < data.number; i++) {
              data.th.push({ name: ' ' })
            }
            result.players.forEach((item, index) => {
              let obj = {
                ...item,
                total:
                  result.isGood === '是'
                    ? !item.totalScore
                      ? item.totalScore
                      : `${item.totalScore}-${item.good}x`
                    : item.totalScore,
                notes: '',
                bePromoted: '',
              }
              result.shoots.forEach((k) => {
                obj[k] = ''
              })
              item.groupList.forEach((e, v) => {
                result.shoots.forEach((k) => {
                  if (k == e.groupCount) {
                    obj[k] = e.groupTotal
                  }
                })
              })

              data.finalEight.push(obj)
            })
          } else {
            data.finalEight = []
          }
        data.th.push({ name: '总环数' }, { name: '分差' }, { name: '备注' })
        this.$forceUpdate()
      })
    },
    // 团体赛
    tuanti(data) {
      getTeamScoresAPI({
        screenName: data.configName,
      }).then((res) => {
        this.classOption.limitMoveNum = 16
        data.listsList = []
        const { result } = res
        data.projectName = result.projectName
        data.contestName = result.contestName
        data.addr = result.addr
        data.bisaiTime = result.time
        data.stageGroup = ''
        data.stageName = '团体排名'
        data.th = [
          {
            name: '排名',
            width: '60px',
          },
          {
            name: '代表队',
            align: 'left',
            width: '250px',
          },
          {
            name: '姓名',
            width: '140px',
          },
        ]
        if (result.shootGroups) {
          for (let i = 0; i < result.shootGroups; i++) {
            data.th.push({
              name: `${i + 1}0`,
              width: '60px',
            })
          }
        }
        data.th.push({ name: '个人成绩', width: '80px' }, { name: '总环数', width: '80px' })
        if (result && result.scoreList.length != 0) {
          result.scoreList.forEach((item, index) => {
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
              data.listsList.push(obj)
            })
          })
        } else {
          data.listsList = []
        }
        this.$nextTick(() => {
          this.upload()
        })
        this.$forceUpdate()
      })
    },
    // 团队综合排名
    tuandui(data) {
      getTeamTotalScores({
        configName: data.configName,
      }).then((res) => {
        data.projectName = res.result.projectName
        data.contestName = res.result.contestName
        data.addr = res.result.addr
        data.bisaiTime = res.result.time
        data.stageName = res.result.stageName
        data.stageGroup = ''
        data.rankingList = res.result.scoreList
        this.$forceUpdate()
      })
    },
    // 混团
    huntuan(data) {
      getMixeTeamFinalsListAPI({
        screenName: data.configName,
        stageGroup: data.configName.includes('金牌赛') ? 1 : 2,
      }).then((res) => {
        const { result } = res
        data.projectName = result.projectName
        data.stageGroup = result.stageGroup
        data.stageName = result.stageName
        data.contestName = result.contestName
        data.addr = result.addr
        data.bisaiTime = result.time
        this.$forceUpdate()
      })
    },
    getData() {
      this.projectList.forEach((data, index) => {
        if (data.configName.includes('个人资格赛')) {
          this.geren(data, index)
        }
        if (data.configName.includes('个人决赛')) {
          this.gerenjuesaii(data)
        }
        if (data.configName.includes('团体排名')) {
          this.tuanti(data)
        }
        if (data.configName.includes('混团')) {
          this.huntuan(data)
        }
        if (data.configName.includes('综合排名')) {
          this.tuandui(data)
        }
      })
    },
    getList() {
      this.len = false
      this.projectList.forEach((data, index) => {
        if (data.configName.includes('个人资格赛')) {
          this.geren(data, index)
        }
        if (data.configName.includes('个人决赛')) {
          this.gerenjuesaii(data)
        }
        if (data.configName.includes('团体排名')) {
          this.tuanti(data)
        }
        if (data.configName.includes('混团')) {
          this.huntuan(data)
        }
        if (data.configName.includes('综合排名')) {
          this.tuandui(data)
        }
      })
    },
  },
  destroyed() {
    clearInterval(this.time)
    clearInterval(this.timer)
  },
}
</script>

<style scoped lang='less'>
@height: 46px;

.xiahuaxian {
  text-decoration: underline;
}

.targetImage {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  //height: 460px;
  flex: 1;

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
    width: 220px;
    height: 220px;
    overflow: hidden;
    border-radius: 50%;

    .box {
      display: flex;
      align-items: center;
      justify-content: center;
      //position: relative;

      .shouqiang {
        position: absolute;
        top: -20px;
        width: 250px;
        height: 250px;
      }
    }
  }
}

/*.targetImage1 {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  overflow: hidden;
  width: 100%;
  height: 470px;

  .div1 {
    position: relative;
    //flex: 0 0 25%;
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
    width: 250px;
    height: 250px;
    overflow: hidden;
    border-radius: 50%;

    .box1 {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2000px;
      //height: 2000px;

      .shouqiang1 {
        width: 1000px;
        height: 1000px;
      }

      .buqiang1 {
        width: 680px;
        height: 680px;
      }
    }
  }
}*/
.targetImage1{
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  flex: 1;
  .div1{
    width: 25%;
    height: 40%;
    position: relative;
    .name1{
      position: absolute;
    }
    .flex1{
      position: absolute;
      .box1{
        //width: 1000px;
        //height: 1000px;
      }
      .buqiang1{
        position: absolute;
        width: 300px;
        height: 300px;
        top: -265px;
        left: -150px;
        transform-origin: top left;
        transform: scale(2.54);
      }
    }
  }
}
.container {
  flex: 1;
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
  height: 9%;
  font-size: 24px;
  font-weight: 800;
  padding: 30px 30px 10px 30px;

  .top {
    display: flex;
    align-items: start;
    justify-content: space-between;

    .left {
      display: flex;
      font-size: 15px;

      .logo {
        height: 70px;
        margin-top: -20px;
      }
    }

    .right {
      font-size: 15px;
      text-align: right;

      .nameTitle {
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
  font-size: 16px;
  font-weight: 800;
  height: 45px;
  line-height: 40px;
  margin-bottom: 5px;
  border-bottom: 2px solid #2174b6;

  & > div {
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
  color: rgb(247, 255, 214);

  div {
    text-align: center;
    font-size: 20px;
    // font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.taotai {
  color: rgb(112, 112, 112) !important;
}

.tongfen {
  color: #ff0000 !important;
}

.foot {
  height: calc(100% - 10% - (@height * 8) - 40px);
  overflow: hidden;
}

.foots {
  height: calc(100% - 10% - 40px);
  overflow: hidden;
}

.spanDiv {
  width: 45px;
  height: 1px;
  background: #fff;
  text-align: center;
  position: absolute;
  bottom: 10%;
  left: 22%;
}
</style>