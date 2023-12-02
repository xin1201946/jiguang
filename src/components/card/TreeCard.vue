<template>
  <div class="treeCard">
    <div :class="width ? 'treeCard_width': 'treeCard_tree'">
      <a-card :bordered="false">
        <slot name="tree"></slot>
      </a-card>
    </div>
    <div class="treeCard_card">
      <a-card :bordered="false">
        <div style="display: flex;flex-direction: column;height: 100%;overflow-y: auto;overflow-x: hidden">
          <div class="table-page-search-wrapper">
            <slot name="query"></slot>
          </div>
          <div class="table-operator">
            <slot name="operator"></slot>
          </div>
          <div >
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
      default: false
    }
  }
}
</script>

<style scoped lang="less">
.treeCard{
  display: flex;
  height: 100%;
  padding-bottom: 20px;
  overflow-y: hidden;
  &_tree{
    min-width: 200px;
    max-width: 400px;
    margin-right: 10px;
    height: 100%;
    overflow-y: hidden;
  }
  &_width{
    min-width: 200px;
    margin-right: 10px;
    height: 100%;
    overflow-y: hidden;
  }
  &_card{
    height: 100%;
    flex: 1;
    overflow-y: hidden;
  }
  .table{
    overflow-y: auto;
    flex: 1;
    overflow-x: hidden;
  }
  /deep/.ant-card-body{
    height: 100%;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  /deep/.ant-card{
    height: 100%;
    width: 100%;
  }
}
</style>