<template>
  <div class="boxMixed">
    <!-- 混团信息 -->
    <div class="mixeTeamFinals">
      <a-carousel style="width: 100%; min-height: 100%">
        <div>
          <TableListVue type="混团赛金铜牌赛" :TitleList="mixeTeamFinalsList.title" :List="mixeTeamFinalsList.List[0]" />
        </div>
      </a-carousel>
    </div>
  </div>
</template>

<script>
import { getMixeTeamFinalsListAPI } from '@api/competition'
// 混团赛滚动成绩tabelList
import TableListVue from './../components/tableList.vue'
export default {
  name: 'mixedClusterIndex', //混团金牌铜牌 手枪或步枪
  components: { TableListVue },
  data() {
    return {
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
            width: '140px',
          },
          {
            name: '发序',
          },
          {
            name: '环数',
            width: '160px',
          },
          {
            name: '总环数',
            width: '160px',
          },
          {
            name: '总分',
          },
        ],
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
    const data = JSON.parse(window.name)
    const configName = data.configName
    this.state = configName
    // console.log(data,'123');
    this.getData()
    this.timer = setInterval(() => {
      this.getData()
    }, 3000)
  },
  methods: {
    // 混团列表
    getData() {
      console.log(this.state)
      getMixeTeamFinalsListAPI({
        screenName: this.state,
        stageGroup: this.state.indexOf('金牌赛') ? 1 : 2,
      }).then((res) => {
        this.mixeTeamFinalsList.List = [[]]
        let data = res.result
        // this.projectName = data[0].projectName
        // this.stageName = data[0].stageName
        // this.stageGroup = data[0].projectGroup
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