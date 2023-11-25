<template>
  <dv-border-box-8 :dur="20" class="DataScreen container">
    <!-- 头部 -->
    <div class="head">
      <div class="left">
        <img class="logo" src="../../assets/logo1.png" alt="" />
        <div>
          <h1 class="theme">2023年河北省青少年射击个人锦标赛（步手枪项目）河北省-保定市</h1>
          <h1 class="title">{{ stageName }}-{{ projectName }}</h1>
        </div>
      </div>
      <div class="right">
        <h1 class="state">{{ state }}</h1>
      </div>
      <dv-decoration-10 style="width: 100%; height: 5px" />
    </div>
    <!-- 抽签 -->
    <div class="example" v-if="!isSpin && state == '抽签'">
      <!-- <a-icon type="loading" class="loading" /> -->
      <dv-decoration-9 style="width: 300px; height: 300px"></dv-decoration-9>
      <p>正在抽签中...请稍后！</p>
    </div>
    <div class="draw" v-if="isSpin && state == '抽签'">
      <a-carousel ref="draw1" style="width: 49%; min-height: 100%">
        <div>
          <TableListVue :TitleList="drawList.title" :List="drawList.List[0]" />
        </div>
        <div>
          <TableListVue :TitleList="drawList.title" :List="drawList.List[1]" />
        </div>
      </a-carousel>
      <a-carousel ref="draw2" style="width: 49%; min-height: 100%">
        <div>
          <TableListVue :TitleList="drawList.title" :List="drawList.List2[0]" />
        </div>
        <div>
          <TableListVue :TitleList="drawList.title" :List="drawList.List2[1]" />
        </div>
      </a-carousel>
    </div>
    <!-- 个人赛 -->
    <div class="personallyLoading" v-if="state == '个人赛' && !isPersonally">
      <div>即将开始</div>
      <div>2023年河北省青少年射击个人锦标赛（步手枪项目）</div>
      <div>
        {{ stageName }}-{{ projectName }}
        <dv-decoration-9 style="width: 300px; height: 300px; font-size: 20px">加载中</dv-decoration-9>
      </div>
    </div>
    <div class="personally" v-if="state == '个人赛' && isPersonally">
      <a-carousel ref="personally1" style="width: 100%; min-height: 100%">
        <div>
          <TableListVue :TitleList="personallyList.title" :List="personallyList.List[0]" />
        </div>
        <div>
          <TableListVue :TitleList="personallyList.title" :List="personallyList.List[1]" />
        </div>
        <div>
          <TableListVue :TitleList="personallyList.title" :List="personallyList.List[2]" />
        </div>
      </a-carousel>
    </div>
    <!-- 团队赛 -->
    <div class="teamLoading" v-if="state == '团队赛' && !isTeam">
      <div>即将开始</div>
      <div>2023年河北省青少年射击团队锦标赛（步手枪项目）</div>
      <div>
        资格赛-混团赛10米气步枪 甲组A轮试射
        <dv-decoration-9 style="width: 300px; height: 300px; font-size: 20px">加载中</dv-decoration-9>
      </div>
    </div>
    <div class="team" v-if="state == '团队赛' && isTeam">
      <a-carousel ref="personally1" style="width: 100%; min-height: 100%">
        <div>
          <TableListVue :TitleList="teamList.title" :List="teamList.List[0]" />
        </div>
        <div>
          <TableListVue :TitleList="teamList.title" :List="teamList.List[1]" />
        </div>
      </a-carousel>
    </div>
  </dv-border-box-8>
</template>

