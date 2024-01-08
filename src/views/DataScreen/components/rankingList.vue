<template>
  <div class="ranking">
    <div class="list">
      <div class="box">
        <div class="title">
          <p>排名</p>
          <p>代表队</p>
          <p>总分</p>
        </div>
        <div class="content">
          <div v-if="data[0]">
            <p style="color: #ef2928">①</p>
            <p> {{ data[0].groupName }}</p>
            <p>{{ data[0].total }}</p>
          </div>
          <div v-if="data[1]">
            <p style="color: #ffc21f">②</p>
            <p>{{ data[1].groupName }}</p>
            <p>{{ data[1].total }}</p>
          </div>
          <div v-if="data[2]">
            <p style="color: #7ec4ff">③</p>
            <p>{{ data[2].groupName }}</p>
            <p>{{ data[2].total }}</p>
          </div>
        </div>
      </div>
      <div class="box" v-if="this.data.length > 3">
        <div class="title">
          <p>排名</p>
          <p>代表队</p>
          <p>总分</p>
        </div>
        <vueSeamless :classOption="classOption" :data="data" class="content scroll">
          <template v-for="(item, index) in data">
            <div :key="item.groupName" v-if="index > 2">
              <p>{{ index + 1 }}</p>
              <p>{{ item.groupName }}</p>
              <p>{{ item.total }}</p>
            </div>
          </template>
        </vueSeamless>
      </div>
    </div>
    <div class="podium">
      <div class="two">
        <p v-if="data[1]">{{ this.data[1].groupName }}</p>
        <span>2</span>
      </div>
      <div class="one">
        <p v-if="data[0]">{{ this.data[0].groupName }}</p>
        <span>1</span>
      </div>
      <div class="three">
        <p v-if="data[2]">{{ this.data[2].groupName }}</p>
        <span>3</span>
      </div>
    </div>
  </div>
</template>

<script>
import vueSeamless from 'vue-seamless-scroll'
export default {
  components: { vueSeamless },
  props: {
    data: {
      type: [Object, Array],
    },
  },
  data() {
    return {
      classOption: {
        step: 0.3,
        limitMoveNum: 16,
      },
    }
  },
  methods: {},
}
</script>
<style lang="less" scoped>
.ranking {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .list {
    width: 49%;

    .box {
      width: 100%;
      margin-bottom: 50px;

      .title {
        display: flex;
        width: 100%;

        p {
          flex: 1;
          text-align: center;
          font-weight: bolder;
          font-size: 26px;
        }
      }

      .content {
        div {
          display: flex;
          width: 100%;

          p {
            flex: 1;
            text-align: center;
            font-size: 22px;

            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
    }
  }

  .scroll {
    height: 55%;
    overflow: hidden;
  }

  .podium {
    position: relative;
    top: 20%;
    display: flex;
    width: 49%;
    height: 100%;

    .one {
      position: relative;
      width: 32%;
      height: 160px;
      text-align: center;
      line-height: 160px;
      font-size: 30px;
      font-weight: bolder;
      background: linear-gradient(to bottom, #ef2928, transparent);

      p {
        position: absolute;
        left: 50%;
        top: -80%;
        transform: translateX(-50%);
        font-size: 24px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .two {
      position: relative;
      width: 32%;
      height: 130px;
      text-align: center;
      line-height: 130px;
      font-size: 30px;
      font-weight: bolder;
      margin-top: 30px;
      background: linear-gradient(to bottom, #ffc21f, transparent);

      p {
        position: absolute;
        left: 50%;
        top: -80%;
        transform: translateX(-50%);
        font-size: 24px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .three {
      position: relative;
      width: 32%;
      height: 100px;
      text-align: center;
      line-height: 100px;
      font-size: 30px;
      font-weight: bolder;
      margin-top: 60px;
      background: linear-gradient(to bottom, #7ec4ff, transparent);

      p {
        position: absolute;
        left: 50%;
        top: -80%;
        transform: translateX(-50%);
        font-size: 24px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}
</style>