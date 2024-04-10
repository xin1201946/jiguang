<template>
  <div class="treeCard">
    <div class="icon_top">
      <a-icon type="appstore" @click="handleClick" />
    </div>
    <div :class="visible ? 'treeCard_width' : 'treeCard_tree'">
      <a-card :bordered="false">
        <slot name="tree"></slot>
      </a-card>
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
  name: 'appstoreTreeCard',
  props: {
    width: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      visible: false,
    }
  },
  methods: {
    //折叠点击
    handleClick() {
      this.visible = !this.visible
      this.$emit('success')
    },
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
  overflow-y: hidden;

  &_tree {
    min-width: 200px;
    max-width: 400px;
    margin-right: 10px;
    height: 100%;
    overflow-y: hidden;
  }

  &_width {
    // min-width: 200px;
    width: 20px;
    margin-right: 10px;
    height: 100%;
    overflow-y: hidden;
    display: none;
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

.icon_top {
  position: absolute;
  top: 5px;
  left: 2px;
  z-index: 999;
  font-size: 20px;
}
</style>