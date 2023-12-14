<template>
  <dv-border-box-8 :dur="20" class="DataScreen container">
    <div class="box_box">
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
      <!--    个人资格赛表头-->
      <div class='th'>
        <div v-for='(item, i) in th' :key='i'
          :style="`width:${item.width};flex:${item.width ? 'none' : '1'};text-align:${item.align ? item.align : 'center'}`">
          {{ item.name }}
        </div>
      </div>
      <div style="width: 100%;height: 100%;" v-if="shootGroups < 5">
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
              <div style="flex: 1;">{{ item.notes }}</div>
              <div style="width: 60px">{{ item.bePromoted }}</div>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 100%;height: 100%;" v-else>
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
            <div style="flex: 1;">{{ item.notes }}</div>
            <div style="width: 60px">{{ item.bePromoted }}</div>
          </div>
        </div>
        <!-- 后半页滚动 -->
        <div class="foot" ref="scorllBox">
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
        </div>
      </div>
    </div>
  </dv-border-box-8>
</template>

<script>
import { getMixeTeamFinalsListAPI, getTeamScoresAPI, getTeamTotalScores, littleScreen } from '@api/competition'
import Display from '@views/control/display/index.vue'

export default {
  name: 'dataScreen',
  components: { Display },
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
    }
  },
  computed: {
    logoTitle() {
      const data = JSON.parse(window.name)
      const configName = data.configName
      if (configName.includes("个人资格赛")) {
        return "个人成绩"
      }

    }
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
      const arr2 = document.createElement("div")
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
    // 个人
    geren(old) {
      littleScreen({
        type: this.data.configName
      }).then(res => {
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
            align: 'left'
          },
        ]
        if (result.shootGroups) {
          this.shootGroups = result.shootGroups
          for (let i = 0; i < result.shootGroups; i++) {
            this.th.push({
              name: `${i + 1}0`,
              width: '80px'
            })
          }
        }
        this.th.push({ name: '总环数', width: '150px' }, { name: '备注' }, { name: '-', width: '60px', })
        console.log(old === "old")
        if (old === "old") {
          this.oldList = result.players
        }
        // 判断到没有到50发
        if (result.shootGroups) {
          this.shootGroups = result.shootGroups
          if (this.shootGroups < 5) {
            this.listsList = result.players.map(item => {
              return {
                ...item,
                total: result.isGood === '是' ? `${item.totalScore}-${item.good}x` : item.totalScore,
                notes: '---',
                bePromoted: '',
              }
            })
          } else {
            // 设置前8名
            this.finalEight = result.players.filter(item => item.rank <= 8).map((item, i) => {
              return {
                ...item,
                total: result.isGood === '是' ? `${item.totalScore}-${item.good}x` : item.totalScore,
                notes: '备注.费电还是看会看多少个备注.费电还是看会看多少个备注.费电还是看会看多少个',
                bePromoted: 'Q',
              }
            })
            // 除了前8名
            this.list = result.players.filter(item => item.rank > 8).map(item => {
              return {
                ...item,
                total: result.isGood === '是' ? `${item.totalScore}-${item.good}x` : item.totalScore,
                notes: '---',
                bePromoted: '',
              }
            })
          }
        }
        this.$nextTick(() => {
          this.upload()
        })
      })
    },
    // 团体
    tuanti() {
      getTeamScoresAPI({
        screenName: this.data.configName
      })
    },
    // 团队
    tuandui() {
      getTeamTotalScores({
        configName: this.data.configName,
      })
    },
    // 混团
    huntuan() {
      getMixeTeamFinalsListAPI({
        screenName: this.data.configName,
        stageGroup: this.data.configName.includes('金牌赛') ? 1 : 2,
      })
    },
    getData() {
      const data = JSON.parse(window.name)
      if (data.configName.includes("个人")) {
        this.geren()
      }
      if (data.configName.includes("团体")) {
        this.tuanti()
      }
      if (data.configName.includes("混团")) {
        this.huntuan()
      }
      if (data.configName.includes("团队")) {
        this.tuandui()
      }
    },
    getList() {
      const data = JSON.parse(window.name)
      if (data.configName.includes("个人")) {
        this.geren("old")
      }
      if (data.configName.includes("团体")) {
        this.tuanti()
      }
      if (data.configName.includes("混团")) {
        this.huntuan()
      }
      if (data.configName.includes("团队")) {
        this.tuandui()
      }
    }
  }
}
</script>

<style scoped lang='less'>
@height: 46px;

.container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: #001441;
  box-sizing: border-box;
  color: #fff;
  border: 2px solid #2174B6;
}
.box_box{
  width:100%;
  height: 100%;
  padding: 30px 30px 10px 30px;
  // border: 2px solid #2174B6;
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

.th {
  display: flex;
  justify-content: space-between;
  font-size: 26px;
  font-weight: 800;
  height: 45px;
  line-height: 40px;
  margin-bottom: 5px;
  border-bottom: 2px solid #2174B6;

  &>div {
    flex: 1;
    text-align: center;
  }
}

.finalEight {
  // display: flex;
  // justify-content: space-between;
  padding-bottom: 5px;
  border-bottom: 2px solid #2174B6;
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