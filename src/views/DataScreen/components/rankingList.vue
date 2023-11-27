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
          <div>
            <p style="color: #ef2928">①</p>
            <p>某某队</p>
            <p>100</p>
          </div>
          <div>
            <p style="color: #ffc21f">②</p>
            <p>某某队</p>
            <p>98</p>
          </div>
          <div>
            <p style="color: #7ec4ff">③</p>
            <p>某某队</p>
            <p>88</p>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="title">
          <p>排名</p>
          <p>代表队</p>
          <p>总分</p>
        </div>
        <div class="content">
          <div>
            <p>4</p>
            <p>某某队</p>
            <p>77</p>
          </div>
          <div>
            <p>5</p>
            <p>某某队</p>
            <p>66</p>
          </div>
          <div>
            <p>6</p>
            <p>某某队</p>
            <p>65</p>
          </div>
          <div>
            <p>7</p>
            <p>某某队</p>
            <p>64</p>
          </div>
        </div>
      </div>
    </div>
    <div class="podium">
      <div class="two">
        <p>某某队</p>
        <span>2</span>
      </div>
      <div class="one">
        <p>某某队</p>
        <span>1</span>
      </div>
      <div class="three">
        <p>某某队</p>
        <span>3</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {}
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
          font-size: 30px;
        }
      }
      .content {
        div {
          display: flex;
          width: 100%;
          p {
            flex: 1;
            text-align: center;
            font-size: 26px;
          }
        }
      }
    }
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
      height: 100px;
      text-align: center;
      line-height: 100px;
      font-size: 30px;
      font-weight: bolder;
      background: linear-gradient(to bottom, #ef2928, transparent);
      p {
        position: absolute;
        left: 50%;
        top: -100%;
        transform: translateX(-50%);
      }
    }
    .two {
      position: relative;
      width: 32%;
      height: 100px;
      text-align: center;
      line-height: 100px;
      font-size: 30px;
      font-weight: bolder;
      margin-top: 30px;
      background: linear-gradient(to bottom, #ffc21f, transparent);
      p {
        position: absolute;
        left: 50%;
        top: -100%;
        transform: translateX(-50%);
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
        top: -100%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>