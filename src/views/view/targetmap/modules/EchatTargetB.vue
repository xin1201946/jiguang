<template>
  <svg ref="svg" width="100%" height="100%" viewBox="0 0 630 630">
    <g class="target">
      <circle r="95" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="228" font-size="8">1</text>
        <text fill="#333" text-anchor="middle" x="315" y="408" font-size="8">1</text>
        <text fill="#333" text-anchor="middle" x="225" y="318" font-size="8">1</text>
        <text fill="#333" text-anchor="middle" x="405" y="318" font-size="8">1</text>
      </g>
      <circle r="85" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="238" font-size="8">2</text>
        <text fill="#333" text-anchor="middle" x="315" y="398" font-size="8">2</text>
        <text fill="#333" text-anchor="middle" x="235" y="318" font-size="8">2</text>
        <text fill="#333" text-anchor="middle" x="395" y="318" font-size="8">2</text>
      </g>
      <circle r="75" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="248" font-size="8">3</text>
        <text fill="#333" text-anchor="middle" x="315" y="388" font-size="8">3</text>
        <text fill="#333" text-anchor="middle" x="245" y="318" font-size="8">3</text>
        <text fill="#333" text-anchor="middle" x="385" y="318" font-size="8">3</text>
      </g>
      <circle r="65" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="258" font-size="8">4</text>
        <text text-anchor="middle" x="315" y="378" font-size="8">4</text>
        <text text-anchor="middle" x="255" y="318" font-size="8">4</text>
        <text text-anchor="middle" x="375" y="318" font-size="8">4</text>
      </g>
      <circle r="55" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="268" font-size="8">5</text>
        <text text-anchor="middle" x="315" y="368" font-size="8">5</text>
        <text text-anchor="middle" x="265" y="318" font-size="8">5</text>
        <text text-anchor="middle" x="365" y="318" font-size="8">5</text>
      </g>
      <circle r="45" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="278" font-size="8">6</text>
        <text text-anchor="middle" x="315" y="358" font-size="8">6</text>
        <text text-anchor="middle" x="275" y="318" font-size="8">6</text>
        <text text-anchor="middle" x="355" y="318" font-size="8">6</text>
      </g>
      <circle r="35" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="288" font-size="8">7</text>
        <text text-anchor="middle" x="315" y="348" font-size="8">7</text>
        <text text-anchor="middle" x="285" y="318" font-size="8">7</text>
        <text text-anchor="middle" x="345" y="318" font-size="8">7</text>
      </g>
      <circle r="25" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="298" font-size="8">8</text>
        <text text-anchor="middle" x="315" y="338" font-size="8">8</text>
        <text text-anchor="middle" x="295" y="318" font-size="8">8</text>
        <text text-anchor="middle" x="335" y="318" font-size="8">8</text>
      </g>
      <circle r="15" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="308" font-size="8">9</text>
        <text text-anchor="middle" x="315" y="328" font-size="8">9</text>
        <text text-anchor="middle" x="305" y="318" font-size="8">9</text>
        <text text-anchor="middle" x="325" y="318" font-size="8">9</text>
      </g>
      <circle r="5" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" dominant-baseline="middle" x="315" y="316" font-size="20">·</text>
      </g>
    </g>
    <g class="dot" v-for="(item, i) in dots" :key="i">
      <circle :cx="item.x_coord * 3.938" :cy="(160 - item.y_coord) * 3.938" :r="state.indexOf('手枪') != -1 ? '8.5':'4'" :fill="i == dots.length -1 ? '#D2D66D' : '#09BEEA'">
      </circle>
      <text :x="item.x_coord * 3.938" :y="(160-item.y_coord) * 3.938" text-anchor="middle" dominant-baseline="middle" font-size="6" fill="#000">{{item.shootCode}}</text>
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
  circle:nth-of-type(3) {
    stroke: #333;
    fill: #C1D9FE
  }
  circle:nth-of-type(4) {
    fill: #364471;
    stroke: #8f94a2;
  }
  circle:nth-of-type(5),
  circle:nth-of-type(6),
  circle:nth-of-type(7),
  circle:nth-of-type(8),
  circle:nth-of-type(9),
  circle:nth-of-type(10) {
    stroke: #fff;
  }
  g:nth-of-type(4),
  g:nth-of-type(5),
  g:nth-of-type(6),
  g:nth-of-type(7),
  g:nth-of-type(8),
  g:nth-of-type(9),
  g:nth-of-type(10) {
    text {
      fill: #fff;
    }
  }
}
</style>