<script>
import { littleScreen } from '@api/competition'
import TableListVue from './components/tableList.vue'
export default {
  components: { TableListVue },
  data() {
    return {
      projectName: '',
      stageGroup: '',
      shootGroups: '',
      stageName: '',
      state: '个人赛',

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

      isPersonally: false,
      personallyList: {
        title: [],
        List: [
          [],
          [],
          [],
          []
        ],
      },

      isTeam: false,
      teamList: {
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
            name: '10',
            width: '150px',
          },
          {
            name: '20',
            width: '150px',
          },
          {
            name: '30',
            width: '150px',
          },
          {
            name: '40',
            width: '150px',
          },
          {
            name: '50',
          },
          {
            name: '60',
          },
          {
            name: '总分',
          },
        ],
        List: [
          [
            {
              排名: 1,
              代表队: '团队1',
              靶位: '姓名1',
              姓名: '10',
              '发序/环数': '10',
              总环数: '10',
            },
            {
              排名: 1,
              代表队: '团队1',
              靶位: '姓名1',
              姓名: '10',
              '发序/环数': '10',
              总环数: '10',
            },
            {
              排名: 1,
              代表队: '团队1',
              靶位: '姓名1',
              姓名: '10',
              '发序/环数': '10',
              总环数: '10',
            },
            {
              排名: 1,
              代表队: '团队1',
              靶位: '姓名1',
              姓名: '10',
              '发序/环数': '10',
              总环数: '10',
            },
            {
              排名: 1,
              代表队: '团队1',
              靶位: '姓名1',
              姓名: '10',
              '发序/环数': '10',
              总环数: '10',
            },
            {
              排名: 1,
              代表队: '团队1',
              靶位: '姓名1',
              姓名: '10',
              '发序/环数': '10',
              总环数: '10',
            },
            {
              排名: 1,
              代表队: '团队1',
              靶位: '姓名1',
              姓名: '10',
              '发序/环数': '10',
              总环数: '10',
            },
            {
              排名: 1,
              代表队: '团队1',
              靶位: '姓名1',
              姓名: '10',
              '发序/环数': '10',
              总环数: '10',
            },
          ],
          [
            {
              排名: 1,
              代表队: '团队1',
              靶位: '姓名1',
              姓名: '10',
              '发序/环数': '10',
              总环数: '10',
            },
            {
              排名: 1,
              代表队: '团队1',
              靶位: '姓名1',
              姓名: '10',
              '发序/环数': '10',
              总环数: '10',
            },
            {
              排名: 1,
              代表队: '团队1',
              靶位: '姓名1',
              姓名: '10',
              '发序/环数': '10',
              总环数: '10',
            },
            {
              排名: 1,
              代表队: '团队1',
              靶位: '姓名1',
              姓名: '10',
              '发序/环数': '10',
              总环数: '10',
            },
          ],
        ],
      },

      timer: null,
    }
  },
  created() {
    this.getData()
    setTimeout(() => {
      this.isSpin = true
      this.isTeam = true
      this.isPersonally = true
      this.$nextTick(() => {
        // if (this.$refs.draw1) {
        //   setInterval(() => {
        //     this.$refs.draw1.next()
        //   }, 10000)
        // }
        // if (this.$refs.draw2) {
        //   setInterval(() => {
        //     this.$refs.draw2.next()
        //   }, 10000)
        // }
        // if (this.$refs.personally1) {
        //   setInterval(() => {
        //     this.$refs.personally1.next()
        //   }, 10000)
        // }
        // if (this.$refs.personally2) {
        //   setInterval(() => {
        //     this.$refs.personally2.next()
        //   }, 10000)
        // }
        this.timer = setInterval(() => {
          this.getData()
        }, 3000)
      })
    }, 3000)
  },
  methods: {
    getData() {
      littleScreen({ type: '手' }).then((res) => {
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
          let arr = [8, 16, 24, 32, 40]
          let obj = {
            id: item.playerName,
            排名: item.rank,
            代表队: item.groupName,
            靶位: item.targetSite,
            姓名: item.playerName,
            总环数: item.total + '_x' + item.good,
          }
          item.groupList.forEach((e, index) => {
            obj[`${index + 1}0`] = e.gunGroupTotal
          })
          if (index + 1 < 8) {
            this.personallyList.List[0].push(obj)
          } else if (index + 1 < 16 && index + 1 > 7) {
            this.personallyList.List[1].push(obj)
          } else if (index + 1 < 24 && index + 1 > 15) {
            this.personallyList.List[2].push(obj)
          } else if (index + 1 < 32 && index + 1 > 23) {
            this.personallyList.List[3].push(obj)
          }
        })
      })
    },
  },
  destroyed() {
    clearInterval(this.timer)
  },
}
</script>

<style scoped lang="less">
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  // background: radial-gradient(rgb(30, 61, 163) 15.4639%, rgb(1, 9, 43) 99.4845%);
  background: url(https://img.tukuppt.com/bg_grid/00/09/33/MLOtOYiX7W.jpg%21/fh/350) no-repeat center center/cover;

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
.personally {
  display: flex;
  justify-content: space-between;
}
.team {
  display: flex;
  justify-content: space-between;
}
.textLoading,
.teamLoading,
.personallyLoading {
  line-height: 150px;
  font-weight: 1000;
  font-size: 70px;
}
/deep/ .ant-carousel .slick-dots-bottom {
  bottom: 0%;
}
</style>