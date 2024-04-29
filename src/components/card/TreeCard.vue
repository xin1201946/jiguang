<template>
  <div class="treeCard" ref='treeCard'>
<!--    <div v-show='!bool' :class="width ? 'treeCard_width': 'treeCard_tree'">
      <a-card :bordered="false">
        <slot name="tree"></slot>
      </a-card>
    </div>

    <div v-show='bool' class="treeCard_position">
      <a-icon type="appstore" style="font-size: 30px;color: #1890ff;cursor: pointer" />
    </div>-->
    <div :class="width ? 'treeCard_width': 'treeCard_tree'" v-show='!bool'>
      <a-card :bordered="false">

        <div>
          <slot name="tree"></slot>
        </div>
      </a-card>
    </div>
    <div class="treeCard_position">
      <a-icon type="appstore" @click='handleBool' style="cursor: pointer;font-size: 20px;" />
    </div>
    <div class="treeCard_card">
      <div class="example" v-if="loading">
        <a-spin />
      </div>
      <a-card :bordered="false">
        <div style="display: flex;flex-direction: column;height: 100%;overflow-y: auto;overflow-x: hidden">
          <div class="table-page-search-wrapper">
            <slot name="query"></slot>
          </div>
          <div class="table-operator">
            <slot name="operator"></slot>
          </div>
          <div>
            <slot></slot>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'treeCard',
  props: {
    width: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      bool: false
    }
  },
  methods: {
    handleBool () {
      this.bool = !this.bool
    }
  },
  mounted() {
   /* const oberver = new ResizeObserver((entries) => {
      entries.forEach(item => {
        console.log()
        if (item.contentRect.width < 1010) {
          this.bool = true
        }
        else {
          this.bool = false
        }
      })
    })
    oberver.observe(this.$refs.treeCard)*/
  }
}
</script>

<style scoped lang="less">
.example {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
  background: rgba(255, 255, 255, 1);
}
.treeCard {
  display: flex;
  height: 100%;
  padding-bottom: 20px;
  position: relative;
  overflow-y: hidden;
  &_position{
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
    //background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  &_tree {
    min-width: 200px;
    max-width: 400px;
    margin-right: 10px;
    height: 100%;
    overflow-y: hidden;
  }
  &_width {
    min-width: 200px;
    margin-right: 10px;
    height: 100%;
    overflow-y: hidden;
  }
  &_card {
    position: relative;
    height: 100%;
    flex: 1;
    overflow-y: hidden;
  }
  .table {
    overflow-y: auto;
    flex: 1;
    overflow-x: hidden;
  }
  /deep/.ant-card-body {
    height: 100%;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  /deep/.ant-card {
    height: 100%;
    width: 100%;
  }
}
</style>