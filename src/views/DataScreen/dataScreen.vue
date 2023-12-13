<template>
  <dv-border-box-8 :dur="20" class="DataScreen container">
    <div class="head">
      <div class='top'>
        <div class="left">
          <img class="logo" src="../../assets/logo1.png" alt="" />
          <div>
            {{data.configName}}
          </div>
        </div>
        <div class='right'>
          <div>
            <div>比赛名称</div>
            <div>地点</div>
          </div>
        </div>
      </div>
      <div class='bottom'>
        <div>{{ logoTitle }}</div>
        <div>年月日开始时间</div>
      </div>
    </div>
<!--    个人资格赛表头-->
    <div class='th'>
      <div v-for='(item, i) in th' :key='i' :style="{width: item.width || `calc((100% - 80px) / ${th.length -1} )`}">
        {{item.name}}
      </div>
    </div>
<!--    前8位-->
    <div class='finalEight'>
      <div v-for="(item, i) in finalEight" :key="i" class="finalEightRow">
        <div style="width: 80px">{{item.rank}}</div>
        <div :style="{width: `calc((100% - 80px) / ${th.length -1} )`}">{{ item.targetSite }}</div>
        <div :style="{width: `calc((100% - 80px) / ${th.length -1} )`}">{{ item.playerName }}</div>
        <div :style="{width: `calc((100% - 80px) / ${th.length -1} )`}">{{ item.groupName }}</div>
        <div v-for="k in shootGroups" :key="k" :style="{width: `calc((100% - 80px) / ${th.length -1} )`}">
          {{item.groupList[k - 1] && item.groupList[k - 1].groupTotal}}
        </div>
        <div :style="{width: `calc((100% - 80px) / ${th.length -1} )`}">{{ item.total }}</div>
        <div :style="{width: `calc((100% - 80px) / ${th.length -1} )`}">Q</div>
      </div>
    </div>
<!--    后面的滚动-->
    <div class="foot" ref="scorllBox">
      <div class="footContent" ref="scorllArr">
        <div v-for="(item, i) in list" :key="i" class="finalEightRow">
          <div style="width: 80px">{{item.rank}}</div>
          <div :style="{width: `calc((100% - 80px) / ${th.length -1} )`}">{{ item.targetSite }}</div>
          <div :style="{width: `calc((100% - 80px) / ${th.length -1} )`}">{{ item.playerName }}</div>
          <div :style="{width: `calc((100% - 80px) / ${th.length -1} )`}">{{ item.groupName }}</div>
          <div v-for="k in shootGroups" :key="k" :style="{width: `calc((100% - 80px) / ${th.length -1} )`}">
            {{item.groupList[k - 1] && item.groupList[k - 1].groupTotal}}
          </div>
          <div :style="{width: `calc((100% - 80px) / ${th.length -1} )`}">{{ item.total }}</div>
          <div :style="{width: `calc((100% - 80px) / ${th.length -1} )`}"></div>
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
      // 高度
      hei: 0,
      // 动画定时器
      animate: undefined
    }
  },
  computed: {
    logoTitle() {
      const data = JSON.parse(window.name)
      const configName = data.configName
      if (configName.includes("个人资格赛")){
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
      function scrolls () {
        box.scrollTop = thit.hei
        if (box.scrollTop > arr.offsetHeight) {
          thit.hei = 0
        }else {
          // 移动速度
          thit.hei += 0.5
        }
        thit.animate = window.requestAnimationFrame(scrolls)
      }
      if (arr.offsetHeight > box.offsetHeight) {
        if (box.children.length < 2){
          box.appendChild(arr2)
        }else {
          box.children[1].innerHTML = arr.innerHTML
        }
        if (this.animate === undefined) {
          scrolls()
        }
      }else {
        box.scrollTop = 0
        if (box.children[1]){
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
        const {result} = res
        // 设置表头
        this.th = [
          {
            name: '排名',
            width: '80px',
          },
          {
            name: '靶位',
          },
          {
            name: '姓名',
          },
          {
            name: '代表队',
          },
        ]
        if (result.shootGroups) {
          this.shootGroups = result.shootGroups
          for (let i = 0; i < result.shootGroups; i++) {
            this.th.push({
              name: `${i + 1}0`,
            })
          }
        }
        this.th.push({ name: '总环数' }, { name: '备注' })
        if (old === "old"){
          this.oldList = result.players
        }
        // 设置前8名
        this.finalEight = result.players.filter(item => item.rank <= 8).map((item,i) => {
          return {
            ...item,
            total: result.isGood === '是' ? `${item.totalScore}-${item.good}x` : item.totalScore
          }
        })
        // 除了前8名
        this.list = result.players.filter(item => item.rank > 8).map(item => {
          return {
            ...item,
            total: result.isGood === '是' ? `${item.totalScore}-${item.good}x` : item.totalScore
          }
        })
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
  padding: 30px;
  box-sizing: border-box;
  color: #fff;
}
.head{
  height: 15%;
  font-size: 24px;
  font-weight: 800;
  .top{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left{
      display: flex;
    }
  }
  .bottom{
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.th{
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  font-weight: 600;
  height: 40px;
  line-height: 40px;
  &>div{
    text-align: center;
  }
}
.finalEight{

}
.finalEightRow{
  display: flex;
  justify-content: space-between;
  height: @height;
  line-height: @height;
  div{
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.foot{
  height: calc(100% - 15% - (@height * 8) - 40px);
  overflow: hidden;
}
</style>