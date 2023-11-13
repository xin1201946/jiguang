<template>
  <div class="treeCard">
    <div class="treeCard_tree">
      <a-card :bordered="false">
        <slot name="tree"></slot>
      </a-card>
    </div>
    <div class="treeCard_card">
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <slot name="query"></slot>
        </div>
        <div class="table-operator">
          <slot name="operator"></slot>
        </div>
        <div class="table">
          <slot></slot>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'treeCard'
}
</script>

<style scoped lang="less">
.treeCard{
  display: flex;
  height: 100%;
  padding-bottom: 20px;
  &_tree{
    min-width: 200px;
    margin-right: 10px;
    height: 100%;
  }
  &_card{
    height: 100%;
    flex: 1;
    overflow-y: hidden;
  }

  /deep/.ant-card{
    height: 100%;
    width: 100%;
  }
}
</style>