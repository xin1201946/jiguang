<template>
  <svg ref="svg" width="100%" height="100%" viewBox="0 0 630 630">
    <g class="target">
      <circle r="270" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="65" font-size="28">1</text>
        <text fill="#333" text-anchor="middle" x="315" y="580" font-size="28">1</text>
        <text fill="#333" text-anchor="middle" x="60" y="320" font-size="28">1</text>
        <text fill="#333" text-anchor="middle" x="575" y="320" font-size="28">1</text>
      </g>
      <circle r="243" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="95" font-size="28">2</text>
        <text fill="#333" text-anchor="middle" x="315" y="554" font-size="28">2</text>
        <text fill="#333" text-anchor="middle" x="86" y="320" font-size="28">2</text>
        <text fill="#333" text-anchor="middle" x="545" y="320" font-size="28">2</text>
      </g>
      <circle r="216" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="123" font-size="28">3</text>
        <text fill="#333" text-anchor="middle" x="315" y="528" font-size="28">3</text>
        <text fill="#333" text-anchor="middle" x="112" y="320" font-size="28">3</text>
        <text fill="#333" text-anchor="middle" x="515" y="320" font-size="28">3</text>
      </g>
      <circle r="189" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="148" font-size="28">4</text>
        <text text-anchor="middle" x="315" y="500" font-size="28">4</text>
        <text text-anchor="middle" x="140" y="320" font-size="28">4</text>
        <text text-anchor="middle" x="488" y="320" font-size="28">4</text>
      </g>
      <circle r="162" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="178" font-size="28">5</text>
        <text text-anchor="middle" x="315" y="475" font-size="28">5</text>
        <text text-anchor="middle" x="165" y="320" font-size="28">5</text>
        <text text-anchor="middle" x="460" y="320" font-size="28">5</text>
      </g>
      <circle r="135" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="206" font-size="28">6</text>
        <text text-anchor="middle" x="315" y="448" font-size="28">6</text>
        <text text-anchor="middle" x="195" y="320" font-size="28">6</text>
        <text text-anchor="middle" x="435" y="320" font-size="28">6</text>
      </g>
      <circle r="108" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="232" font-size="28">7</text>
        <text text-anchor="middle" x="315" y="418" font-size="28">7</text>
        <text text-anchor="middle" x="220" y="320" font-size="28">7</text>
        <text text-anchor="middle" x="410" y="320" font-size="28">7</text>
      </g>
      <circle r="81" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="258" font-size="28">8</text>
        <text text-anchor="middle" x="315" y="390" font-size="28">8</text>
        <text text-anchor="middle" x="248" y="320" font-size="28">8</text>
        <text text-anchor="middle" x="385" y="320" font-size="28">8</text>
      </g>
      <circle r="54" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="285" font-size="28">9</text>
        <text text-anchor="middle" x="315" y="365" font-size="28">9</text>
        <text text-anchor="middle" x="274" y="320" font-size="28">9</text>
        <text text-anchor="middle" x="355" y="320" font-size="28">9</text>
      </g>
      <circle r="27" cx="315" cy="315"></circle>
      <g>
        <circle class="zhongxin" r="13.5" cx="315" cy="315"></circle>
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
  circle:nth-of-type(3) {
    stroke: #333;
    fill: #c1d9fe;
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
.zhongxin {
  stroke: #fff !important;
  fill: #364471 !important;
}
</style>