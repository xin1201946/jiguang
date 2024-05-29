<template>
  <svg ref="svg" width="100%" height="100%" viewBox="0 0 630 630">
    <g class="target">
      <circle r="310" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="33" font-size="28">1</text>
        <text fill="#333" text-anchor="middle" x="315" y="618" font-size="28">1</text>
        <text fill="#333" text-anchor="middle" x="25" y="320" font-size="28">1</text>
        <text fill="#333" text-anchor="middle" x="605" y="320" font-size="28">1</text>
      </g>
      <circle r="279" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="63" font-size="28">2</text>
        <text fill="#333" text-anchor="middle" x="315" y="588" font-size="28">2</text>
        <text fill="#333" text-anchor="middle" x="55" y="320" font-size="28">2</text>
        <text fill="#333" text-anchor="middle" x="575" y="320" font-size="28">2</text>
      </g>
      <circle r="248" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="93" font-size="28">3</text>
        <text fill="#333" text-anchor="middle" x="315" y="558" font-size="28">3</text>
        <text fill="#333" text-anchor="middle" x="85" y="320" font-size="28">3</text>
        <text fill="#333" text-anchor="middle" x="545" y="320" font-size="28">3</text>
      </g>
      <circle r="217" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="128" font-size="28">4</text>
        <text text-anchor="middle" x="315" y="523" font-size="28">4</text>
        <text text-anchor="middle" x="115" y="320" font-size="28">4</text>
        <text text-anchor="middle" x="515" y="320" font-size="28">4</text>
      </g>
      <circle r="186" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="158" font-size="28">5</text>
        <text text-anchor="middle" x="315" y="493" font-size="28">5</text>
        <text text-anchor="middle" x="145" y="320" font-size="28">5</text>
        <text text-anchor="middle" x="485" y="320" font-size="28">5</text>
      </g>
      <circle r="155" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="188" font-size="28">6</text>
        <text text-anchor="middle" x="315" y="463" font-size="28">6</text>
        <text text-anchor="middle" x="175" y="320" font-size="28">6</text>
        <text text-anchor="middle" x="455" y="320" font-size="28">6</text>
      </g>
      <circle r="124" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="218" font-size="28">7</text>
        <text text-anchor="middle" x="315" y="433" font-size="28">7</text>
        <text text-anchor="middle" x="205" y="320" font-size="28">7</text>
        <text text-anchor="middle" x="425" y="320" font-size="28">7</text>
      </g>
      <circle r="93" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="248" font-size="28">8</text>
        <text text-anchor="middle" x="315" y="403" font-size="28">8</text>
        <text text-anchor="middle" x="235" y="320" font-size="28">8</text>
        <text text-anchor="middle" x="395" y="320" font-size="28">8</text>
      </g>
      <circle r="62" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="278" font-size="28">9</text>
        <text text-anchor="middle" x="315" y="373" font-size="28">9</text>
        <text text-anchor="middle" x="265" y="320" font-size="28">9</text>
        <text text-anchor="middle" x="365" y="320" font-size="28">9</text>
      </g>
      <circle r="31" cx="315" cy="315"></circle>
      <g>
        <circle class="zhongxin" r="10" cx="315" cy="315"></circle>
        <!-- <text text-anchor="middle" dominant-baseline="middle" x="315" y="315" font-size="20">·</text> -->
      </g>
    </g>
    <g class="dot" v-for="(item, i) in dots" :key="i">
      <circle :r="state.indexOf('手枪') != -1 ? '20':'4'" :fill="i == dots.length -1 ? '#D2D66D' : '#09BEEA'" :cx="item.x_coord * 3.938" :cy="(160 - item.y_coord) * 3.938">
      </circle>
      <text text-anchor="middle" dominant-baseline="middle" :x="item.x_coord * 3.938" :y="(160-item.y_coord) * 3.938" font-size="28" fill="#000">{{item.shootCode}}</text>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    dots: {
      type: [Object, Array],
    },
    state: {
      type: String,
    },
  },
  name: 'echarTarget',
  data() {
    return {}
  },
  mounted() {
    const svg = this.$refs.svg
    console.log(svg.getBoundingClientRect())
  },
  methods: {
    /**
     * @function setOption 设置射击点
     * @param option
     */
    setOption(option) {
      this.dots = option
    },
  },
}
</script>

<style scoped lang="less">
* {
  user-select: none;
}
.dian {
  width: 100px;
  height: 100px;
  background: red;
}
.target {
  circle {
    stroke-width: 1;
    fill: transparent;
  }
  circle:nth-of-type(1),
  circle:nth-of-type(2),
  circle:nth-of-type(3),
  circle:nth-of-type(4),
  circle:nth-of-type(5),
  circle:nth-of-type(6) {
    stroke: #333;
    fill: #c1d9fe;
  }
  circle:nth-of-type(7) {
    fill: #364471;
    stroke: #8f94a2;
  }
  circle:nth-of-type(7),
  circle:nth-of-type(8),
  circle:nth-of-type(9),
  circle:nth-of-type(10) {
    stroke: #fff;
  }
  g:nth-of-type(7),
  g:nth-of-type(8),
  g:nth-of-type(9),
  g:nth-of-type(10) {
    text {
      fill: #fff;
    }
  }
}
.zhongxin {
  stroke: #fff !important;
  fill: #364471 !important;
}
</style>