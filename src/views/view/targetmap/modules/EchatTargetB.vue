<template>
  <svg ref="svg" width="100%" height="100%" viewBox="0 0 630 630">
    <g class="target">
      <circle r="91" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="231" font-size="8">1</text>
        <text fill="#333" text-anchor="middle" x="315" y="404" font-size="8">1</text>
        <text fill="#333" text-anchor="middle" x="229" y="318" font-size="8">1</text>
        <text fill="#333" text-anchor="middle" x="401" y="318" font-size="8">1</text>
      </g>
      <circle r="81.8" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="241" font-size="8">2</text>
        <text fill="#333" text-anchor="middle" x="315" y="395" font-size="8">2</text>
        <text fill="#333" text-anchor="middle" x="237" y="318" font-size="8">2</text>
        <text fill="#333" text-anchor="middle" x="392" y="318" font-size="8">2</text>
      </g>
      <circle r="72.6" cx="315" cy="315"></circle>
      <g>
        <text fill="#333" text-anchor="middle" x="315" y="251" font-size="8">3</text>
        <text fill="#333" text-anchor="middle" x="315" y="386" font-size="8">3</text>
        <text fill="#333" text-anchor="middle" x="247" y="318" font-size="8">3</text>
        <text fill="#333" text-anchor="middle" x="382" y="318" font-size="8">3</text>
      </g>
      <circle r="63.4" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="259" font-size="8">4</text>
        <text text-anchor="middle" x="315" y="377" font-size="8">4</text>
        <text text-anchor="middle" x="256" y="318" font-size="8">4</text>
        <text text-anchor="middle" x="372" y="318" font-size="8">4</text>
      </g>
      <circle r="54.2" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="268" font-size="8">5</text>
        <text text-anchor="middle" x="315" y="369" font-size="8">5</text>
        <text text-anchor="middle" x="265" y="318" font-size="8">5</text>
        <text text-anchor="middle" x="364" y="318" font-size="8">5</text>
      </g>
      <circle r="46" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="276" font-size="8">6</text>
        <text text-anchor="middle" x="315" y="359" font-size="8">6</text>
        <text text-anchor="middle" x="274" y="318" font-size="8">6</text>
        <text text-anchor="middle" x="354" y="318" font-size="8">6</text>
      </g>
      <circle r="36.8" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="288" font-size="8">7</text>
        <text text-anchor="middle" x="315" y="351" font-size="8">7</text>
        <text text-anchor="middle" x="285" y="318" font-size="8">7</text>
        <text text-anchor="middle" x="346" y="318" font-size="8">7</text>
      </g>
      <circle r="27.6" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="297" font-size="8">8</text>
        <text text-anchor="middle" x="315" y="339" font-size="8">8</text>
        <text text-anchor="middle" x="293.5" y="318" font-size="8">8</text>
        <text text-anchor="middle" x="337" y="318" font-size="8">8</text>
      </g>
      <circle r="18.4" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="306" font-size="8">9</text>
        <text text-anchor="middle" x="315" y="331" font-size="8">9</text>
        <text text-anchor="middle" x="302" y="318" font-size="8">9</text>
        <text text-anchor="middle" x="328" y="318" font-size="8">9</text>
      </g>
      <circle r="9.2" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" dominant-baseline="middle" x="315" y="315" font-size="20">·</text>
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