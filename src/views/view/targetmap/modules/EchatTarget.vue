<template>
  <svg ref="svg" width="100%" height="100%" viewBox="0 0 630 630">
    <g class="target">
      <circle r="314" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="18" font-size="18">1</text>
        <text text-anchor="middle" x="315" y="618" font-size="18">1</text>
        <text text-anchor="middle" x="15" y="318" font-size="18">1</text>
        <text text-anchor="middle" x="615" y="318" font-size="18">1</text>
      </g>
      <circle r="284" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="52" font-size="18">2</text>
        <text text-anchor="middle" x="315" y="590" font-size="18">2</text>
        <text text-anchor="middle" x="46" y="318" font-size="18">2</text>
        <text text-anchor="middle" x="584" y="318" font-size="18">2</text>
      </g>
      <circle r="254" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="84" font-size="18">3</text>
        <text text-anchor="middle" x="315" y="560" font-size="18">3</text>
        <text text-anchor="middle" x="76" y="318" font-size="18">3</text>
        <text text-anchor="middle" x="554" y="318" font-size="18">3</text>
      </g>
      <circle r="224" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="114" font-size="18">4</text>
        <text text-anchor="middle" x="315" y="530" font-size="18">4</text>
        <text text-anchor="middle" x="106" y="318" font-size="18">4</text>
        <text text-anchor="middle" x="524" y="318" font-size="18">4</text>
      </g>
      <circle r="194" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="144" font-size="18">5</text>
        <text text-anchor="middle" x="315" y="500" font-size="18">5</text>
        <text text-anchor="middle" x="136" y="318" font-size="18">5</text>
        <text text-anchor="middle" x="494" y="318" font-size="18">5</text>
      </g>
      <circle r="164" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="174" font-size="18">6</text>
        <text text-anchor="middle" x="315" y="470" font-size="18">6</text>
        <text text-anchor="middle" x="166" y="318" font-size="18">6</text>
        <text text-anchor="middle" x="464" y="318" font-size="18">6</text>
      </g>
      <circle r="134" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="204" font-size="18">7</text>
        <text text-anchor="middle" x="315" y="440" font-size="18">7</text>
        <text text-anchor="middle" x="196" y="318" font-size="18">7</text>
        <text text-anchor="middle" x="434" y="318" font-size="18">7</text>
      </g>
      <circle r="104" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="234" font-size="18">8</text>
        <text text-anchor="middle" x="315" y="410" font-size="18">8</text>
        <text text-anchor="middle" x="226" y="318" font-size="18">8</text>
        <text text-anchor="middle" x="404" y="318" font-size="18">8</text>
      </g>
      <circle r="74" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="264" font-size="18">9</text>
        <text text-anchor="middle" x="315" y="380" font-size="18">9</text>
        <text text-anchor="middle" x="256" y="318" font-size="18">9</text>
        <text text-anchor="middle" x="374" y="318" font-size="18">9</text>
      </g>
      <circle r="44" cx="315" cy="315"></circle>
      <g>
        <text text-anchor="middle" x="315" y="322" font-size="18">10</text>
      </g>
    </g>
    <g class="dot">
      <circle v-for="(item, i) in dots" :key="i" :r="state.indexOf('手枪') != -1 ? '44':'8'" fill="red" :cx="item.x_coord * 3.94" :cy="item.y_coord * 3.94">
      </circle>
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
    stroke-width: 6;
    fill: transparent;
  }
  circle:nth-of-type(1),
  circle:nth-of-type(2),
  circle:nth-of-type(3) {
    stroke: #ccc;
  }
  circle:nth-of-type(4) {
    fill: #8f94a2;
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