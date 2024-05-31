<template>
  <svg ref="svg" width="100%" height="100%" viewBox="0 0 630 630">
    <g class="target">
      <circle r="278" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="58" font-size="28">1</text>
        <text fill="#333" text-anchor="middle" x="315" y="595" font-size="28">1</text>
        <text fill="#333" text-anchor="middle" x="45" y="320" font-size="28">1</text>
        <text fill="#333" text-anchor="middle" x="585" y="320" font-size="28">1</text>
      </g>
      <circle r="252" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="88" font-size="28">2</text>
        <text fill="#333" text-anchor="middle" x="315" y="565" font-size="28">2</text>
        <text fill="#333" text-anchor="middle" x="75" y="320" font-size="28">2</text>
        <text fill="#333" text-anchor="middle" x="555" y="320" font-size="28">2</text>
      </g>
      <circle r="224" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="115" font-size="28">3</text>
        <text fill="#333" text-anchor="middle" x="315" y="540" font-size="28">3</text>
        <text fill="#333" text-anchor="middle" x="105" y="320" font-size="28">3</text>
        <text fill="#333" text-anchor="middle" x="525" y="320" font-size="28">3</text>
      </g>
      <circle r="196" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="145" font-size="28">4</text>
        <text text-anchor="middle" x="315" y="510" font-size="28">4</text>
        <text text-anchor="middle" x="135" y="320" font-size="28">4</text>
        <text text-anchor="middle" x="495" y="320" font-size="28">4</text>
      </g>
      <circle r="168" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="175" font-size="28">5</text>
        <text text-anchor="middle" x="315" y="480" font-size="28">5</text>
        <text text-anchor="middle" x="165" y="320" font-size="28">5</text>
        <text text-anchor="middle" x="465" y="320" font-size="28">5</text>
      </g>
      <circle r="140" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="203" font-size="28">6</text>
        <text text-anchor="middle" x="315" y="450" font-size="28">6</text>
        <text text-anchor="middle" x="195" y="320" font-size="28">6</text>
        <text text-anchor="middle" x="435" y="320" font-size="28">6</text>
      </g>
      <circle r="110" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="233" font-size="28">7</text>
        <text text-anchor="middle" x="315" y="418" font-size="28">7</text>
        <text text-anchor="middle" x="225" y="320" font-size="28">7</text>
        <text text-anchor="middle" x="405" y="320" font-size="28">7</text>
      </g>
      <circle r="76" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="265" font-size="28">8</text>
        <text text-anchor="middle" x="315" y="385" font-size="28">8</text>
        <text text-anchor="middle" x="255" y="320" font-size="28">8</text>
        <text text-anchor="middle" x="375" y="320" font-size="28">8</text>
      </g>
      <circle r="44" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="295" font-size="28">9</text>
        <text text-anchor="middle" x="315" y="355" font-size="28">9</text>
        <text text-anchor="middle" x="285" y="320" font-size="28">9</text>
        <text text-anchor="middle" x="345" y="320" font-size="28">9</text>
      </g>
      <circle r="20" cx="315" cy="315"></circle>
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