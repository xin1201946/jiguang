<template>
  <svg ref="svg" width="100%" height="100%" viewBox="0 0 630 630">
    <g class="target">
      <circle r="85" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="235" font-size="8">1</text>
        <text fill="#333" text-anchor="middle" x="315" y="399" font-size="8">1</text>
        <text fill="#333" text-anchor="middle" x="234" y="318" font-size="8">1</text>
        <text fill="#333" text-anchor="middle" x="396" y="318" font-size="8">1</text>
      </g>
      <circle r="76.5" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="244" font-size="8">2</text>
        <text fill="#333" text-anchor="middle" x="315" y="390.5" font-size="8">2</text>
        <text fill="#333" text-anchor="middle" x="242.5" y="318" font-size="8">2</text>
        <text fill="#333" text-anchor="middle" x="387" y="318" font-size="8">2</text>
      </g>
      <circle r="68" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="253" font-size="8">3</text>
        <text fill="#333" text-anchor="middle" x="315" y="382" font-size="8">3</text>
        <text fill="#333" text-anchor="middle" x="251" y="318" font-size="8">3</text>
        <text fill="#333" text-anchor="middle" x="378" y="318" font-size="8">3</text>
      </g>
      <circle r="59.5" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="262" font-size="8">4</text>
        <text text-anchor="middle" x="315" y="374" font-size="8">4</text>
        <text text-anchor="middle" x="259.5" y="318" font-size="8">4</text>
        <text text-anchor="middle" x="370" y="318" font-size="8">4</text>
      </g>
      <circle r="51" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="271" font-size="8">5</text>
        <text text-anchor="middle" x="315" y="365" font-size="8">5</text>
        <text text-anchor="middle" x="268" y="318" font-size="8">5</text>
        <text text-anchor="middle" x="362" y="318" font-size="8">5</text>
      </g>
      <circle r="42.5" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="280" font-size="8">6</text>
        <text text-anchor="middle" x="315" y="356" font-size="8">6</text>
        <text text-anchor="middle" x="276.5" y="318" font-size="8">6</text>
        <text text-anchor="middle" x="353" y="318" font-size="8">6</text>
      </g>
      <circle r="34" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="288" font-size="8">7</text>
        <text text-anchor="middle" x="315" y="347" font-size="8">7</text>
        <text text-anchor="middle" x="285" y="318" font-size="8">7</text>
        <text text-anchor="middle" x="344" y="318" font-size="8">7</text>
      </g>
      <circle r="25.5" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="297" font-size="8">8</text>
        <text text-anchor="middle" x="315" y="339" font-size="8">8</text>
        <text text-anchor="middle" x="293.5" y="318" font-size="8">8</text>
        <text text-anchor="middle" x="336" y="318" font-size="8">8</text>
      </g>
      <circle r="17" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="306" font-size="8">9</text>
        <text text-anchor="middle" x="315" y="331" font-size="8">9</text>
        <text text-anchor="middle" x="302" y="318" font-size="8">9</text>
        <text text-anchor="middle" x="328" y="318" font-size="8">9</text>
      </g>
      <circle r="8.5" cx="315" cy="315"></circle>
      <g>
        <circle class="zhongxin" r="4" cx="315" cy="315" ></circle>
        <!-- <text text-anchor="middle" dominant-baseline="middle" x="315" y="315" font-size="20">·</text> -->
      </g>
    </g>
    <g class="dot" v-for="(item, i) in dots" :key="i">
      <circle :r="state.indexOf('手枪') != -1 ? '8.5':'4'" :fill="i == dots.length -1 ? '#D2D66D' : '#09BEEA'" :cx="item.x_coord * 3.938" :cy="(160 - item.y_coord) * 3.938">
      </circle>
      <text text-anchor="middle" dominant-baseline="middle" :x="item.x_coord * 3.938" :y="(160-item.y_coord) * 3.938" font-size="8" fill="#000">{{item.shootCode}}</text>
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
.zhongxin{
  stroke: #fff !important;
  fill: #364471 !important;
}
</style>